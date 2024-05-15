import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { GameWinner, NUM_COLS, NUM_ROWS, NUM_WIN, Player } from "./constants";

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

export const getWinner = (board: Player[][]): GameWinner => {
  // vertical
  for (let col = 0; col < NUM_COLS; col++) {
    for (
      let row_start = 0;
      row_start < board[col].length - NUM_WIN;
      row_start++
    ) {
      const start_cell = board[col][row_start];
      if (
        start_cell !== undefined &&
        board[col]
          .slice(row_start, row_start + NUM_WIN)
          .every((cell) => cell === start_cell)
      ) {
        return start_cell === Player.P1 ? GameWinner.P1 : GameWinner.P2;
      }
    }
  }

  // horizontal
  for (let row = 0; row < NUM_ROWS; row++) {
    for (let col_start = 0; col_start < NUM_COLS - NUM_WIN; col_start++) {
      const start_cell = board[col_start][row];
      if (
        start_cell !== undefined &&
        board
          .slice(col_start, col_start + NUM_WIN)
          .map((col) => col[row])
          .every((cell) => cell === start_cell)
      ) {
        return start_cell === Player.P1 ? GameWinner.P1 : GameWinner.P2;
      }
    }
  }

  // diagonal
  for (let col_start = 0; col_start < NUM_COLS - NUM_WIN; col_start++) {
    for (
      let row_start = 0;
      row_start < board[col_start].length - NUM_WIN;
      row_start++
    ) {
      const start_cell = board[col_start][row_start];
      let found_winner = true;
      for (let step = 0; step < NUM_WIN; step++) {
        if (
          !(
            board[col_start + step] &&
            board[col_start + step][row_start + step] === start_cell
          )
        ) {
          found_winner = false;
          break;
        }
      }
      if (found_winner) {
        return start_cell === Player.P1 ? GameWinner.P1 : GameWinner.P2;
      }
    }
  }

  if (board.every((col) => col.length === NUM_ROWS)) {
    return GameWinner.TIE;
  }
  return GameWinner.ONGOING;
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
