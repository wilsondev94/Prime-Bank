"use client";

import CountUp from "react-countup";

export default function AnimatedCounter({ amount }: { amount: number }) {
  return (
    <div className="w-full">
      <CountUp
        end={amount}
        decimals={2}
        decimal="."
        prefix="$"
        duration={2.75}
      />
    </div>
  );
}
