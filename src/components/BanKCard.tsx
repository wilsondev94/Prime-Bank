import Link from "next/link";
import React from "react";
import { formatAmount } from "../lib/utils";
import Image from "next/image";
import CopyId from "./CopyId";

function BankCard({ account, userName, showBalance = true }: BankCardProps) {
  return (
    <div className="flex flex-col">
      <Link
        href={`/transaction-history/?id=${account.bankAccountId}`}
        className="bank-card"
      >
        <div className="bank-card_content">
          <div>
            <h1 className="text-16 text-white font-semibold">{account.name}</h1>
            <p className="font-inter font-black text-white">
              {formatAmount(account?.currentBalance)}
            </p>
          </div>
          <article className="flex flex-col gap-2">
            <div className="flex justify-between">
              <h1 className="text-12 font-semibold text-white">{userName}</h1>
              <h2 className="text-12 font-semibold text-white">○○ / ○○</h2>
            </div>
            <p className="text-14 font-semibold tracking-[1.1px] text-white">
              ○○○○ ○○○○ ○○○○ <span className="text-16">{account?.mask}</span>
            </p>
          </article>
        </div>
        <div className="bank-card_icon">
          <Image
            src="/icons/paypass.svg"
            width={45}
            height={32}
            alt="paypass icon"
          />
          <Image
            src="/icons/mastercard.svg"
            width={45}
            height={32}
            alt="mastercard icon"
            className=""
          />
          <Image
            src="/icons/lines.svg"
            width={316}
            height={190}
            alt="lines icon"
            className="absolute top-0 left-0"
          />
        </div>
      </Link>
      {showBalance && <CopyId title={account?.sharableId} />}
    </div>
  );
}

export default BankCard;
