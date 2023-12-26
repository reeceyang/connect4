"use client";

import { UserProfile, useAuth } from "@clerk/clerk-react";

export default function Page() {
  return (
    <div className="m-auto w-fit">
      <UserProfile />
    </div>
  );
}
