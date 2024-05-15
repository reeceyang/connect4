"use client";

import { UserProfile } from "@clerk/clerk-react";

export default function Page() {
  return (
    <div className="m-auto w-fit">
      <UserProfile />
    </div>
  );
}
