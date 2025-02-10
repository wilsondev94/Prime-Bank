import BankCard from "@/components/BankCard";
import HeaderBox from "@/components/HeaderBox";
import { getAccounts } from "@/lib/actions/bankActions";
import { getLoggedInUser } from "@/lib/actions/userActions";
import { redirect } from "next/navigation";

export default async function MyBanksPage() {
  const loggedInUser = await getLoggedInUser();
  if (!loggedInUser) redirect("sign-in");

  const accounts = await getAccounts({ userId: loggedInUser.$id });
  if (!accounts) return;

  return (
    <section className="flex">
      <div className="my-banks">
        <HeaderBox
          title="My Bank Accounts"
          subtext="Manage your banking activities"
        />
        <div className="space-y-4">
          <h2 className="header-2">Your cards</h2>
          <div className="flex flex-wrap gap-6">
            {accounts &&
              accounts.data.map((account: Account) => (
                <BankCard
                  key={account.id}
                  account={account}
                  userName={loggedInUser?.firstName}
                />
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
