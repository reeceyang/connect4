"use client";

import { api } from "@/convex/_generated/api";
import { SignInButton, UserProfile, useUser } from "@clerk/clerk-react";
import { IconUserCircle } from "@tabler/icons-react";
import {
  AuthLoading,
  Authenticated,
  Unauthenticated,
  useMutation,
  useQuery,
} from "convex/react";
import Link from "next/link";
import { useRef } from "react";

export default function Home() {
  const games = useQuery(api.games.getAll);
  const makeGame = useMutation(api.games.make);
  const joinGame = useMutation(api.games.join);
  const { user, isSignedIn } = useUser();
  const identity = useQuery(api.users.getIdentity);
  const dialogRef = useRef<HTMLDialogElement>(null);
  return (
    <div>
      <div className="navbar gap-2">
        <Link href="/">
          <button className="btn btn-ghost text-xl">connect4</button>
        </Link>
        <button className="btn" onClick={() => makeGame()}>
          Make Game
        </button>
        <div className="flex-1" />
        <Unauthenticated>
          <SignInButton mode="modal">
            <button className="btn">Sign in</button>
          </SignInButton>
        </Unauthenticated>

        <Authenticated>
          <button
            className="btn"
            onClick={() => {
              dialogRef.current?.showModal();
            }}
          >
            <IconUserCircle />
            Welcome, {user?.username}
          </button>
        </Authenticated>
      </div>
      <Authenticated>
        <dialog className="modal overflow-y-auto" ref={dialogRef}>
          <UserProfile />
        </dialog>
      </Authenticated>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>#</th>
              <th>Time Started</th>
              <th>Player 1</th>
              <th>Player 2</th>
              <th>Join Game</th>
            </tr>
          </thead>
          <tbody>
            {games?.map((game, i) => (
              <tr key={i}>
                <th>{i}</th>
                <td>{new Date(game._creationTime).toLocaleString()}</td>
                <td>{game.player_1_username}</td>
                <td>{game.player_2_username}</td>

                <td>
                  <Link href={"/game/" + game._id}>
                    {game.player_2 === identity?.tokenIdentifier ||
                    game.player_1 === identity?.tokenIdentifier ? (
                      <button className="btn btn-primary">Play</button>
                    ) : !isSignedIn ? (
                      <button className="btn btn-primary">Spectate</button>
                    ) : (
                      <button
                        className="btn btn-primary"
                        onClick={() => joinGame({ gameId: game._id })}
                      >
                        Join
                      </button>
                    )}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
