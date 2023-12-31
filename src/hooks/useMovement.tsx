import { useMazeStore } from "@/store/MazeStore";
import { SquareType } from "@/types/types";
import { useKeyPress } from "./useKeyPress";
import { useEffect, useState } from "react";
import { debounce } from "@mui/material";
import { defaultPlayerInfo } from "@/constants/defaultPlayerInfo";

export const useMovement = () => {
  const { squares, setSquares } = useMazeStore((state) => state);
  const { player, setPlayer } = useMazeStore((state) => state);
  const { saveFile, setSaveFile } = useMazeStore((state) => state);

  const { nMovement = 0 } = saveFile;
  const { slideDirection } = saveFile;
  const { nHealth } = saveFile;

  const [keyHistory, setKeyHistory] = useState<string[]>([]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    if (nMovement === 0) {
      timeout = setTimeout(() => {
        slide();
      }, 2000);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [nMovement]);

  const updateEnemies = () => {
    const lavaSquares = squares.filter((square) => square.hasLava);

    const lavaGrowth = Array.from(
      new Set(
        lavaSquares
          .map((ls) => {
            const lavaOptions = squares.filter(
              (square) =>
                (((square.x === ls.x - 1 || square.x === ls.x + 1) &&
                  square.y === ls.y) ||
                  ((square.y === ls.y - 1 || square.y === ls.y + 1) &&
                    square.x === ls.x)) &&
                !square.isWall &&
                !square.isLavaSource &&
                !square.hasLava
            );
            return lavaOptions.slice(
              Math.floor(Math.random() * (lavaOptions?.length - 1)),
              1
            );
          })
          .reduce((opts, acc) => {
            return [...acc, ...opts];
          }, [])
      )
    )
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    setSquares(
      squares.map((square) => {
        const foundInLavaGrowth = lavaGrowth?.find(
          (lg) => lg.x === square.x && lg.y === square.y
        );
        return foundInLavaGrowth ? { ...square, hasLava: true } : square;
      })
    );
  };

  const findExistingSquare = (
    direction: "x" | "y",
    deltaMove: number,
    increment: number
  ) => {
    const oppositeDirection = direction === "x" ? "y" : "x";
    const squareFindingFunction = (square: SquareType) =>
      square[direction] ===
        (player?.[direction] || 0) + (deltaMove + increment) &&
      square[oppositeDirection] === player?.[oppositeDirection];

    return squares.find(squareFindingFunction);
  };

  const slide = () => {
    const { direction = "x", increment = -1 } = slideDirection;
    let deltaMove = 0;
    let hadLava = false;
    const healthDeficit = () =>
      (hadLava ? 1 : 0) + (Math.abs(deltaMove) >= 3 ? 1 : 0);

    const handleSlide = () => {
      const exists = findExistingSquare(direction, deltaMove, increment);
      if (!exists || exists.isWall || exists.isLavaSource) {
        if (!player || deltaMove === 0) {
          return;
        }

        return setPlayer({
          ...player,
          [direction]: player?.[direction] + deltaMove,
          message: healthDeficit() >= 1 ? "ouch" : undefined,
        });
      }

      deltaMove += increment;

      if (exists?.hasLava) {
        hadLava = true;
      }
      handleSlide();
    };

    handleSlide();
    setSaveFile({
      ...saveFile,
      nMovement: defaultPlayerInfo.nMovement,
      nHealth: saveFile.nHealth - healthDeficit(),
      slideDirection: {
        direction: Math.random() > 0.5 ? "x" : "y",
        increment: Math.random() > 0.5 ? 1 : -1,
      },
      nSlides: saveFile.nSlides + 1,
    });
    updateEnemies();
  };

  const moveHandler = (key: string | undefined) => {
    if (nHealth <= 0) {
      return;
    }
    if (!key) {
      return;
    }

    setKeyHistory([...keyHistory, key]);
    const dirKeys = [
      "ArrowUp",
      "w",
      "ArrowLeft",
      "a",
      "ArrowDown",
      "s",
      "ArrowRight",
      "d",
    ];

    if (nMovement <= 0) {
      return;
    }

    if (!key || !dirKeys.includes(key)) {
      return;
    }
    // The increment, with the direction, in which the steps are checked.
    const increment = ["ArrowUp", "w", "ArrowLeft", "a"].includes(key) ? -1 : 1;

    // The direction, x or y, in which should be moved.
    const direction = ["ArrowUp", "w", "ArrowDown", "s"].includes(key)
      ? "y"
      : "x";

    const handleStep = () => {
      const exists = findExistingSquare(direction, 0, increment);
      if (exists && !exists.isWall && !exists.isLavaSource && player) {
        setSaveFile({
          ...saveFile,
          nMovement: (saveFile.nMovement || 0) - 1,
          nHealth: exists.hasLava ? saveFile.nHealth - 1 : saveFile.nHealth,
        });
        return setPlayer({
          ...player,
          [direction]: player?.[direction] + increment,
          message: exists.hasLava ? "ouch" : undefined,
        });
      }
    };
    if (nMovement === 1) {
      const slideSound = new Audio("sounds/slide.wav");
      slideSound.playbackRate = 1 - 0.1 + Math.random() * 0.2;
      slideSound.play();
    }

    handleStep();
  };

  useKeyPress({
    callback: debounce(moveHandler, 50),
  });

  return {
    moveHandler,
    slide,
    keyHistory,
  };
};
