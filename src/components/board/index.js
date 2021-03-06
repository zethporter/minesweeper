import React, { Component } from 'react';
import Row from "../row";

class Board extends Component {
    

    constructor(props){
        super(props);

        this.state = {
            rows: this.createBoard(props)
        }
    }
    createBoard = props => {
        let board = [];
        
        for (let i=0;i < props.rows; i++){
            board.push([]);

            for(let j=0; j<props.columns; j++){
                board[i].push({
                    x: j,
                    y: i,
                    count: 0,
                    isOpen: false,
                    hasMine: false,
                    hasFlag: false
                });
            }
        }
        
            //after board is created, we add the mines.

            for(let i=0; i<props.mines; i++){
                let randomRow = Math.floor(Math.random() * props.rows);
                let randomCol = Math.floor(Math.random() * props.columns);

                let cell = board[randomRow][randomCol];

                if (cell.hasMine){
                    i--;

                } else {
                    cell.hasMine = true;
                }            
        }
        
        return board
        // console.log(board);
    };

    open = cell =>{
        let rows = this.state.rows;

        let current = rows[cell.y][cell.x];

        if(current.hasMine && this.props.openCells === 0) {
            console.log("cell already has mine, restart!");
            let newRows = this.createBoard(this.props);
            this.setState({
                rows: newRows
            }, () => {
                this.open(cell);
            })
        } else {
            if(!cell.hasFlag && !current.isOpen){
                this.props.openCellclick();

                current.isOpen = true;
            } //youtube.com/watch?v=tfz1TssUfzM  1:41:21
        }
    };

    render() { 
        let rows = this.state.rows.map((row, index) => {
            return (
                <Row 
                    cells={row}
                    key={index}
                />

            )
        })
    return <div className="board">{rows}</div>; 
           
    }
}
 
export default Board;