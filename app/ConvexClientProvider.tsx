"use client";

import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { PropsWithChildren } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function ConvexClientProvider({ children }: PropsWithChildren) {
  return (
    <ClerkProvider publishableKey="pk_test_cHJlbWl1bS1jcmlja2V0LTg0LmNsZXJrLmFjY291bnRzLmRldiQ">
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
