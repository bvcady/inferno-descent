/* eslint-disable react-hooks/exhaustive-deps */
import { useMazeStore } from "@/store/MazeStore";
import { useEffect, useState } from "react";
import * as seedInitilizer from "random-seed";

interface Props {
  nX: number;
}
export const useInitializer = ({ nX }: Props) => {
  const [squareSize, setSquareSize] = useState(0);

  const { setSquares, squares } = useMazeStore((state) => state);
  const { setPlayer } = useMazeStore((state) => state);
  const { saveFile } = useMazeStore((state) => state);

  const { seed } = saveFile;

  const s = seedInitilizer;

  const seedBuilder = (input: (number | string)[]) => {
    const sanitizedInput = input.map((i) => i.toString());
    const seedString = [...sanitizedInput, seed].join("-");
    return s.create(seedString);
  };

  const reload = () => {
    if (seed) {
      const withinRange = (input: number, from: number, to: number) => {
        if (input >= from && input <= to) {
          return input;
        }
        if (input < from) {
          return from;
        }
        return to;
      };
      setSquareSize(withinRange((window.innerWidth * 0.66) / nX, 4, 32));

      const maze = new Array(nX * nX).fill("").map((_, index) => {
        const x = index % nX;
        const y = Math.floor(index / nX);
        const isWall = seedBuilder(["wall", x, y]).random() < 0.33;
        return {
          x,
          y,
          isWall,
        };
      });

      const mapWithLava = maze.map((square) => {
        return {
          ...square,
          hasLava: square?.isWall
            ? false
            : seedBuilder(["lava", square.x, square.y]).random() > 0.99,
        };
      });

      setSquares(mapWithLava);
      const availableOptions = maze.filter((m) => !m.isWall);

      const player =
        availableOptions[
          Math.floor(
            seedBuilder(["player"]).random() * availableOptions?.length - 1
          )
        ];

      setPlayer(player);
    }
  };

  useEffect(() => {
    reload();
  }, [seed]);

  return {
    squareSize,
    nX,
    squares,
    reload,
  };
};
