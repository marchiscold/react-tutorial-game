import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button 
        className={"square " + (props.isWinner ? 'square--winner' : '')} 
        onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i, winner) {
    return <Square 
             key={i}
             status={this.props.status}
             value={this.props.squares[i]}
             onClick={() => {this.props.onClick(i)}}
             isWinner={winner}
           />;
  }

  render() {
    let rows = [];
    for (let i = 0; i < 3; i++) {

      let cells = [];
      for (let j = 0; j < 3; j++) {
        let cellIndex = j + i*3;
        let winnerCells = this.props.winnerCells;
        let isWinner = winnerCells && winnerCells.includes(cellIndex);
        cells.push(this.renderSquare(cellIndex, isWinner))
      }

      rows.push((
        <div className="board-row" key={i}>
          {cells}
        </div>
      ))
    }


    return (
      <div>
        <div className="status">{this.props.status}</div>
        {rows}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        cellChanged: null,
      }],
      xIsNext: true,
      stepNumber: 0,
      isReversed: false,
    }
  }

  handleClick(i) {
    const newHistory = this.state.history.slice(0, this.state.stepNumber + 1);
    let lastIndex = newHistory.length - 1;
    let squares = newHistory[lastIndex].squares;
    if (squares[i] != null ||
        calculateWinner(squares)) {
      return;
    }
    
    const newSquares = [...squares];
    newSquares[i] = this.state.xIsNext ? 'X' : 'O';
    newHistory.push({ squares: newSquares,
                      cellChanged: i,
                      });
    this.setState({ history: newHistory,
                    xIsNext: !this.state.xIsNext,
                    stepNumber: newHistory.length - 1,
                   });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    let history = this.state.history;
    let current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner.player;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    let moves = history.map((entry, index) => {
      let row = Math.floor(entry.cellChanged / 3) + 1;
      let col = entry.cellChanged % 3 + 1;
      let desc = index ? `move to step #${index} 
                          row #${row} 
                          col #${col}`: 
                         'move to start'; 
      let isCurrent = this.state.stepNumber === index;                         
      return (
        <li key={index} className={isCurrent ? 'current-move' : ''}>
          <button onClick={ () => {this.jumpTo(index)}}>
            {desc}
          </button>
        </li>
      )                         
    })

    if (this.state.isReversed) {
      moves.reverse();
    }


    return (
      <div className="game">
        <div className="game-board">
          <Board onClick={(i) => {this.handleClick(i)}}
                 squares={current.squares}
                 status={status}
                 winnerCells={winner && winner.cells}
          />
        </div>
        <div className="game-info">
          <div>History:</div>
          <ol>
            {moves}
          </ol>
        </div>
        <div>
          <button onClick={() => {this.setState({isReversed: !this.state.isReversed})}}>
            {this.state.isReversed ? 'order' : 'reverse'}
          </button>
      </div>
      </div>
    );
  }
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
      return squares[a] == null ? null : {cells: lines[i], player: squares[a]};
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
