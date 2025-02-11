import Link from "next/link";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BankTabItem } from "./BankTabItem";
import BankInfo from "./BankInfo";
import TransactionsTable from "./TransactionsTable";
import { Pagination } from "./Pagination";

export default function RecentTransactions({
  accounts,
  transactions,
  bankAccountId,
  page,
}: RecentTransactionsProps) {
  const rowsPerPage = 10;
  const totalPage = Math.ceil(transactions.length / rowsPerPage);

  const lastTransactionIndex = page * rowsPerPage;
  const firstTransactionIndex = lastTransactionIndex - rowsPerPage;

  const currentTransactions = transactions.slice(
    firstTransactionIndex,
    lastTransactionIndex
  );

  return (
    <section className="recent-transactions">
      <header className="flex items-center justify-between">
        <h2 className="recent-transactions-label">Recent Transactions</h2>
        <Link
          href={`/transaction-history/?id=${bankAccountId}`}
          className="view-all-btn"
        >
          View all
        </Link>
      </header>
      <Tabs defaultValue={bankAccountId} className="w-full">
        <TabsList className="recent-transactions-tablist">
          {accounts.map((account) => (
            <TabsTrigger key={account.id} value={account.bankAccountId}>
              <BankTabItem
                account={account}
                bankAccountId={bankAccountId}
                key={account.id}
              />
            </TabsTrigger>
          ))}
        </TabsList>
        {accounts.map((account: Account) => (
          <TabsContent
            value={account.bankAccountId}
            key={account.id}
            className="space-y-4"
          >
            <BankInfo
              account={account}
              bankAccountId={bankAccountId}
              type="full"
            />
            <TransactionsTable transactions={currentTransactions} />
            {totalPage > 1 && (
              <div className="my-4 w-full">
                <Pagination totalPages={totalPage} page={page} />
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
