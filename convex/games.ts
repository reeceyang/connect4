import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("games").collect();
  },
});

export const make = mutation({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Unauthenticated call to mutation");
    }
    ctx.db.insert("games", {
      player_1: identity.tokenIdentifier,
      player_2: null,
    });
  },
});

export const join = mutation({
  args: {
    gameId: v.id("games"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Unauthenticated call to mutation");
    }
    const game = await ctx.db.get(args.gameId);
    // can only join a non-full game
    if (!game.player_2) {
      ctx.db.patch(args.gameId, { player_2: identity.tokenIdentifier });
    }
  },
});
