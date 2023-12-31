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
  const { isSignedIn } = useUser();
  const identity = useQuery(api.users.getIdentity);
  return (
    <div className="container m-auto">
      <div className="flex flex-row">
        <h1 className="text-3xl font-bold mr-auto">Lobby</h1>
        <button className="btn" onClick={() => makeGame()}>
          New Game
        </button>
      </div>
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
                      <button className="btn btn-secondary">Play</button>
                    ) : !isSignedIn ? (
                      <button className="btn btn-neutral">Spectate</button>
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
