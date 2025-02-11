import HeaderBox from "@/components/HeaderBox";
import PaymentTransferForm from "@/components/PaymentTransferForm";
import { getAccounts } from "@/lib/actions/bankActions";
import { getLoggedInUser } from "@/lib/actions/userActions";
import { redirect } from "next/navigation";

export default async function PaymentTransferPage() {
  const loggedInUser = await getLoggedInUser();
  if (!loggedInUser) redirect("sign-in");

  const accounts = await getAccounts({ userId: loggedInUser.$id });
  if (!accounts) return;

  const accountsData = accounts?.data;

  return (
    <section className="payment-transfer">
      <HeaderBox
        title="Payment Transfer"
        subtext="Please provide any specific details or related noteds to the payment transfer"
      />

      <section>
        <PaymentTransferForm accounts={accountsData} />
      </section>
    </section>
  );
}
