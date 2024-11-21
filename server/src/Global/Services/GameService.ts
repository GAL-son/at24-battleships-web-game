import IPlayer from "Interfaces/IPlayer";
import Game from "Global/Logic/Game/Game";


class GameService {
    games: Map<string, Game> = new Map();
    users: Map<string, IPlayer> = new Map();
    
        
}

export default GameService;