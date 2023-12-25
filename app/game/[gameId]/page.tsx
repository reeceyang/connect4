"use client";

import { NUM_ROWS, P1, P2 } from "@/constants";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";

export default function Page({ params }: { params: { gameId: string } }) {
  const board = useQuery(api.boards.get, {
    gameId: params.gameId as Id<"games">,
  });
  const make = useMutation(api.moves.make);

  return (
    <div>
      Game {params.gameId}
      <div className="flex flex-row gap-2">
        {board?.map((col, i) => (
          <div
            className="flex flex-col-reverse gap-2 hover:brightness-125 cursor-pointer"
            key={i}
            onClick={() =>
              make({ gameId: params.gameId as Id<"games">, column: i })
            }
          >
            {Array.from({ ...col, length: NUM_ROWS }).map((piece, j) => (
              <div
                className={`w-16 h-16 mask mask-circle ${
                  piece === P1
                    ? "bg-primary"
                    : piece === P2
                    ? "bg-secondary"
                    : "bg-base-200"
                }`}
                key={`${i}-${j}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
