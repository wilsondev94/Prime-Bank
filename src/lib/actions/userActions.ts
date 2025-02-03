"use server";

import { ID } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { cookies } from "next/headers";
import { parseStringify } from "../../../lib/utils";

export async function signIn({ email, password }: signInProps) {
  try {
    const { account } = await createAdminClient();

    const res = await account.createEmailPasswordSession(email, password);

    return parseStringify(res);
  } catch (error) {
    console.error("error", error);
  }
}

export async function signUp(userData: SignUpParams) {
  try {
    const { email, password, firstName, lastName } = userData;

    const { account } = await createAdminClient();

    const newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`
    );

    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify(newUserAccount);
  } catch (error) {
    console.error("error", error);
  }
}

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();

    return await account.get();
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
