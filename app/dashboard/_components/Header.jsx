"use client";

import React, { useContext } from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { UserDetailContext } from "../../_context/UserDetailContext";

function Header() {
  const { userDetail } = useContext(UserDetailContext);

  return (
    <div
      className="navbar bg-base-100 shadow-sm"
      style={{
        width: "100%",
        padding: "12px 24px",
      }}
    >
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost text-xl">
          Interior AI
        </Link>
      </div>

      <div className="flex-none gap-2">
        <Link href="/dashboard/buy-credits" className="btn btn-ghost">
          Buy More Credits
        </Link>

        <button className="btn">
          <div className="badge badge-secondary">
            {userDetail?.credits ?? 0}
          </div>
          Credits left
        </button>

        <UserButton />
      </div>
    </div>
  );
}

export default Header;