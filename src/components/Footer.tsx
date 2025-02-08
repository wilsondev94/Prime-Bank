import { logoutUser } from "@/lib/actions/userActions";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Footer({ user, type = "desktop" }: FooterProps) {
  const router = useRouter();

  async function handleLogout() {
    const logout = await logoutUser();
    if (logout) router.push("sign-in");
  }
  return (
    <footer className="footer ">
      <div className={type === "mobile" ? "footer_name-mobile" : "footer_name"}>
        <p className="text-xl font-bold text-gray-700">
          {user?.firstName.at(0)}
        </p>
      </div>
      <div
        className={type === "mobile" ? "footer_email-mobile" : "footer_email"}
      >
        <h1 className="text-14 truncate text-gray-700 font-semibold">
          {user?.name}
        </h1>
        <p className="text-14 truncate font-semibold text-gray-600">
          {user?.email}
        </p>
      </div>
      <div className="footer_image" onClick={handleLogout}>
        <Image src="icons/logout.svg" fill alt="logout icon" />
      </div>
    </footer>
  );
}
