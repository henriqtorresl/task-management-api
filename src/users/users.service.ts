import { ConflictException, Injectable } from '@nestjs/common';
import { UserDto } from './users.dto';
import { hashSync as bcryptHashSync } from 'bcrypt';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/db/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private repository: Repository<UserEntity>,
  ) {}

  async create(newUser: UserDto) {
    const userAlreadyRegistered = await this.findByUsername(newUser.username);

    if (userAlreadyRegistered) {
      throw new ConflictException(
        `User '${newUser.username}' already registered`,
      );
    }

    const dbUser: UserEntity = new UserEntity();
    dbUser.username = newUser.username;
    dbUser.passwordHash = bcryptHashSync(newUser.password, 10);

    const { id, username } = await this.repository.save(dbUser);

    return {
      id,
      username,
    };
  }

  async findByUsername(username: string): Promise<UserDto | null> {
    const resultQuery = await this.repository.findOne({
      where: {
        username: username,
      },
    });

    if (!resultQuery) {
      return null;
    }

    return {
      id: resultQuery.id,
      username: resultQuery.username,
      password: resultQuery.passwordHash,
    };
  }
}
