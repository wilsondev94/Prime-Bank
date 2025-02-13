import HeaderBox from "@/components/HeaderBox";
import { getAccount, getAccounts } from "@/lib/actions/bankActions";
import { getLoggedInUser } from "@/lib/actions/userActions";
import { redirect } from "next/navigation";
import React from "react";
import { formatAmount } from "../../../lib/utils";
import TransactionsTable from "@/components/TransactionsTable";
import { Pagination } from "@/components/Pagination";

export default async function TransactionHistoryPage({
  searchParams: { id, page },
}: SearchParamProps) {
  const loggedInUser = await getLoggedInUser();
  if (!loggedInUser) redirect("sign-in");

  const accounts = await getAccounts({ userId: loggedInUser.$id });
  if (!accounts) return;

  const bankAccountId = accounts?.data[0]?.bankAccountId || (id as string);
  const account = await getAccount({ bankAccountId });
  const acct = account?.data;

  const currentPage = Number(page as string) || 1;
  const rowsPerPage = 10;
  const totalPage = Math.ceil(account?.transactions.length / rowsPerPage);

  const lastTransactionIndex = currentPage * rowsPerPage;
  const firstTransactionIndex = lastTransactionIndex - rowsPerPage;

  const currentTransactions = account?.transactions.slice(
    firstTransactionIndex,
    lastTransactionIndex
  );

  return (
    <div className="transactions">
      <div className="transactions-header">
        <HeaderBox
          title="Transaction History"
          subtext="See your bank details and transactions"
        />
      </div>

      <div className="space-y-6">
        <div className="transactions-account">
          <div className="flex flex-col gap-2">
            <h2 className="text-18 font-bold text-white">{acct.name}</h2>
            <p className="text-14 text-blue-25">{acct.officialName}</p>
            <p className="text-14 font-semibold tracking-[1.1px] text-white">
              ○○○○ ○○○○ ○○○○ <span className="text-16">{acct.mask}</span>
            </p>
          </div>
          <div className="transactions-account-balance">
            <p className="text-14">Current balance</p>
            <p className="text-24 text-center font-bold">
              {formatAmount(acct.currentBalance)}
            </p>
          </div>
        </div>
        <section className="flex w-full flex-col gap-6">
          <TransactionsTable transactions={currentTransactions} />
          {totalPage > 1 && (
            <div className="my-4 w-full">
              <Pagination totalPages={totalPage} page={currentPage} />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
