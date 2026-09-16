import Link from "next/link";
export default function Header() {
    return (
        <div className="navbar bg-base-100 shadow-sm">
  <a className="btn btn-ghost text-xl">daisyUI</a>
 <div className="flex-1"></div>
 <ul className="menu menu-horizontal px-1">
   <li>
    <Link href="/skills">skills</Link>
   </li>
   <li>
    <Link href="/about">about</Link></li>
    <li>
    <Link href="/login">login</Link>
    </li>
    <li>
    <Link href="/register">register</Link>
    </li>
 </ul>



</div>
    );
}