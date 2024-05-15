"use client";

import { api } from "@/convex/_generated/api";
import { GameWinner } from "@/convex/constants";
import { SignInButton, UserProfile, useUser } from "@clerk/clerk-react";
import { IconCrown, IconUserCircle } from "@tabler/icons-react";
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
              <th>Game</th>
            </tr>
          </thead>
          <tbody>
            {games?.map((game, i) => (
              <tr key={i}>
                <th>{i}</th>
                <td>{new Date(game._creationTime).toLocaleString()}</td>
                <td>
                  <span className="flex flex-row items-center">
                    <IconCrown
                      className={`mr-2 stroke-yellow-500 ${
                        game.winner === GameWinner.P1 ||
                        game.winner === GameWinner.TIE
                          ? "visible"
                          : "invisible"
                      }`}
                    />
                    {game.player_1_username}
                  </span>
                </td>
                <td>
                  <span className="flex flex-row items-center">
                    <IconCrown
                      className={`mr-2 stroke-yellow-500 ${
                        game.winner === GameWinner.P2 ||
                        game.winner === GameWinner.TIE
                          ? "visible"
                          : "invisible"
                      }`}
                    />
                    {game.player_2_username}
                  </span>
                </td>

                <td>
                  <Link href={"/game/" + game._id}>
                    {game.winner === GameWinner.ONGOING ? (
                      game.player_2 === identity?.tokenIdentifier ||
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
                      )
                    ) : (
                      <button className="btn">View</button>
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
