import Link from "next/link";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BankTabItem } from "./BankTabItem";
import BankInfo from "./BankInfo";
import TransactionsTable from "./TransactionsTable";

export default function RecentTransactions({
  accounts,
  transactions,
  bankAccountId,
  page,
}: RecentTransactionsProps) {
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
            <TransactionsTable transactions={transactions} />
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
