"use client";

import { useCallback, useEffect, useState } from "react";
import {
  PlaidLinkOnSuccess,
  PlaidLinkOptions,
  usePlaidLink,
} from "react-plaid-link";

import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import {
  createLinkToken,
  exchangePublicToken,
} from "@/lib/actions/userActions";
import Image from "next/image";

export default function PlaidLink({ user, variant }: PlaidLinkProps) {
  const router = useRouter();
  const [token, setToken] = useState("");

  useEffect(() => {
    const getLinkToken = async () => {
      const data = await createLinkToken(user);
      setToken(data?.linkToken);
    };

    getLinkToken();
  }, [user]);

  const onSuccess = useCallback<PlaidLinkOnSuccess>(
    async (public_token: string) => {
      await exchangePublicToken({
        publicToken: public_token,
        user,
      });

      router.push("/");
    },
    [user, router]
  );

  const config: PlaidLinkOptions = {
    token,
    onSuccess,
  };

  const { open, ready } = usePlaidLink(config);

  return (
    <>
      {variant === "primary" ? (
        <Button
          onClick={() => open()}
          disabled={!ready}
          className="plaidlink-primary hover:bg-gray-200"
        >
          Connect bank
        </Button>
      ) : variant === "ghost" ? (
        <Button
          variant="ghost"
          onClick={() => open()}
          className="plaidlink-ghost hover:bg-gray-200"
        >
          <Image
            src="/icons/connect-bank.svg"
            alt="Connect bank"
            height={24}
            width={24}
          />
          <p className="hidden xl:block text-[16px] font-semibold text-black-2">
            Connect bank
          </p>
        </Button>
      ) : (
        <Button
          onClick={() => open()}
          className="plaidlink-default hover:bg-gray-200"
        >
          <Image
            src="/icons/connect-bank.svg"
            alt="Connect bank"
            height={24}
            width={24}
          />
          <p className="text-[16px] font-semibold text-black-2">Connect bank</p>
        </Button>
      )}
    </>
  );
}
