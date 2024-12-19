type GameResult = {
    boardSize: {x: number, y: number};
    winner: string,
    player1: PlayerResult
    player2: PlayerResult
    turns: number;
}

type PlayerResult = {
    name: string,
    score: number,
    hits: number,
    misses: number,
    ships: {
        size: number,
        hp: number
    }[]
}

export {PlayerResult, GameResult};