import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { User as UserEntity } from 'src/typeorm';
import { encodePassword } from 'src/utils/bycrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/CreateUser.dto';
import { SerializedUser, User } from './types/index';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,) {} 

    private users: User[] = [];

    getUsers(){
        return this.users.map((user) => new SerializedUser(user));
    }

    getUserByUsername(username: string){
        return this.users.find((user) => user.username === username);
    }

    getUserById(id: number){
        return this.users.find((user) => user.id === id);
    }

    createUser(createUserDto: CreateUserDto){
        const password = encodePassword(createUserDto.password);

        const newUser = this.userRepository.create({...createUserDto, password});
        return this.userRepository.save(newUser);
    }
}
