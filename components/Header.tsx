import Link from "next/link";
import Image from "next/image";
import NavItems from "./NavItems";
import UserDropDown from "./UserDropDown";
import { searchStocks } from "@/lib/actions/finnhub.actions";

const Header = async ({ user }: { user: User }) =>
{
  const initialStocks = await searchStocks();

  return (
    <header className="sticky top-0 header">
      <div className="container header-wrapper">
        <Link href="/">
          <Image
            src="/assets/icons/logo.svg"
            alt="QuantaX"
            width={140}
            height={32}
            className="h-8 w-auto cursor-pointer"
          />
        </Link>
        <NavItems initialStocks={initialStocks}/>
        <nav className="hidden sm:block"></nav>
        <UserDropDown user={user} initialStocks={initialStocks}/>
      </div>
    </header>
  );
};

export default Header;
