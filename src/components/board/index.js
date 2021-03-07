import React, { Component } from 'react';
import Row from "../row";

class Board extends Component {
    

    constructor(props){
        super(props);

        this.state = {
            rows: this.createBoard(props)
        }
    }

    componentWillReceiveProps(nextProps){
        if(
            this.props.openCells > nextProps.openCells ||
            this.props.columns !== nextProps.columns
        ){
            this.setState({
                rows: this.createBoard(nextProps)
            });
        }
    };

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

    flag = cell => {
        if(this.props.status === "ended"){
            return;
        }
        let rows = this.state.rows;

        cell.hasFlag = !cell.hasFlag;
        this.setState({ rows });
        this.props.changeFlagAmount(cell.hasFlag ? -1 : 1);
    };

    open = cell => {
        if (this.props.status === "ended") {
          return;
        }
        // first we need to find mines around it asynchronously. this is IMPORTANT, because we need to make sure we calculate the mines before anything else runs!!!
        let asyncCountMines = new Promise(resolve => {
          let mines = this.findMines(cell);
          resolve(mines);
        });
    
        asyncCountMines.then(numberOfMines => {
          let rows = this.state.rows;
    
          let current = rows[cell.y][cell.x];
    
          if (current.hasMine && this.props.openCells === 0) {
            console.log("mine was on first click");
            let newRows = this.createBoard(this.props);
            this.setState({ rows: newRows }, () => {
              this.open(cell);
            });
          } else {
            if (!cell.hasFlag && !current.isOpen) {
              this.props.onCellClick();
    
              current.isOpen = true;
              current.count = numberOfMines;
    
              this.setState({ rows });
              // now that we know its not a flag and its not a BOMB we should try to open cells around it!
              if (!current.hasMine && numberOfMines === 0) {
                this.openAroundCell(cell);
              }
    
              if (current.hasMine && this.props.openCells !== 0) {
                this.props.endGame();
              }
            }
          }
        });
      };

    findMines = cell => {
        let minesInProximity = 0;
        for(let row = -1; row <= 1; row++){
            for(let column = -1; column <= 1; column++){
                if(cell.y + row >= 0 && cell.x + column >= 0){
                    if(
                        cell.y + row < this.state.rows.length &&
                        cell.x + column < this.state.rows[0].length
                    ) {
                        if(
                            this.state.rows[cell.y + row][cell.x + column].hasMine &&
                            !(row === 0 && column === 0)
                        ) {
                            minesInProximity++;
                        }
                    }
                }
            }
        }
        return minesInProximity;
    };

    openAroundCell = cell => {
        let rows = this.state.rows;

        //go through each cell and open cells one by one until we find one with a mine.

        for(let row = -1; row <= 1; row++){
            for (let column = -1; row <= 1; column++){
                if(cell.y + row >= 0 && cell.x + column >= 0){
                    if(
                        cell.y + row < this.state.rows.length &&
                        cell.x + column < this.state.rows[0].length
                    ) {
                    if(
                        !rows[cell.y + row][cell.x + column].hasMine &&
                        !rows[cell.y + row][cell.x + column].isOpen
                    ) {
                        this.open(rows[cell.y + row][cell.x + column]);
                    }
                }
                
            }
        }
    }    
};

    render() { 
        let rows = this.state.rows.map((row, index) => {
            return (
                <Row 
                    cells={row}
                    key={index}
                    flag={this.flag}
                    open={this.open}
                />

            )
        })
    return <div className="board">{rows}</div>; 
           
    }
}
 
export default Board;