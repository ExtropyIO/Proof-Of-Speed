import { useState } from "react";

interface Position {
  x: number;
  y: number;
}

interface GameEvent {
  created_at: string;
  data: string;
  event_id: string;
  executed_at: string;
  id: string;
  keys: string;
  model_id: string;
  updated_at: string;
}

interface ReplayGridProps {
  events: GameEvent[];
}

export const ReplayGrid = ({ events }: ReplayGridProps) => {
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const gridSize = 20;

  const getTimeDifference = (): string => {
    if (currentEventIndex === 0 || !events[currentEventIndex]) return "Start";

    const currentTime = new Date(events[currentEventIndex].executed_at);
    const previousTime = new Date(events[currentEventIndex - 1].executed_at);
    const diffInSeconds =
      (currentTime.getTime() - previousTime.getTime()) / 1000;

    return `+${diffInSeconds.toFixed(1)}s`;
  };

  const getCurrentPositions = (): {
    playerPos: Position | null;
    treasurePos: Position | null;
  } => {
    if (!events.length) {
      return { playerPos: null, treasurePos: null };
    }

    const initialEvent = JSON.parse(events[0].data);
    let currentPlayerPos = initialEvent.grid.player_initial_position;
    const treasurePos = initialEvent.grid.treasure_position;

    for (let i = 1; i <= currentEventIndex; i++) {
      const eventData = JSON.parse(events[i].data);
      if (eventData.direction) {
        if (eventData.direction.Right) currentPlayerPos.x += 1;
        if (eventData.direction.Left) currentPlayerPos.x -= 1;
        if (eventData.direction.Up) currentPlayerPos.y -= 1;
        if (eventData.direction.Down) currentPlayerPos.y += 1;
      }
    }

    return { playerPos: currentPlayerPos, treasurePos };
  };

  const { playerPos, treasurePos } = getCurrentPositions();

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-20 gap-0 w-[400px] h-[400px] bg-gray-800 border border-gray-600">
        {Array.from({ length: gridSize * gridSize }).map((_, index) => {
          const x = index % gridSize;
          const y = Math.floor(index / gridSize);
          const isPlayerPosition = playerPos?.x === x && playerPos?.y === y;
          const isTreasurePosition =
            treasurePos?.x === x && treasurePos?.y === y;

          return (
            <div
              key={index}
              className={`w-full h-full border border-gray-700 aspect-square ${
                isPlayerPosition || isTreasurePosition ? "relative" : ""
              }`}
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

      <div className="flex gap-4 items-center">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
          onClick={() => setCurrentEventIndex((i) => Math.max(0, i - 1))}
          disabled={currentEventIndex === 0}
        >
          Previous
        </button>
        <span className="text-white">
          Event {currentEventIndex + 1} of {events.length}{" "}
          <span className="text-gray-400">({getTimeDifference()})</span>
        </span>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
          onClick={() =>
            setCurrentEventIndex((i) => Math.min(events.length - 1, i + 1))
          }
          disabled={currentEventIndex === events.length - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};
