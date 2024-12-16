import IPlayer from "Interfaces/IPlayer";
import WsServerMessageBuilder from "../Messages/WsServerMessageBuilder";
import { GameSetupMessage, ServerMessages } from "../Messages/Types/WsServerMessages";
import Game from "../../Global/Logic/Game/Game";
import { defaultGameSetup, testGameSetup } from "../../Resources/GameSetups";
import { MoveData, ShipPlacement } from "Global/Logic/Game/Types";
import { randomUUID } from "crypto";
import { IGameModel } from "Global/Database/Models/IGameModel";
import GameRepository from "Global/Database/Repositories/GameRepository";
import { error } from "console";
import { GameResult } from "Ws/Types/GameResult";
import ScoreService from "./ScoreService";
import { GameType, PlayerMessage, PlayerMessages, PlayerMoveMessage, SetShipsMessage } from "../Messages/Types/WsPlayerMessages";
import AIPlayer from "../../Global/Logic/Players/AIPlayer";
import typia from "typia";

class GameService {
    // Queue
    readonly START_SKILLGAP = 250;
    readonly SKILLGAP_DEFAULT_GAIN = 200;
    readonly GAME_SEARCH_REPEAT_TIME = 10000;
    queue: Map<string, IPlayer> = new Map(); // Player name to player
    queueMaxSkillGap: Map<string, number> = new Map(); // player name to skill gap limit
    searchEstimateSeconds: number = 10;

    // Game
    games: Map<string, Game> = new Map(); // game id to game
    players: Map<string, string> = new Map(); // player name to game id

    // Repositories
    gameRepository: GameRepository;

    // services
    scoreService: ScoreService;
    constructor(gameRepository: GameRepository, scoreService: ScoreService) {
        this.gameRepository = gameRepository
        this.scoreService = scoreService;
    }

    addToQueue(player: IPlayer, gameType: GameType) {
        if (this.players.has(player.name)) {
            throw new Error("Already in game");
        }

        if (gameType == GameType.SINGLEPLAYER) {
            this.gameWithBot(player);
            return;
        }

        this.queue.set(player.name, player);
        this.queueMaxSkillGap.set(player.name, this.START_SKILLGAP);
        player.sendMessage(WsServerMessageBuilder.createGenericServerMessage(ServerMessages.SEARCH_STARTED));
        
        this.processQueue(player.name);
    }
    
    gameWithBot(player: IPlayer) {
        player.sendMessage(WsServerMessageBuilder.createGenericServerMessage(ServerMessages.SEARCH_STARTED));
        const bot: AIPlayer = new AIPlayer(this.botHandler)
        this.createGame(player, bot);
    }

    botHandler = (bot: AIPlayer, message: PlayerMessage): void => {
        console.log("MESSAGE FROM BOT");
        console.log(message);

        const botName = this.players.get(bot.name);
        if(botName === undefined) {
            console.warn("Bot " + bot.name + " tries to play game when not registered")
            return;
        }
        const botGame = this.games.get(botName);
        if(botGame === undefined) {
            console.warn("Bot" + botName + " missing game");
            return;
        }

        const botMessage = message as PlayerMessage;
        switch (botMessage.message) {
            case PlayerMessages.SET_SHIPS:
                if (!typia.is<SetShipsMessage>(botMessage)) {
                    console.warn("Invalid Bot Message");
                    return;
                }
                console.log("BOT SET SHIPS");
                this.setShips(bot, botMessage.ships);
                break;
            case PlayerMessages.MOVE:
                if (!typia.is<PlayerMoveMessage>(botMessage)) {
                    console.warn("Invalid bot move message");
                    return;
                }
                const moveMessage = botMessage as PlayerMoveMessage;
                this.playerMove(bot,  moveMessage.move);
                break;
            default:
                console.warn("Unknown bot message");
                break;
        }
    }


    removeFromQueue(player: IPlayer) {
        this.queue.delete(player.name);
        this.queueMaxSkillGap.delete(player.name);
    }

    setShips(player: IPlayer, ships: ShipPlacement[]) {
        const game = this.getPlayerGame(player);
        console.log(game);
        
        game.setShips(player, ships);

        console.log("CAN START");
        // console.log(game.canGameStart());
        

        setTimeout(() => {
            if (game.canGameStart()) {
                this.startGame(game);
            }
        }, 100);
    }

