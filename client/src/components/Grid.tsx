import { Position, TreasurePosition, Vec2 } from "../bindings.ts";

interface GridProps {
  position: Position | undefined;
  treasure: TreasurePosition | undefined;
  walls: Array<Vec2> | undefined;
}

export const Grid = ({ position, treasure, walls }: GridProps) => {
  const gridSize = 20;

  return (
    <div className="grid grid-cols-20 gap-0 w-[400px] h-[400px] bg-gray-800 border border-gray-600">
      {Array.from({ length: gridSize * gridSize }).map((_, index) => {
        const x = index % gridSize;
        const y = Math.floor(index / gridSize);
        const isPlayerPosition =
          position?.vec?.x === x && position?.vec?.y === y;
        const isTreasurePosition =
          treasure?.vec?.x === x && treasure?.vec?.y === y;
        const isWall = walls?.some((wall) => wall.x === x && wall.y === y);

        return (
          <div
            key={index}
            className={`w-full h-full border border-gray-700 aspect-square ${
              isPlayerPosition || isTreasurePosition ? "relative" : ""
            } ${isWall ? "bg-yellow-600" : ""}`}
          >
            {isPlayerPosition && (
              <div className="absolute inset-[25%] bg-red-500 rounded-full" />
            )}
            {isTreasurePosition && (
              <div className="absolute inset-[15%] text-yellow-500 flex items-center justify-center">
                💎
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
