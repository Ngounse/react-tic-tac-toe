import React, { useState } from "react";
// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
import "./styles.css";
import "./App.css";

export function Square({ value, onSquareClick, className }) {
  return (
    <button className={`square ${className}`} onClick={onSquareClick}>
      {value || "?"}
    </button>
  );
}

// 3x3 board
const board = [
  ["?", "?", "?"],
  ["?", "?", "?"],
  ["?", "?", "?"],
];

export function Borad() {
  const [isBot, setIsBot] = useState(false); // 0 for human and 1 for bot
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));
  let winner = calculateWinner(squares);

  let status;
  if (winner) {
    status = "Winner: " + winner.winner;
  } else if (squares.every((square) => square !== null)) {
    status = "Draw";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  let winnerCase = winner && winner.winnerCase;

  const reset = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  if (isBot && !xIsNext) {
    setTimeout(() => {
      const nextSquares = squares.slice();
      nextSquares[BotMove(squares)] = "O";
      setSquares(nextSquares);
      setXIsNext(!xIsNext);
    }, 1000);
  }

  return (
    <>
      <div className={`status `}>{status}</div>
      <div className="bot">
        <button onClick={() => setIsBot(!isBot)}>
          {isBot ? "Play with Human" : "Play with Bot"}
        </button>
      </div>
      {board.map((row, i) => {
        return (
          <div className="board-row" key={i}>
            {row.map((col, j) => {
              return (
                <Square
                  key={j}
                  className={
                    winnerCase !== null
                      ? squares[i * 3 + j] && winnerCase.includes(i * 3 + j)
                        ? squares[i * 3 + j] + " winner"
                        : squares[i * 3 + j]
                      : squares[i * 3 + j]
                  }
                  value={squares[i * 3 + j]}
                  onSquareClick={() => handleClick(i * 3 + j)}
                />
              );
            })}
          </div>
        );
      })}
      <button className="reset" onClick={reset}>
        Reset
      </button>
    </>
  );
}

function App() {
  const borad = Borad();
  return (
    <div className="App">
      <header className="App-header">{borad}</header>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      //  return 2 things one is winner and another is winner case
      // console.log(" squares[a]:::", squares[a]);
      const winner = squares[a];
      const winnerCase = lines[i];
      return { winner, winnerCase };
    }
  }
  return null;
}

const BotMove = (squares) => {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < squares.length; i++) {
    if (squares[i] === null) {
      squares[i] = "O";
      let score = minimax(squares, 0, false);
      squares[i] = null;
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
};

const minimax = (squares, depth, isMaximizing) => {
  let result = calculateWinner(squares);
  if (result) {
    return result.winner === "O" ? 10 - depth : depth - 10;
  }
  if (squares.every((square) => square !== null)) {
    return 0;
  }
  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < squares.length; i++) {
      if (squares[i] === null) {
        squares[i] = "O";
        let score = minimax(squares, depth + 1, false);
        squares[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < squares.length; i++) {
      if (squares[i] === null) {
        squares[i] = "X";
        let score = minimax(squares, depth + 1, true);
        squares[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
};

export default App;
