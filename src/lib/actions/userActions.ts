"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { cookies } from "next/headers";
import {
  encryptId,
  extractCustomerIdFromUrl,
  parseStringify,
} from "../../../lib/utils";
import {
  CountryCode,
  ProcessorTokenCreateRequest,
  ProcessorTokenCreateRequestProcessorEnum,
  Products,
} from "plaid";
import { plaidClient } from "../plaid";
import { revalidatePath } from "next/cache";
import { addFundingSource, createDwollaCustomer } from "./dwollaActions";
import {
  BANKS_COLLECTION_ID,
  DATABASE_ID,
  USER_COLLECTION_ID,
} from "../../../constants";

export async function signUp({ password, ...userData }: SignUpParams) {
  let newUserAccount;

  try {
    const { email, firstName, lastName } = userData;

    const { account, database } = await createAdminClient();

    // ////////////////////////////////////////////////////
    // create appwrite user
    newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`
    );
    if (!newUserAccount) throw new Error("Failed to create user");

    // create dwolla customer
    const dwollaCustomerUrl = await createDwollaCustomer({
      ...userData,
      type: "personal",
    });
    if (!dwollaCustomerUrl) throw new Error("Error creating dwolla customer");

    const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);

    const newUser = await database.createDocument(
      DATABASE_ID,
      USER_COLLECTION_ID,
      ID.unique(),
      {
        ...userData,
        userId: newUserAccount.$id,
        dwollaCustomerUrl,
        dwollaCustomerId,
      }
    );

    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify(newUser);
  } catch (error) {
    console.error("error", error);
  }
}

async function getUserInfo({ userId }: getUserInfoProps) {
  const { database } = await createAdminClient();
  try {
    const user = await database.listDocuments(DATABASE_ID, USER_COLLECTION_ID, [
      Query.equal("userId", [userId]),
    ]);

    return parseStringify(user.documents[0]);
  } catch (error) {
    console.log(error);
  }
}

export async function signIn({ email, password }: signInProps) {
  try {
    const { account } = await createAdminClient();

    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
    const user = await getUserInfo({ userId: session.userId });

    return parseStringify(user);
  } catch (error) {
    console.error("error", error);
  }
}

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();

    const result = await account.get();
    const user = await getUserInfo({ userId: result.$id });

    return parseStringify(user);
  } catch (error) {
    console.error("error", error);
  }
}

export async function logoutUser() {
  try {
    const { account } = await createSessionClient();

    cookies().delete("appwrite-session");

    return await account.deleteSession("current");
  } catch (error) {
    console.error("error", error);
  }
}

export async function createLinkToken(user: User) {
  try {
    const tokenParams = {
      user: {
        client_user_id: user.$id,
      },
      client_name: `${user.firstName} ${user.lastName}`,
      products: ["auth"] as Products[],
      language: "en",
      country_codes: ["US"] as CountryCode[],
    };

    const res = await plaidClient.linkTokenCreate(tokenParams);

    return parseStringify({ linkToken: res.data.link_token });
  } catch (error) {
    console.log(error);
  }
}

export async function createBankAccount({
  userId,
  bankId,
  accountId,
  accessToken,
  fundingSourceUrl,
  sharableId,
}: createBankAccountProps) {
  try {
    const { database } = await createAdminClient();

    const bankAccount = await database.createDocument(
      DATABASE_ID,
      BANKS_COLLECTION_ID,
      ID.unique(),
      {
        userId,
        bankId,
        accountId,
        accessToken,
        fundingSourceUrl,
        sharableId,
      }
    );

    return parseStringify(bankAccount);
  } catch (error) {
    console.log(error);
  }
}

export async function exchangePublicToken({
  publicToken,
  user,
}: exchangePublicTokenProps) {
  try {
    // Exchange public Token for access token
    const res = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const accessToken = res.data.access_token;
    const itemId = res.data.item_id;

    // Get account information
    const accountInfo = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    const accountData = accountInfo.data.accounts[0];

    // Create a processor token for Dwolla
    const req: ProcessorTokenCreateRequest = {
      access_token: accessToken,
      account_id: accountData.account_id,
      processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
    };

    const processorTokenRes = await plaidClient.processorTokenCreate(req);

    const processorToken = processorTokenRes.data.processor_token;

    // Create a funding source URL for the account(connecting the payment processing functionality,so that fund can be sent and received)
    const fundingSourceUrl = await addFundingSource({
      dwollaCustomerId: user.dwollaCustomerId,
      processorToken,
      bankName: accountData.name,
    });

    if (!fundingSourceUrl) throw new Error("Funding source not created");

    await createBankAccount({
      userId: user.$id,
      bankId: itemId,
      accountId: accountData.account_id,
      accessToken,
      fundingSourceUrl,
      sharableId: encryptId(accountData.account_id),
    });

    revalidatePath("/");

    return parseStringify({ publicTokenExchange: "Complete" });
  } catch (error) {
    console.log(error);
  }
}

export async function getBanks({ userId }: getBanksProps) {
  const { database } = await createAdminClient();

  try {
    const banks = await database.listDocuments(
      DATABASE_ID,
      BANKS_COLLECTION_ID,
      [Query.equal("userId", [userId])]
    );

    return parseStringify(banks.documents);
  } catch (error) {
    console.log(error);
  }
}

export async function getBank({ documentId }: getBankProps) {
  const { database } = await createAdminClient();

  try {
    const bank = await database.listDocuments(
      DATABASE_ID,
      BANKS_COLLECTION_ID,
      [Query.equal("$id", [documentId])]
    );

    return parseStringify(bank.documents[0]);
  } catch (error) {
    console.log(error);
  }
}
