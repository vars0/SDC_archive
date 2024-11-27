import Link from 'next/link';

export default function NavLink({ href, children }) {
    return (
        <Link href={href}>
            <div style={{ textDecoration: 'none', color: 'blue' }}>{children}</div>
        </Link>
    );
}
