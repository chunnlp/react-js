import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    const className = props.hasEnded ? 'square ' + props.pattern : 'notEnd square ' + props.pattern;
    
    return (
        <button className={className} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                hasEnded={this.props.pattern ? true : false}
                pattern={this.props.pattern && this.props.pattern.indexOf(i) !== -1 ? 'win' : ''}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }
    
    render() {
        return (
            <div>
                <div className='board-row'>
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className='board-row'>
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className='board-row'>
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[this.state.stepNumber];
        const squares = current.squares.slice();
        
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        
        this.setState({
            moves: this.state.moves.concat(i),
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }
    
    jumpTo(step) {
        this.setState({
            history: this.state.history.slice(0, step + 1),
            moves: this.state.moves.slice(0, step),
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }
    
    constructor(props) {
        super(props);
        this.state = {
            moves: [],
            history:[{
                squares: Array(9).fill(null),
            }],
            xIsNext: true,
            stepNumber: 0,
        };
    }
    
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winningPath = calculateWinner(current.squares);
        
        console.log(this.state.moves);
        
        const moves = history.map((step, move) => {
            const desc = move ? 'Go to move #' + move : 'Go to game start';
            let label = '';
            if (move) {
                const col = this.state.moves[move - 1] % 3;
                const row = parseInt(this.state.moves[move - 1] / 3, 10);
                label = ' (' + row + ', ' + col + ')';
            }
            
            return (
                <li key={move}>
                    <button className="move" onClick={() => this.jumpTo(move)}>{desc}</button>
                    <label>{label}</label>
                </li>
            );
        });
        
        let status;
        
        if (winningPath) {
            status = 'Winner: ' + (this.state.xIsNext ? 'O' : 'X');
        } else {
            if (this.state.moves.length === 9) {
                status = 'DRAW!!!';
            } else {
                status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
            }
        }
        
        return (
            <div className='game'>
                <div className='game-board'>
                    <Board
                        pattern={winningPath}
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className='game-info'>
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

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
            return [a, b, c];
        }
    }
    return null;
}