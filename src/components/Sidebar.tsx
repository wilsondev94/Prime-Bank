"use client";

import Image from "next/image";
import Link from "next/link";
import { sidebarLinks } from "../../constants";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Footer from "./Footer";
import PlaidLink from "./PlaidLink";

export default function Sidebar({ user }: SiderbarProps) {
  const pathname = usePathname();

  return (
    <section className="sidebar">
      <nav className="flex flex-col gap-4">
        <Link href="/" className="mb-12 flex cursor-pointer items-center gap-2">
          <Image
            src="/icons/logo.svg"
            width={36}
            height={36}
            alt="Prime logo"
            className=" max-xl:size-14"
          />
          <h1 className="sidebar-logo">Prime</h1>
        </Link>
        {sidebarLinks.map((item) => {
          const isActive =
            pathname === item.route || pathname.startsWith(`${item.route}/`);

          return (
            <Link
              href={item.route}
              key={item.label}
              className={cn(
                "sidebar-link hover:bg-gray-200",
                isActive && "bg-bank-gradient"
              )}
            >
              <div className="relative size-6">
                <Image
                  src={item.imgURL}
                  alt={item.label}
                  fill
                  className={cn(isActive && "brightness-[3] invert-0")}
                />
              </div>
              <p className={cn("sidebar-label", isActive && "!text-white")}>
                {item.label}
              </p>
            </Link>
          );
        })}
        <PlaidLink user={user} />
      </nav>
      <Footer user={user} />
    </section>
  );
}
