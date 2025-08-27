import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="m-0 flex h-auto items-center justify-between p-0">
      <Link href="/" className="m-0 p-0">
        <Image src="/img/logo.svg" alt="do it;" width={120} height={12} className="block" />
      </Link>
    </header>
  );
}
