import React, { useEffect, useState, useRef } from "react";
import "./styles.scss";

export default function Gameboard({ size }) {
  //   const [gameState, setGameState] = useState([]);
  const gameState = useRef([]);
  const [fail, setFail] = useState(false);
  const direction = useRef(3);
  const [snakePosition, setSnakePosition] = useState([
    [1, 0],
    [1, 1],
    [1, 2],
    [1, 3],
  ]);
  useEffect(() => {
    const array = [];
    for (let x = 0; x < size; x++) {
      array[x] = [];
      for (let y = 0; y < size; y++) {
        array[x][y] = 0;
      }
    }
    gameState.current = array;
  }, [size]);
  useEffect(() => {
    let snakeHead = snakePosition[snakePosition.length - 1];
    const temp = [...snakePosition];
    setTimeout(() => {
      if (gameState.current) {
        if (direction.current === 1) {
          snakeHead = [snakeHead[0], snakeHead[1] - 1];
          temp.push(snakeHead);
        } else if (direction.current === 2) {
          snakeHead = [snakeHead[0] - 1, snakeHead[1]];
          temp.push(snakeHead);
        } else if (direction.current === 3) {
          snakeHead = [snakeHead[0], snakeHead[1] + 1];
          temp.push(snakeHead);
        } else if (direction.current === 4) {
          snakeHead = [snakeHead[0] + 1, snakeHead[1]];
          temp.push(snakeHead);
        }
        // If is not food then keep same size by shifting
        if (gameState.current?.[snakeHead[0]]?.[snakeHead[1]] !== 1) {
          temp.shift();
        } else {
          gameState.current[snakeHead[0]][snakeHead[1]] = 0;
        }
        if (
          isSnake(snakeHead[0], snakeHead[1], temp.slice(0, temp.length - 1)) ||
          snakeHead[0] < 0 ||
          snakeHead[1] < 0 ||
          snakeHead[0] >= size ||
          snakeHead[1] >= size
        ) {
          setFail(true);
        } else {
          setSnakePosition([...temp]);
        }
      }
    }, 200);
  }, [size, snakePosition]);
  useEffect(() => {
    function addKeyHandlers(e) {
      if (e.key === "ArrowLeft" || e.key === "a") {
        direction.current = 1;
      } else if (e.key === "ArrowUp" || e.key === "w") {
        direction.current = 2;
      } else if (e.key === "ArrowRight" || e.key === "d") {
        direction.current = 3;
      } else if (e.key === "ArrowDown" || e.key === "s") {
        direction.current = 4;
      }
    }
    document.addEventListener("keydown", addKeyHandlers);
    return () => {
      document.removeEventListener("keydown", addKeyHandlers);
    };
  }, []);
  useEffect(() => {
    const temp = [...gameState.current];
    while (true) {
      const randomX = Math.floor(Math.random() * size);
      const randomY = Math.floor(Math.random() * size);
      if (!isSnake(randomX, randomY, snakePosition)) {
        temp[randomX][randomY] = 1;
        break;
      }
      gameState.current = [...temp];
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snakePosition.length, size]);

  function isSnake(x, y, snakeArray) {
    let bool = false;
    for (let i = 0; i < snakeArray.length; i++) {
      if (snakeArray[i][0] === x && snakeArray[i][1] === y) {
        bool = true;
        break;
      }
    }
    return bool;
  }
  return (
    <div className="Gameboard">
      {gameState.current?.map((row, i) => {
        return (
          <div key={`Row-${i}`} className="Row">
            {row.map((tile, j) => {
              return (
                <div
                  key={`Row-${i}-Tile-${j}`}
                  className={`Tile ${
                    isSnake(i, j, snakePosition)
                      ? `Snake ${fail ? "Fail" : ""}`
                      : tile
                      ? "Food"
                      : ""
                  }`}
                ></div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
