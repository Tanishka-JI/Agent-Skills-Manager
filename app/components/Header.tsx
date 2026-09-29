"use client";

import Link from "next/link";
import { useAuth } from "../hooks/useAuth";

const navLink =
  "text-sm rounded-md hover:bg-base-300 hover:text-primary transition-colors";

export default function Header() {
  const { isAuthenticated, user, logout, isLoading } = useAuth();

  return (
    <div className="navbar bg-base-200/60 backdrop-blur border-b border-base-300 px-4">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-200 border border-base-300 rounded-box z-10 mt-3 w-52 p-2"
          >
            <li>
              <Link href="/skills">Browse Skills</Link>
            </li>
            {isAuthenticated && (
              <li>
                <Link href="/dashboard">Dashboard</Link>
              </li>
            )}
          </ul>
        </div>

        <Link href="/" className="btn btn-ghost text-xl px-2 gap-2">
          <span>🤖</span>
          <span className="font-semibold">Agent Skills</span>
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-1">
          <li>
            <Link href="/skills" className={navLink}>
              Browse Skills
            </Link>
          </li>
          {isAuthenticated && (
            <li>
              <Link href="/dashboard" className={navLink}>
                Dashboard
              </Link>
            </li>
          )}
        </ul>
      </div>

      <div className="navbar-end">
        {isLoading ? (
          <span className="loading loading-spinner loading-sm text-primary"></span>
        ) : isAuthenticated ? (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-square"
            >
              <div className="w-9 h-9 flex items-center justify-center border border-primary text-primary font-bold rounded-field">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-200 border border-base-300 rounded-box z-10 mt-3 w-52 p-2"
            >
              <li className="menu-title text-primary">{user?.name}</li>
              <li>
                <Link href="/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link href="/dashboard/skills/new">Create Skill</Link>
              </li>
              <li>
                <button onClick={logout}>Logout</button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link href="/login" className="btn btn-ghost btn-sm">
              Login
            </Link>
            <Link href="/register" className="btn btn-primary btn-sm">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}