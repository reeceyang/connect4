import { Player } from "@/convex/constants";

const Piece = ({ player }: { player: Player | undefined }) => (
  <div
    className={`w-16 h-16 mask mask-circle ${
      player === Player.P1
        ? "bg-primary"
        : player === Player.P2
        ? "bg-secondary"
        : "bg-base-200"
    }`}
  />
);

export default Piece;
