import bcrypt from 'bcrypt';
import { config } from '../config';
import { AuthData } from '../Resources/AuthMessages';
import UserRepository from 'Database/Repositories/UserRepository';
import { AuthError, NotFoundError } from '../Errors/Errors';

export default class PasswordService {
    readonly DEFAULT_SALT_ROUNDS = config.saltRounds;

    userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    public async validatePassword(authData: AuthData) {
        let user = await this.userRepository.getUser(authData.name);       
        if(!user) {
            throw new NotFoundError("No such user");
        }

        if(!bcrypt.compareSync(authData.password, user.password)) {
            throw new AuthError("Invalid Password");
        }

        return user;
    }

    public async encryptPassword(password: string) {
        return await bcrypt.hash(password, config.saltRounds);
    }
}