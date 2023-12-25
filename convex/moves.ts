import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

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
    // TODO: validate the move
    ctx.db.insert("moves", {
      gameId: args.gameId,
      column: args.column,
      player: identity.tokenIdentifier,
    });
  },
});
