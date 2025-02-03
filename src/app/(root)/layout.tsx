import MobileNavbar from "@/components/MobileNavbar";
import Sidebar from "@/components/Sidebar";
import { getLoggedInUser } from "@/lib/actions/userActions";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const loggedInUser = await getLoggedInUser();

  if (!loggedInUser) redirect("/sign-in");

  return (
    <main
      className="flex h-screen w-full
     font-inter"
    >
      <Sidebar user={loggedInUser} />
      <div className="flex  size-full flex-col">
        <div className="root-layout">
          <Image src="/icons/logo.svg" width={30} height={30} alt="menu icon" />
          <div>
            <MobileNavbar user={loggedInUser} />
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}
