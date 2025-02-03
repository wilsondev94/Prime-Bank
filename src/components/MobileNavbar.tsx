"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarLinks } from "../../constants";
import Footer from "./Footer";

export default function MobileNavbar({ user }: MobileNavProps) {
  const pathname = usePathname();

  return (
    <section className="w-full max-w-[264px]">
      <Sheet>
        <SheetTrigger>
          <Image
            src="/icons/hamburger.svg"
            width={30}
            height={30}
            alt="Sidebar icon"
            className="cursor-pointer"
          />
        </SheetTrigger>
        <SheetContent side="left" className="border-none bg-white">
          <Link
            href="/"
            className="px-4 flex cursor-pointer items-center gap-1"
          >
            <Image
              src="/icons/logo.svg"
              width={36}
              height={36}
              alt="Prime logo"
            />
            <h1 className="text-26 font-inter font-bold text-black-3">Prime</h1>
          </Link>
          <div className="mobilenav-sheet">
            <SheetClose asChild>
              <nav
                className="flex h-full flex-col
               gap-6 pt-16 text-white"
              >
                {sidebarLinks.map((item) => {
                  const isActive =
                    pathname === item.route ||
                    pathname.startsWith(`${item.route}/`);

                  return (
                    <SheetClose asChild key={item.route}>
                      <Link
                        href={item.route}
                        key={item.label}
                        className={cn(
                          "mobilenav-sheet_close w-full",
                          isActive && "bg-bank-gradient"
                        )}
                      >
                        <Image
                          src={item.imgURL}
                          alt={item.label}
                          width={20}
                          height={20}
                          className={cn(isActive && "brightness-[3] invert-0")}
                        />

                        <p
                          className={cn(
                            "text-16 font-bold text-black-2",
                            isActive && "text-white"
                          )}
                        >
                          {item.label}
                        </p>
                      </Link>
                    </SheetClose>
                  );
                })}
              </nav>
            </SheetClose>
            <Footer user={user} type="mobile" />
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
}
