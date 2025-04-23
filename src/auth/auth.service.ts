import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignupDTO } from './auth.dto';
import { Roles } from 'src/types/user.types';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.userRepo.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { id: user.id, email: user.email };
      return {
        access_token: this.jwtService.sign(payload),
      };
    }
    throw new NotFoundException('Invalid credentials');
  }
  async signup(createUserDTO: SignupDTO) {
    const {
      email,
      password,
      name,
      address: userAddress,
      phone,
    } = createUserDTO;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepo.create({
      email,
      password: hashedPassword,
      name,
      address: userAddress,
      phone,
      createdAt: new Date(),
      updatedAt: new Date(),
      role: Roles.user,
    });

    await this.userRepo.save(user);
    const payload = { id: user.id, email: user.email };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
