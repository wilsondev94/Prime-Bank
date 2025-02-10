import HeaderUsername from "@/components/HeaderUsername";
import RecentTransactions from "@/components/RecentTransactions";
import RightSidebar from "@/components/RightSidebar";
import TotalBalance from "@/components/TotalBalance";
import { getAccount, getAccounts } from "@/lib/actions/bankActions";
import { getLoggedInUser } from "@/lib/actions/userActions";
import { redirect } from "next/navigation";

export default async function Home({
  searchParams: { id, page },
}: SearchParamProps) {
  const currentPage = Number(page as string) || 1;

  const loggedInUser = await getLoggedInUser();
  if (!loggedInUser) redirect("sign-in");

  const accounts = await getAccounts({ userId: loggedInUser.$id });
  if (!accounts) return;

  const accountsData = accounts?.data;

  const bankAccountId = accounts?.data[0]?.bankAccountId || (id as string);
  const account = await getAccount({ bankAccountId });

  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderUsername
            type="greeting"
            title="Welcome"
            user={loggedInUser?.firstName || "Guest"}
            subtext="Access and manage your account and transactions efficiently."
          />
          <TotalBalance
            accounts={accountsData}
            totalBanks={accounts?.totalBanks}
            totalCurrentBal={accounts?.totalCurrentBalance}
          />
        </header>
        <RecentTransactions
          accounts={accountsData}
          transactions={account?.transactions}
          bankAccountId={bankAccountId}
          page={currentPage}
        />
      </div>
      {loggedInUser && (
        <RightSidebar
          user={loggedInUser}
          transactions={account?.transactions}
          banks={accountsData?.slice(0, 2)}
        />
      )}
    </section>
  );
}
