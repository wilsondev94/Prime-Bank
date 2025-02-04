import HeaderUsername from "@/components/HeaderUsername";
import RightSidebar from "@/components/RightSidebar";
import TotalBalance from "@/components/TotalBalance";
import { getLoggedInUser } from "@/lib/actions/userActions";

export default async function Home() {
  const loggedInUser = await getLoggedInUser();

  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderUsername
            type="greeting"
            title="Welcome"
            user={loggedInUser?.name || "Guest"}
            subtext="Access and manage your account and transactions efficiently."
          />
          <TotalBalance
            accounts={[]}
            totalBanks={1}
            totalCurrentBal={1200.35}
          />
        </header>
        RECENT TRANSACTIONS
      </div>
      {loggedInUser && (
        <RightSidebar
          user={loggedInUser}
          transacion={[]}
          banks={[{ currentBalance: 1500 }, { currentBalance: 1700 }]}
        />
      )}
    </section>
  );
}
