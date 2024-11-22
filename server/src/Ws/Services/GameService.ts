import IPlayer from "Interfaces/IPlayer";
import WsServerMessageBuilder from "../Messages/WsServerMessageBuilder";
import { GameSetupMessage, ServerMessages } from "../Messages/Types/WsServerMessages";
import Game from "../../Global/Logic/Game/Game";
import { defaultGameSetup } from "../../Resources/DefaultBoardSetup";

class GameService {   
    // Queue
    readonly START_SKILLGAP = 10;
    readonly GAME_SEARCH_REPEAT_TIME = 10000;
    queue: Map<string, IPlayer> = new Map();    
    queueMaxSkillGap: Map<string, number> = new Map();
    searchEstimateSeconds: number = 10;

    // Game
    games: Map<string, Game> = new Map();
    players: Map<string, string> = new Map();    

    addToQueue(player: IPlayer) {
        if(this.players.has(player.name)) {
            throw new Error("Already in game");
        }

        this.queue.set(player.name, player);
        this.queueMaxSkillGap.set(player.name, this.START_SKILLGAP);
        player.sendMessage(WsServerMessageBuilder.createGenericServerMessage(ServerMessages.SEARCH_STARTED));

        this.processQueue(player.name);
    }   

    removeFromQueue(player: IPlayer) {
        this.queue.delete(player.name);
    }

    processQueue = (name: string): void => {
        console.info("Search Started for player: " + name);
        if(this.queue.size <= 0) {
            console.info("Queue Empty");
            return;
        } 

        if(this.queue.size <= 1) {
            console.info("Not enough players");
            setTimeout(this.processQueue.bind(name), this.GAME_SEARCH_REPEAT_TIME);
            return;
        }

        let currentSkillgap = Number.MAX_VALUE;
        const maxPlayerSkillGap = this.queueMaxSkillGap.get(name) || Number.MAX_VALUE;
        const currentPlayer = this.queue.get(name);

        if(currentPlayer === undefined) {
            return;
        }
        
        let currentOpponent = currentPlayer;
        this.queue.forEach((player, key) => {
            if(name !== key) {
                const newSkillgap = Math.abs(currentPlayer.score - player.score)
                if(newSkillgap < currentSkillgap) {
                    currentSkillgap = newSkillgap
                    currentOpponent = player;
                }
            }
        });

        if(currentSkillgap > maxPlayerSkillGap) {
            console.info("Skill gap to big");
            const newMaxSkillGap = maxPlayerSkillGap + Math.exp(maxPlayerSkillGap / this.START_SKILLGAP);
            this.queueMaxSkillGap.set(name, newMaxSkillGap);

            setTimeout(this.processQueue.bind(name), this.GAME_SEARCH_REPEAT_TIME);
        } else {
            if(currentOpponent?.name === currentPlayer.name) {
                throw new Error("Player cant compete with him self");
            }

            console.info("GAME FOUND");
            this.createGame(currentOpponent, currentPlayer);

            this.queue.delete(name);
            this.queue.delete(currentOpponent.name);
        }
    }

    createGame(player1: IPlayer, player2: IPlayer) {
        const gameSetup = defaultGameSetup;
        const game = new Game(gameSetup);



        game.player1 = player1;
        game.player2 = player2;

        const message1: GameSetupMessage = WsServerMessageBuilder.createGameSetupMessage(
            gameSetup.shipSizes,
            {
                name: player2.name,
                score: player2.score
            }
        );
        const message2: GameSetupMessage = WsServerMessageBuilder.createGameSetupMessage(
            gameSetup.shipSizes,
            {
                name: player1.name,
                score: player1.score
            }
        );

        player1.sendMessage(message1);
        player2.sendMessage(message2);
    }


    
        
}

export default GameService;