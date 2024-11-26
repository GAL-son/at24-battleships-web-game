import bcrypt from 'bcrypt';
import { config } from '../../config';
import { AuthData } from 'Rest/Messages/AuthMessages';
import UserRepository from 'Global/Database/Repositories/UserRepository';
import typia, { tags } from 'typia';
import { AuthError, NotFoundError } from '../../Errors/Errors';
import { log } from 'console';

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