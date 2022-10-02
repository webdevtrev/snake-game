import React, { useEffect, useState, useRef, useMemo } from 'react';
import './styles.scss';

export default function Gameboard({ size }) {
  //   const [gameState, setGameState] = useState([]);
  const gameState = useRef([]);
  const [start, setStart] = useState(-1);
  const fail = useRef(false);
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
    setStart(0);
  }, [size]);
  useEffect(() => {
    let snakeHead = snakePosition[snakePosition.length - 1];
    const temp = [...snakePosition];
    setTimeout(() => {
      if (gameState.current && start === 1) {
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
          placeFood();
        }
        if (
          isSnake(snakeHead[0], snakeHead[1], temp.slice(0, temp.length - 1)) ||
          snakeHead[0] < 0 ||
          snakeHead[1] < 0 ||
          snakeHead[0] >= size ||
          snakeHead[1] >= size
        ) {
          fail.current = true;
          setStart(0);
        } else {
          setSnakePosition([...temp]);
        }
      }
    }, 200);
  }, [size, snakePosition, start]);
  useEffect(() => {
    function addKeyHandlers(e) {
      console.log(e);
      if ((e.key === 'ArrowLeft' || e.key === 'a') && direction.current !== 3) {
        direction.current = 1;
      } else if (
        (e.key === 'ArrowUp' || e.key === 'w') &&
        direction.current !== 4
      ) {
        direction.current = 2;
      } else if (
        (e.key === 'ArrowRight' || e.key === 'd') &&
        direction.current !== 1
      ) {
        direction.current = 3;
      } else if (
        (e.key === 'ArrowDown' || e.key === 's') &&
        direction.current !== 2
      ) {
        direction.current = 4;
      } else if (e.key === ' ') {
        if (fail.current) {
          console.log('resetting');
          resetGame();
        } else {
          setStart(1);
        }
      }
    }
    document.addEventListener('keydown', addKeyHandlers);
    // Mobile
    document.addEventListener('touchstart', handleTouchStart, false);
    document.addEventListener('touchmove', handleTouchMove, false);

    var xDown = null;
    var yDown = null;

    function getTouches(evt) {
      return evt.touches;
    }

    function handleTouchStart(evt) {
      const firstTouch = getTouches(evt)[0];
      xDown = firstTouch.clientX;
      yDown = firstTouch.clientY;
    }

    function handleTouchMove(evt) {
      if (!xDown || !yDown) {
        return;
      }

      var xUp = evt.touches[0].clientX;
      var yUp = evt.touches[0].clientY;

      var xDiff = xDown - xUp;
      var yDiff = yDown - yUp;

      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        /*most significant*/
        if (xDiff > 0 && direction.current !== 1) {
          direction.current = 3;
        } else if (direction.current !== 3) {
          direction.current = 1;
        }
      } else {
        if (yDiff > 0 && direction.current !== 2) {
          direction.current = 4;
        } else if (direction.current !== 4) {
          direction.current = 2;
        }
      }
      /* reset values */
      xDown = null;
      yDown = null;
    }
    return () => {
      document.removeEventListener('keydown', addKeyHandlers);
      document.removeEventListener('touchstart', handleTouchStart, false);
      document.removeEventListener('touchmove', handleTouchMove, false);
    };
  }, []);

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
  function resetGame() {
    fail.current = false;
    direction.current = 3;
    clearFood();
    placeFood();
    setSnakePosition([
      [1, 0],
      [1, 1],
      [1, 2],
      [1, 3],
    ]);
  }
  function placeFood(newArray) {
    console.log(newArray ?? snakePosition);
    const temp = [...gameState.current];
    while (true) {
      const randomX = Math.floor(Math.random() * size);
      const randomY = Math.floor(Math.random() * size);
      if (!isSnake(randomX, randomY, newArray ?? snakePosition)) {
        temp[randomX][randomY] = 1;
        break;
      }
      gameState.current = [...temp];
    }
  }
  function clearFood() {
    const temp = [];
    for (let x = 0; x < size; x++) {
      temp[x] = [];
      for (let y = 0; y < size; y++) {
        temp[x][y] = 0;
      }
    }
    gameState.current = [...temp];
  }
  return (
    <div className='Gameboard'>
      {(start === 0 || start === -1) && !fail.current && (
        <div className='PreText'>
          <h2>Press the space bar to begin</h2>
        </div>
      )}
      {fail.current && (
        <div className='PreText'>
          <h2>Press the space bar to reset</h2>
        </div>
      )}
      {(start === 0 || start === 1) &&
        gameState.current?.map((row, i) => {
          return (
            <div key={`Row-${i}`} className='Row'>
              {row.map((tile, j) => {
                return (
                  <div
                    key={`Row-${i}-Tile-${j}`}
                    style={{
                      width: `min(${80 / size}vw, ${80 / size}vh)`,
                      height: `min(${80 / size}vw, ${80 / size}vh)`,
                    }}
                    className={`Tile ${
                      isSnake(i, j, snakePosition)
                        ? `Snake ${fail.current ? 'Fail' : ''}`
                        : tile
                        ? 'Food'
                        : ''
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
