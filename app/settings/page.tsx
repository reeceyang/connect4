"use client";

import { UserProfile, useAuth } from "@clerk/clerk-react";
import { useRouter } from "next/navigation";

export default function Page() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  if (!isSignedIn) {
    router.replace("/");
    return null;
  }
  return (
    <div className="m-auto w-fit">
      <UserProfile />
    </div>
  );
}
