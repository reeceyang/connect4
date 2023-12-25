"use client";

import { api } from "@/convex/_generated/api";
import { SignInButton } from "@clerk/clerk-react";
import {
  AuthLoading,
  Authenticated,
  Unauthenticated,
  useMutation,
  useQuery,
} from "convex/react";
import Link from "next/link";

export default function Home() {
  const games = useQuery(api.games.get);
  const makeGame = useMutation(api.games.make);
  const joinGame = useMutation(api.games.join);
  return (
    <div>
      <Unauthenticated>
        Logged out
        <button className="btn">
          <SignInButton mode="modal" />
        </button>
      </Unauthenticated>
      <button className="btn" onClick={() => makeGame()}>
        Make Game
      </button>
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
                <td>{game.player_1}</td>
                <td>{game.player_2}</td>

                <td>
                  <Link href={"/game/" + game._id}>
                    <button
                      className="btn btn-primary"
                      onClick={() => joinGame({ gameId: game._id })}
                    >
                      Join
                    </button>
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
