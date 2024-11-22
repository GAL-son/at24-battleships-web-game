type ShipSetup = {
    
    [key: number]: number;
}


interface IGameSetup {
    boardSize: {x: number, y:number};
    shipSizes: ShipSetup
}

export {IGameSetup, ShipSetup};
