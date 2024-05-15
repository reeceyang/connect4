import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getBoard, getTurn, getWinner } from "./boards";
import { GameWinner, NUM_ROWS, Player } from "./constants";

export const make = mutation({
  args: {
    column: v.number(),
    gameId: v.id("games"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Unauthenticated call to mutation");
    }
    const moves = await ctx.db
      .query("moves")
      .filter((q) => q.eq(q.field("gameId"), args.gameId))
      .order("asc")
      .collect();
    const game = await ctx.db.get(args.gameId);
    if (game.winner !== GameWinner.ONGOING) {
      // the game is over
      return;
    }
    const isPlayer1 = game.player_1 === identity.tokenIdentifier;
    if (
      (isPlayer1 && getTurn(moves) !== Player.P1) ||
      (!isPlayer1 && getTurn(moves) !== Player.P2)
    ) {
      // not this player's turn
      return;
    }
    const board = getBoard(moves);
    if (board[args.column].length >= NUM_ROWS) {
      // the row is full
      return;
    }
    ctx.db.insert("moves", {
      gameId: args.gameId,
      column: args.column,
      player: identity.tokenIdentifier,
    });

    board[args.column].push(getTurn(moves));
    const winner = getWinner(board);
    ctx.db.patch(game._id, { winner });
  },
});
