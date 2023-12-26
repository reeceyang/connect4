"use client";

import Piece from "@/components/Piece";
import { NUM_ROWS, Player } from "@/convex/constants";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";

export default function Page({ params }: { params: { gameId: string } }) {
  const board = useQuery(api.boards.get, {
    gameId: params.gameId as Id<"games">,
  });
  const game = useQuery(api.games.get, {
    gameId: params.gameId as Id<"games">,
  });
  const turn = useQuery(api.boards.turn, {
    gameId: params.gameId as Id<"games">,
  });
  const make = useMutation(api.moves.make);

  return (
    <div className="container">
      <div className="flex flex-row flex-wrap-reverse">
        <div className="stats md:stats-vertical m-auto">
          <div className="stat">
            <div className="stat-figure text-secondary">
              <Piece player={1} />
            </div>
            <div className="stat-title">Player 1</div>
            <div className="stat-value">{game?.player_1_username}</div>
            <div className="stat-desc">
              {turn === Player.P1 ? "Current" : "Next"} turn
            </div>
          </div>
          <div className="stat">
            <div className="stat-figure text-secondary">
              <Piece player={2} />
            </div>
            <div className="stat-title">Player 2</div>
            <div className="stat-value">
              {game?.player_2_username ?? (
                <button className="btn">Invite</button>
              )}
            </div>
            {game?.player_2_username && (
              <div className="stat-desc">
                {turn === Player.P2 ? "Current" : "Next"} turn
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-row gap-2 m-auto">
          {board?.map((col, i) => (
            <div
              className="flex flex-col-reverse gap-2 hover:brightness-105 cursor-pointer"
              key={i}
              onClick={() =>
                make({ gameId: params.gameId as Id<"games">, column: i })
              }
            >
              {Array.from({ ...col, length: NUM_ROWS }).map((piece, j) => (
                <Piece player={piece} key={`${i}-${j}`} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
