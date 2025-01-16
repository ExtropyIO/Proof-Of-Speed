import { useEffect, useMemo, useState } from "react";
import { QueryBuilder, SDK, createDojoStore } from "@dojoengine/sdk";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { addAddressPadding } from "starknet";
import { ReplayGrid } from "./components/ReplayGrid.tsx";

import {
  Models,
  Schema,
  WinGame,
  StartGame,
  Warning__FastWin,
  Moved,
} from "./bindings.ts";
import { useDojo } from "./useDojo.tsx";
import useModel from "./useModel.tsx";
import { useSystemCalls } from "./useSystemCalls.ts";
import { Grid } from "./components/Grid.tsx";
import { ToriiClient } from "@dojoengine/torii-client";
import { convertHexToDate } from "./aux.ts";

interface EntityProperty {
  key: boolean;
  type: string;
  type_name: string;
  value: string;
}

/**
 * Global store for managing Dojo game state.
 */
export const useDojoStore = createDojoStore<Schema>();

/**
 * Main application component that provides game functionality and UI.
 * Handles entity subscriptions, state management, and user interactions.
 *
 * @param props.sdk - The Dojo SDK instance configured with the game schema
 */
function App({
  sdk,
  toriiClient,
}: {
  sdk: SDK<Schema>;
  toriiClient: ToriiClient;
}) {
  const {
    account,
    setup: { client },
  } = useDojo();
  const state = useDojoStore((state) => state);
  const entities = useDojoStore((state) => state.entities);
  const [timestampStart, setTimestampStart] = useState<Date | null>(null);
  const [timestampEnd, setTimestampEnd] = useState<Date | null>(null);
  const [replayEvents, setReplayEvents] = useState([]);

  const { spawn } = useSystemCalls();

  const entityId = useMemo(
    () => getEntityIdFromKeys([BigInt(account?.account.address)]),
    [account?.account.address]
  );

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          setReplayEvents(json);
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  useEffect(() => {
    const fetchTreasurePosition = async () => {
      const subscription = await toriiClient.onEventMessageUpdated(
        // const subscription = await toriiClient.onEntityUpdated(
        [
          {
            Keys: {
              keys: [account.account.address],
              // keys: [undefined],
              // models: [], // i want everything that has only one key = account address
              // models: ["dojo_starter-TreasureFound", "dojo_starter-Moved"],
              models: [
                "dojo_starter-StartGame",
                "dojo_starter-WinGame",
                "dojo_starter-Moved",
                // "dojo_starter-Warning__FastWin",
              ],
              // models: [],
              pattern_matching: "FixedLen",
            },
          },
        ],
        false,
        (
          resp: any,
          model: {
            // "dojo_starter-WinGame": WinGame;
            // "dojo_starter-StartGame": StartGame;
            // "dojo_starter-Moved": Moved;
            //"dojo_starter-Warning__FastWin": Warning__FastWin;
          }
        ) => {
          console.log("-- here 11");
          console.log(resp);
          if (resp !== "0x0") {
            console.log("-- here");

            const startGame =
              model["dojo_starter-StartGame" as keyof typeof model];
            console.log(startGame);
            const playerFoundTreasure =
              model["dojo_starter-WinGame" as keyof typeof model];
            console.log(playerFoundTreasure);
            // const playerFastWin = model["dojo_starter-Warning__FastWin"];

            if (startGame) {
              const { player, timestamp } = startGame;

              // @ts-ignore
              const timestampValue = convertHexToDate(timestamp.value);

              console.log(timestampValue);
              // @ts-ignore
              setTimestampStart(timestampValue);
            }

            if (playerFoundTreasure) {
              const { player, timestamp, block_number } = playerFoundTreasure;

              // @ts-ignore
              const timestampValue = convertHexToDate(timestamp.value);

              console.log(timestampValue);
              setTimestampEnd(timestampValue);
            }
          }
        }
      );

      return () => {
        if (subscription) {
          subscription.cancel();
        }
      };
    };

    fetchTreasurePosition();
  }, [toriiClient, account?.account.address]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const subscribe = async () => {
      const subscription = await sdk.subscribeEntityQuery({
        query: new QueryBuilder<Schema>()
          .namespace("dojo_starter", (n) =>
            n
              .entity("Moves", (e) =>
                e.eq("player", addAddressPadding(account.account.address))
              )
              .entity("Position", (e) =>
                e.is("player", addAddressPadding(account.account.address))
              )
              .entity("TreasurePosition", (e) => {
                e.is("player", addAddressPadding(account.account.address));
              })
              .entity("Grid", (e) => {
                e.is("player", addAddressPadding(account.account.address));
              })
          )
          .build(),
        callback: (response) => {
          if (response.error) {
            console.error("Error setting up entity sync:", response.error);
          } else if (response.data && response.data[0].entityId !== "0x0") {
            state.updateEntity(response.data[0]);
          }
        },
      });

      unsubscribe = () => {
        subscription.cancel();
        // winSubscription.cancel();
      };
    };

    subscribe();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [sdk, account?.account.address]);

  useEffect(() => {
    const fetchEntities = async () => {
      try {
        await sdk.getEntities({
          query: new QueryBuilder<Schema>()
            .namespace("dojo_starter", (n) =>
              n.entity("TreasurePosition", (e) =>
                e.eq("player", addAddressPadding(account.account.address))
              )
            )
            .build(),
          callback: (resp) => {
            if (resp.error) {
              console.error("resp.error.message:", resp.error.message);
              return;
            }
            if (resp.data) {
              state.setEntities(resp.data);
            }
          },
        });
      } catch (error) {
        console.error("Error querying entities:", error);
      }
    };

    fetchEntities();
  }, [sdk, account?.account.address]);

  useEffect(() => {
    if (timestampStart && timestampEnd) {
      alert(
        `You won in: ${(
          (timestampEnd.getTime() - timestampStart.getTime()) /
          1000
        ).toFixed(2)}s`
      );
    }
  }, [timestampStart, timestampEnd]);

  const moves = useModel(entityId, Models.Moves);
  const position = useModel(entityId, Models.Position);
  const treasurePosition = useModel(entityId, Models.TreasurePosition);
  const grid = useModel(entityId, Models.Grid);

  return (
    <div className="bg-black min-h-screen w-full p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <button
          className="mb-4 px-4 py-2 bg-blue-600 text-white text-sm sm:text-base rounded-md hover:bg-blue-700 transition-colors duration-300"
          onClick={() => account?.create()}
        >
          {account?.isDeploying ? "Deploying Burner..." : "Create Burner"}
        </button>

        <div className="bg-gray-800 shadow-md rounded-lg p-4 sm:p-6 mb-6 w-full max-w-md">
          <div className="text-lg sm:text-xl font-semibold mb-4 text-white">{`Burners Deployed: ${account.count}`}</div>
          <div className="mb-4">
            <label
              htmlFor="signer-select"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Select Signer:
            </label>
            <select
              id="signer-select"
              className="w-full px-3 py-2 text-base text-gray-200 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={account ? account.account.address : ""}
              onChange={(e) => account.select(e.target.value)}
            >
              {account?.list().map((account, index) => (
                <option value={account.address} key={index}>
                  {account.address}
                </option>
              ))}
            </select>
          </div>
          <button
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 text-base rounded transition duration-300 ease-in-out"
            onClick={() => account.clear()}
          >
            Clear Burners
          </button>
        </div>

        <div className="bg-gray-700 p-4 rounded-lg shadow-inner flex justify-center items-center">
          <Grid
            position={position}
            treasure={treasurePosition}
            walls={grid?.walls}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-6">
          <div className="bg-gray-700 p-4 rounded-lg shadow-inner">
            <div className="grid grid-cols-3 gap-2 w-full h-48">
              <div className="col-start-2">
                <button
                  className="h-12 w-12 bg-gray-600 rounded-full shadow-md active:shadow-inner active:bg-gray-500 focus:outline-none text-2xl font-bold text-gray-200"
                  onClick={async () => await spawn()}
                >
                  +
                </button>
              </div>
              <div className="col-span-3 text-center text-base text-white">
                Treasure Position:
                {treasurePosition &&
                  `${treasurePosition.vec.x} - ${treasurePosition.vec.y}`}
              </div>
              <div className="col-span-3 text-center text-base text-white">
                Moves Left: {moves ? `${moves.remaining}` : "Need to Spawn"}
              </div>
              <div className="col-span-3 text-center text-base text-white">
                {position
                  ? `x: ${position?.vec?.x}, y: ${position?.vec?.y}`
                  : "Need to Spawn"}
              </div>
              <div className="col-span-3 text-center text-base text-white">
                {moves && moves.last_direction}
              </div>
            </div>
          </div>

          <div className="bg-gray-700 p-4 rounded-lg shadow-inner">
            <div className="grid grid-cols-3 gap-2 w-full h-48">
              {[
                {
                  direction: "Up" as const,
                  label: "↑",
                  col: "col-start-2",
                },
                {
                  direction: "Left" as const,
                  label: "←",
                  col: "col-start-1",
                },
                {
                  direction: "Right" as const,
                  label: "→",
                  col: "col-start-3",
                },
                {
                  direction: "Down" as const,
                  label: "↓",
                  col: "col-start-2",
                },
              ].map(({ direction, label, col }) => (
                <button
                  className={`${col} h-12 w-12 bg-gray-600 rounded-full shadow-md active:shadow-inner active:bg-gray-500 focus:outline-none text-2xl font-bold text-gray-200`}
                  key={direction}
                  onClick={async () => {
                    await client.actions.move({
                      account: account.account,
                      direction: { type: direction },
                    });
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-700 p-4 rounded-lg shadow-inner flex flex-col items-center gap-4">
          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="mb-4 text-white"
          />
          {replayEvents.length > 0 && <ReplayGrid events={replayEvents} />}
        </div>

        <div className="mt-8 overflow-x-auto">
          <table className="w-full border-collapse border border-gray-700">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="border border-gray-700 p-2">Entity ID</th>
                <th className="border border-gray-700 p-2">Player</th>
                <th className="border border-gray-700 p-2">Position X</th>
                <th className="border border-gray-700 p-2">Position Y</th>
                <th className="border border-gray-700 p-2">Can Move</th>
                <th className="border border-gray-700 p-2">Last Direction</th>
                <th className="border border-gray-700 p-2">Remaining Moves</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(entities).map(([entityId, entity]) => {
                const position = entity.models.dojo_starter.Position;
                const moves = entity.models.dojo_starter.Moves;

                return (
                  <tr key={entityId} className="text-gray-300">
                    <td className="border border-gray-700 p-2">{entityId}</td>
                    <td className="border border-gray-700 p-2">
                      {position?.player ?? "N/A"}
                    </td>
                    <td className="border border-gray-700 p-2">
                      {position?.vec?.x ?? "N/A"}
                    </td>
                    <td className="border border-gray-700 p-2">
                      {position?.vec?.y ?? "N/A"}
                    </td>
                    <td className="border border-gray-700 p-2">
                      {moves?.can_move?.toString() ?? "N/A"}
                    </td>
                    <td className="border border-gray-700 p-2">
                      {moves?.last_direction ?? "N/A"}
                    </td>
                    <td className="border border-gray-700 p-2">
                      {moves?.remaining ?? "N/A"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
