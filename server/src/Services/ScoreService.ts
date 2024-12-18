import UserRepository from "Database/Repositories/UserRepository";
import { GameResult, PlayerResult } from "Resources/Types/GameResult";

export default class ScoreService {
    readonly MAX_SCORE_SCALE = 3.0;
    readonly MIN_SCORE_SCALE = 0.1;
    readonly HIT_BONUS = 1;
    readonly KILL_BONUS = 5;
    readonly GAME_LENGTH_BASE_BONUS = 100;
    readonly WIN_BONUS = 50;


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

        console.log("SCORE CHANGE FOR: " + userName + " - " + currentScore + " + " + scoreChange);
        

        if(newScore < 0) {
            newScore = 0;
        }

        this.userRepository.updateScore(userName, newScore);        

        return scoreChange;
    }

    calculateScoreChange(name: string, gameResult: GameResult) {
        let playerResult = gameResult.player1;
        let opponentResult = gameResult.player2;

        if(playerResult.name != name) {
            if(gameResult.player2.name == name) {
                playerResult = gameResult.player2
                opponentResult = gameResult.player1
            } else {
                throw new Error("Cant update this player score");
            }
        }
        const isWinner = gameResult.winner == playerResult.name;
        const scoreScale = this.calculateScoreScale(playerResult.score, opponentResult.score);
        
        const maxGameLength = 2* (gameResult.boardSize.x * gameResult.boardSize.y) -1;
        const totalShipFields = playerResult.ships.map((v) => {
            return v.size;
        }).reduce((total, hp) => {
            return total + hp;
        })

        const gameLenghtBonus = this.calculateGameLengthMultiplier(maxGameLength, totalShipFields, gameResult.turns);
        const hitBonus = this.calcuateHitBonus(playerResult.hits, playerResult.misses);
        const killBonus = this.calculateKillBonus(opponentResult.ships);
        const killPenalty = this.calculateKillBonus(playerResult.ships);

        const gameActionBonus = (hitBonus + killBonus + killPenalty);
        const gameResultBonus = ((isWinner) ? (this.WIN_BONUS * gameLenghtBonus) : (this.WIN_BONUS * -1 * gameLenghtBonus));

        return (gameActionBonus + gameResultBonus) * scoreScale;
    }

    calculateScoreScale(playerScore: number, oppoentScore: number) {
        const scoreScale = Math.min(Math.max(oppoentScore / playerScore, this.MIN_SCORE_SCALE), this.MAX_SCORE_SCALE);
        return scoreScale;
    }

    calculateGameLengthMultiplier(maxGameLengt: number, minGameLength: number, gameLength: number) {
        const gameLengthNormalized = (gameLength - minGameLength) / (maxGameLengt - minGameLength);
        return -gameLengthNormalized + 1;
    }

    calcuateHitBonus(hitNumber: number, missNumber: number) {
        const hitPercentage = hitNumber / (hitNumber + missNumber);
        return hitNumber * this.HIT_BONUS * hitPercentage;        
    }

    calculateKillBonus(opponentsShips: {size: number, hp: number}[]) {
        let killBonus = 0;

        opponentsShips.forEach(s => {
            if(s.hp == 0) {
                killBonus += this.KILL_BONUS * s.size * (1/s.size);
            }
        });

        return killBonus;
    }
}