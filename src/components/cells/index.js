import React from 'react';

const Cell = props => {
    let renderCell = () => {
        if(props.data.isOpen){
            if(props.data.count === 0){
                return(
                    <div className="cell open" onClick={() => props.open(props.data)}>
    
                    </div>
                )
            } else if(props.data.hasMine){
                return(
                    <div className="cell open" onClick={() => props.open(props.data)}>
                        M
                    </div>
                )
            } else {
                return(
                    <div className="cell open" onClick={() => props.open(props.data)}>
                        {props.data.count}
                    </div>
                )
            }
            //do some stuff
            
        } else {
            //do some other stuff
            return(
                <div className="cell"onClick={() => props.open(props.data)}>

                </div>
            );
        }
    }
    return renderCell();
};

export default Cell;