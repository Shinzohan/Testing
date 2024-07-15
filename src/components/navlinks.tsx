"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface LinkType {
    url: string;
    icon: React.ElementType; 
}

interface NavLinkProps {
    link: LinkType;
}

const NavLink: React.FC<NavLinkProps> = ({ link }) => {
    const pathName = usePathname();
    const Icon = link.icon; 

    return (
        <Link href={link.url}>
            <div className={`flex items-center gap-1 p-5 cursor-pointer ${pathName === link.url ? "bg-gray-500 rounded-3xl text-white" : ""}`}>
                {Icon && <Icon className="text-xl" />} {/* Render icon if available */}
            </div>
        </Link>
    );
};

export default NavLink;

