import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { NUM_COLS, Player } from "./constants";

export const get = query({
  args: {
    gameId: v.id("games"),
  },
  handler: async (ctx, args) => {
    const moves = await ctx.db
      .query("moves")
      .filter((q) => q.eq(q.field("gameId"), args.gameId))
      .order("asc")
      .collect();
    return getBoard(moves);
  },
});

export const getBoard = (moves: Array<{ column: number }>) => {
  const board: number[][] = Array(NUM_COLS)
    .fill(undefined)
    .map((_) => []);
  let isPlayer1 = true;
  for (const move of moves) {
    board[move.column].push(isPlayer1 ? Player.P1 : Player.P2);
    isPlayer1 = !isPlayer1;
  }
  return board;
};

export const getTurn = (moves: Array<{ column: number }>): Player => {
  return (moves.length % 2) + 1;
};

export const turn = query({
  args: {
    gameId: v.id("games"),
  },
  handler: async (ctx, args) => {
    const moves = await ctx.db
      .query("moves")
      .filter((q) => q.eq(q.field("gameId"), args.gameId))
      .collect();
    return getTurn(moves);
  },
});
