import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UsersEntity)
    private usersRepo: Repository<UsersEntity>,
  ) {}

  // get list of all users
  async findAll(page = 1, limit = 10): Promise<UsersEntity[]> {
    const data = await this.usersRepo.findAndCount({
      skip: page > 0 ? (page - 1) * limit : 0,
      take: limit,
    });

    return data[0];
  }
}
