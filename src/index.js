import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button 
        className="square" 
        onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    return <Square 
             status={this.props.status}
             value={this.props.squares[i]}
             onClick={() => {this.props.onClick(i)}}
           />;
  }

  render() {
    return (
      <div>
        <div className="status">{this.props.status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class HistoryButton extends React.Component {
  render() {
    return (
      <li>
        <button onClick={() => {alert('Glory to North Korea')}}>
          hello world
        </button>
      </li>
    )
  }
}

class Game extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      xIsNext: true,
    }
  }

  handleClick(i) {
    let lastIndex = this.state.history.length - 1;
    let squares = this.state.history[lastIndex].squares;
    if (squares[i] != null ||
        calculateWinner(squares)) {
      return;
    }
    
    const newSquares = [...squares];
    const newHistory = [...this.state.history];
    newSquares[i] = this.state.xIsNext ? 'X' : 'O';
    newHistory.push({squares: newSquares});
    this.setState({ history: newHistory,
                    xIsNext: !this.state.xIsNext });
  }

  render() {
    let history = this.state.history;
    let current = history[history.length - 1];
    const winner = calculateWinner(current.squares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board onClick={(i) => {this.handleClick(i)}}
                 squares={current.squares}
                 status={status}
          />
        </div>
        <div className="game-info">
          <div>History:</div>
          <ol><HistoryButton /></ol>
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
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
