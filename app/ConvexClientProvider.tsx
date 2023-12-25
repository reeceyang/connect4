"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ClerkProvider, useAuth, useUser } from "@clerk/clerk-react";
import { ConvexReactClient, useConvexAuth, useMutation } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { PropsWithChildren, useEffect, useState } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const StoreUserWrapper = ({ children }: PropsWithChildren) => {
  const { isAuthenticated } = useConvexAuth();
  const { user } = useUser();
  // When this state is set we know the server
  // has stored the user.
  const [userId, setUserId] = useState<Id<"users"> | null>(null);
  const storeUser = useMutation(api.users.store);
  // Call the `storeUser` mutation function to store
  // the current user in the `users` table and return the `Id` value.
  useEffect(() => {
    // If the user is not logged in don't do anything
    if (!isAuthenticated || !user) {
      return;
    }
    // Store the user in the database.
    // Recall that `storeUser` gets the user information via the `auth`
    // object on the server. You don't need to pass anything manually here.
    async function createUser() {
      const id = await storeUser({ username: user?.username ?? undefined });
      setUserId(id);
    }
    createUser();
    return () => setUserId(null);
    // Make sure the effect reruns if the user logs in with
    // a different identity
  }, [isAuthenticated, storeUser, user]);

  return children;
};

export default function ConvexClientProvider({ children }: PropsWithChildren) {
  return (
    <ClerkProvider publishableKey="pk_test_cHJlbWl1bS1jcmlja2V0LTg0LmNsZXJrLmFjY291bnRzLmRldiQ">
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <StoreUserWrapper>{children}</StoreUserWrapper>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
