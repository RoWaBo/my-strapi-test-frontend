import { useRouter } from 'next/dist/client/router';
import Link from 'next/link'

type NavLinkProps = {
    href: string
    className?: string
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, className, ...props }) => {
    const router = useRouter()

    const linkIsActive = router.route === href

    const activePassiveStyle = linkIsActive ? 'border-b-2 border-primary' : 'text-gray-400'

    return (
        <Link
            href={href}
            {...props}
        >
            <a
                className={`flex items-center px-3 py-2 text-sm font-medium w-full hover:bg-gray-100 hover:text-black ${className} ${activePassiveStyle}`}>
                {children}
            </a>
        </Link>
    );
}

export default NavLink;