    processQueue = (name: string): void => {
        console.info("Search Started for player: " + name);
        if (this.queue.size <= 0) {
            console.info("Queue Empty");
            return;
        }

        if (this.queue.size <= 1) {
            console.info("Not enough players");
            this.restartSearch(name);
            return;
        }

        let currentSkillgap = Number.MAX_VALUE;
        const maxPlayerSkillGap = this.queueMaxSkillGap.get(name) || Number.MAX_VALUE;
        const currentPlayer = this.queue.get(name);

        if (currentPlayer === undefined) {
            return;
        }

        let currentOpponent = currentPlayer;
        this.queue.forEach((player, key) => {
            if (name !== key) {
                const newSkillgap = Math.abs(currentPlayer.score - player.score);
                if (newSkillgap < currentSkillgap) {
                    console.log("Update skillGap from " + currentSkillgap + " to " + newSkillgap);
                    currentSkillgap = newSkillgap
                    currentOpponent = player;
                }
            }
        });

        console.log("Skill gap for player: " + name + " - " + maxPlayerSkillGap + " Current skill gap" + currentSkillgap);

        if (currentSkillgap > maxPlayerSkillGap) {
            console.info("Skill gap to big");
            const newMaxSkillGap = maxPlayerSkillGap + Math.exp(this.SKILLGAP_DEFAULT_GAIN * (1 / this.queue.size));
            this.queueMaxSkillGap.set(name, newMaxSkillGap);

            this.restartSearch(name);
        } else {
            if (currentOpponent?.name === currentPlayer.name) {
                throw new Error("Player cant compete with him self");
            }

            console.info("GAME FOUND");
            this.createGame(currentOpponent, currentPlayer);

            this.queue.delete(name);
            this.queue.delete(currentOpponent.name);
        }
    }

    restartSearch(name: string) {
        console.log("Prepare new search for: " + name);
        setTimeout(this.processQueue.bind(this, name), this.GAME_SEARCH_REPEAT_TIME);
    }

    createGame(player1: IPlayer, player2: IPlayer) {
        const gameSetup = defaultGameSetup;
        const game = new Game(gameSetup, this.clearEndedGames, this.updateScore);

        game.linkPlayer(player1);
        game.linkPlayer(player2);

        const gameId = randomUUID();

        this.games.set(gameId, game);
        this.players.set(player1.name, gameId);
        this.players.set(player2.name, gameId);

        const message1: GameSetupMessage = WsServerMessageBuilder.createGameSetupMessage(
            gameSetup,
            {
                name: player2.name,
                score: player2.score
            }
        );
        const message2: GameSetupMessage = WsServerMessageBuilder.createGameSetupMessage(
            gameSetup,
            {
                name: player1.name,
                score: player1.score
            }
        );

        player1.sendMessage(message1);
        player2.sendMessage(message2);
    }

    startGame(game: Game) {
        game.start();
    }

    playerMove(player: IPlayer, move: MoveData) {
        const game = this.getPlayerGame(player);

        game.move(player, move);
    }

    getPlayerGame(player: IPlayer) {
        const gameId = this.players.get(player.name);

        if (gameId === undefined || (!this.games.has(gameId))) {
            throw new Error("Cant find game for player");
        }

        const game = this.games.get(gameId);

        if (game === undefined) {
            throw new Error("Cant find game for player");
        }

        return game;
    }

    clearEndedGames = () => {
        this.games.forEach((game, id) => {
            if (game.gameEnded) {
                console.log("CLEAR GAME WITH ID: " + id);

                this.endGame(id);
            }
        });
    }

    endGame(gameIdGameToDelete: string) {
        // Arcivise game
        try {
            this.archiveGame(gameIdGameToDelete);
        } catch (error) {
            console.error("Can not save game");
        }
        // Kill game
        this.games.delete(gameIdGameToDelete);

        // Unlink players
        this.players.forEach((gameId, playerName) => {
            if (gameId == gameIdGameToDelete) {
                console.log("DELETE FROM GAMES: " + playerName);

                this.players.delete(playerName);
            }
        })
    }

    archiveGame(gameID: string) {
        const game = this.games.get(gameID);
        let winner = game?.getWinner();
        if (game == undefined || !winner || winner == undefined) {
            throw new Error("Cant save game");
        }

        const gameData: IGameModel = {
            gameId: -1,
            player1Name: game.player1?.name || "",
            player2Name: game.player2?.name || "",
            player1Winner: winner.name == game.player1?.name,
            length: game.getLength()
        }

        try {
            this.gameRepository.saveGame(gameData);
        } catch (error: any) {
            console.error("FAILED TO SAVE TO DB");
        }
    }

    updateScore = async (name: string, result: GameResult): Promise<number> => {
        try {
            const scoreChange = await this.scoreService.updateScore(name, result);
            return scoreChange;
        } catch (e) {
            console.error("Cant update userScore!")
            if (e instanceof Error) {
                console.error(e.message);
            }
            return new Promise<number>(() => { return 0 })
        }
    }
}

export default GameService;