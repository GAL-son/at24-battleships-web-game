import UserRepository from "Global/Database/Repositories/UserRepository";
import { GameResult, PlayerResult } from "Ws/Types/GameResult";


export default class ScoreService {
    userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async updateScore(userName: string, result: GameResult) {
        const user = await this.userRepository.getUser(userName);

        if (user === undefined) {
            throw new Error("Cant update undefined");
        }

        const currentScore = user.score;
        const scoreChange = this.calculateScoreChange(userName, result);


        let newScore = currentScore + scoreChange;

        if(newScore < 0) {
            newScore = 0;
        }

        this.userRepository.updateScore(userName, newScore);        

        return scoreChange;
    }

    calculateScoreChange(name: string, gameResult: GameResult) {
        let playerResult = gameResult.player1;
        let opponentResult = gameResult.player2;

        if(playerResult.name != name && gameResult.player2.name == name) {
            playerResult = gameResult.player2
            opponentResult = gameResult.player1
        } else {
            throw new Error("Cant update this player score");
        }
        const isWinner = gameResult.winner == playerResult.name;
        const isBetterScore = playerResult.score > opponentResult.score;
        const scoreDiff = Math.abs(playerResult.score - opponentResult.score);
        
        const maxGameLength = 2* (gameResult.boardSize.x * gameResult.boardSize.y) -1;
        const totalShipFields = playerResult.ships.map((v, i, a) => {
            return a[i].size;
        }).reduce((total, hp) => {
            return total + hp;
        })

        const gameLenghtBonus = this.calculateLengthBonus(maxGameLength, totalShipFields, gameResult.turns);
        const hitBonus = this.calcuateHitBonus(playerResult.hits, playerResult.misses);
        const killBonus = this.calculateKillBonus(opponentResult.ships);
        const killPenalty = this.calculateKillBonus(playerResult.ships);

        const scoreChange = ((hitBonus + killBonus - killPenalty) + (gameLenghtBonus * (isWinner ? 1 : -1))) * (10 + scoreDiff/(isBetterScore ? 4 : 2)) + (isWinner ? 200 : -100);
        return scoreChange;
    }

    calculateLengthBonus(maxGameLengt: number, minGameLength: number, gameLength: number) {
        const gameLengthNormalized = (gameLength - minGameLength) / (maxGameLengt - minGameLength);

        return (-200 * gameLengthNormalized ) + 200; 
    }

    calcuateHitBonus(hitNumber: number, missNumber: number) {
        const hitPercentage = hitNumber / (hitNumber + missNumber);
        return hitNumber * 5 * hitPercentage;        
    }

    calculateKillBonus(opponentsShips: {size: number, hp: number}[]) {
        let killBonus = 0;

        opponentsShips.forEach(s => {
            if(s.hp == 0) {
                killBonus += 10* s.size;
            }
        });

        return killBonus;
    }

}