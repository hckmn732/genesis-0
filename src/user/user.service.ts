import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateUserDto } from './update-user.dto';
import * as bcrypt from 'bcryptjs'; // pour hashPassword

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>, // Utilisation de 'userRepo' pour être cohérent
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepo.find();
  }

  // Trouver un utilisateur par son ID
  async findById(id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['subscription', 'subscription.subscriptionPlan'],
    });

    if (!user) throw new NotFoundException('Utilisateur non trouvé');

    const { password, ...rest } = user; // Exclure le mot de passe avant de renvoyer les données
    return rest;
  }

  // Trouver un utilisateur par son email
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({
      where: { email },
      relations: ['subscription'],
    });
  }

  // Mise à jour des informations de l'utilisateur
  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepo.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé'); // Plus précis que 'User not found'
    }

    // Vérification de l'unicité de l'email (si l'email a été modifié)
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepo.findOne({
        where: { email: updateUserDto.email },
      });
      if (existingUser) {
        throw new ConflictException('Cet email est déjà utilisé'); // Vérifie que l'email n'est pas déjà pris
      }
    }

    // Mise à jour des champs utilisateur
    if (updateUserDto.name) user.name = updateUserDto.name;
    if (updateUserDto.email) user.email = updateUserDto.email;
    if (updateUserDto.phone) user.phone = updateUserDto.phone;
    if (updateUserDto.address) user.address = updateUserDto.address; // Gestion de l'adresse
    if (updateUserDto.password) {
      // Hachage du mot de passe si un nouveau mot de passe est fourni
      user.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    // Sauvegarde de l'utilisateur mis à jour dans la base de données
    return this.userRepo.save(user);
  }
}
