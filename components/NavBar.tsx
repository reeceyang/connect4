"use client";

import {
  SignInButton,
  SignOutButton,
  UserProfile,
  useUser,
} from "@clerk/clerk-react";
import { IconUserCircle } from "@tabler/icons-react";
import { Unauthenticated, Authenticated } from "convex/react";
import Link from "next/link";
import { useRef } from "react";

const NavBar = () => {
  const { user } = useUser();
  const dialogRef = useRef<HTMLDialogElement>(null);
  return (
    <>
      <div className="navbar bg-neutral gap-2 mb-16">
        <Link href="/">
          <button className="btn btn-neutral text-xl">connect4</button>
        </Link>
        <div className="flex-1" />
        <Unauthenticated>
          <SignInButton mode="modal">
            <button className="btn btn-primary">Sign in</button>
          </SignInButton>
        </Unauthenticated>

        <Authenticated>
          <div className="dropdown">
            <div className="btn" role="button" tabIndex={0}>
              <IconUserCircle />
              Welcome, {user?.username}
            </div>
            <ul
              tabIndex={0}
              className="menu menu-md dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-40"
            >
              <li>
                <Link href="/settings">Settings</Link>
              </li>
              <li>
                <SignOutButton>Sign out</SignOutButton>
              </li>
            </ul>
          </div>
        </Authenticated>
      </div>
      <Authenticated>
        <dialog className="modal overflow-y-auto" ref={dialogRef}>
          <UserProfile />
        </dialog>
      </Authenticated>
    </>
  );
};

export default NavBar;
