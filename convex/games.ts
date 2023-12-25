import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { GenericQueryCtx, AnyDataModel } from "convex/server";

const getUsername = (
  ctx: GenericQueryCtx<AnyDataModel>,
  tokenIdentifier: string
) =>
  ctx.db
    .query("users")
    .filter((q) => q.eq(q.field("tokenIdentifier"), tokenIdentifier))
    .unique();

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await Promise.all(
      (
        await ctx.db.query("games").collect()
      ).map(async (game) => ({
        ...game,
        player_1_username: game.player_1
          ? (
              await getUsername(ctx, game.player_1)
            ).name
          : undefined,
        player_2_username: game.player_2
          ? (
              await getUsername(ctx, game.player_2)
            ).name
          : undefined,
      }))
    );
  },
});

export const get = query({
  args: {
    gameId: v.id("games"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.gameId).then(async (game) => ({
      ...game,
      player_1_username: game.player_1
        ? (
            await getUsername(ctx, game.player_1)
          ).name
        : undefined,
      player_2_username: game.player_2
        ? (
            await getUsername(ctx, game.player_2)
          ).name
        : undefined,
    }));
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
