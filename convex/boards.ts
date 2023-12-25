import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

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
    // FIXME: magic numbers
    const board: number[][] = Array(7)
      .fill(undefined)
      .map((_) => []);
    let isPlayer1 = true;
    for (const move of moves) {
      board[move.column].push(isPlayer1 ? 1 : 2);
      isPlayer1 = !isPlayer1;
    }
    return board;
  },
});

export const turn = query({
  args: {
    gameId: v.id("games"),
  },
  handler: async (ctx, args) => {
    const moves = await ctx.db
      .query("moves")
      .filter((q) => q.eq(q.field("gameId"), args.gameId))
      .collect();
    return (moves.length % 2) + 1;
  },
});
