import Link from "next/link";
import Image from "next/image";
import { NavLinks } from "@/constants";
import { AuthProviders, ProfileMenu } from ".";
import { getCurrentUser } from "@/lib/session";


const Navbar: React.FC = async () => {
    const session = await getCurrentUser();

    return(
        <nav className="flexBetween navbar">
            <div className="flex-1 flexStart gap-10">
                <Link href="/">
                    <Image 
                        src="/logo.svg"
                        alt="app logo"
                        width={115}
                        height={43}
                        className="object-contain"
                    />
                </Link>
            </div>
            <ul className="xl:flex flex-5 hidden text-sm gap-7">
                    {NavLinks.map((link) => (
                        <Link
                            key={link.key}
                            href={link.href}
                            className="link_hover"
                        >
                            {link.text}
                        </Link>
                    ))}
                </ul>
            <div className="flexEnd gap-4 flex-1">
                {session?.user ? (
                    <>
                        <ProfileMenu session={session}/>
                        <Link
                            href="/create-project"
                        >
                            Share Work
                        </Link>
                    </>
                ) : (
                    <AuthProviders />
                )}
            </div>
        </nav>
    )
}

export default Navbar;