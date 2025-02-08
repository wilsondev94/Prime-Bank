"use client";

import AnimatedCounter from "./AnimatedCounter";
import TotalBalChart from "./TotalBalChart";

export default function TotalBalance({
  accounts = [],
  totalBanks,
  totalCurrentBal,
}: TotlaBalanceProps) {
  return (
    <section className="total-balance">
      <div className="total-balance-chart">
        <TotalBalChart accounts={accounts} />
      </div>
      <div className="flex flex-col gap-6">
        <h2 className="header-2">Bank Accounts: {totalBanks}</h2>
        <div className="flex flex-col gap-2">
          <p className="total-balance-label">Total Current Balance</p>
          <div className="total-balance-amount flex-center gap-2">
            <AnimatedCounter amount={totalCurrentBal} />
          </div>
        </div>
      </div>
    </section>
  );
}
