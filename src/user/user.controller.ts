import {
  Body,
  Controller,
  Get,
  Put,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'; // Assurez-vous que ce chemin est correct
import { UserService } from './user.service';
import { UpdateUserDto } from './update-user.dto'; // Assurez-vous que le chemin est correct

@Controller('user')
@UseGuards(JwtAuthGuard) // Cette protection garde les routes sécurisées
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('test')
  getTestData() {
    return [
      {
        name: 'Yann',
        email: 'gaelfomen@gmail.com',
        password: 'Elfomen',
      },
    ];
  }

  @Get('me')
  async getUser(@Req() { user }) {
    console.log(user); // Affiche l'utilisateur connecté
    return this.userService.findById(user.id); // Récupère l'utilisateur par son id
  }

  @Put('update/:id')
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, updateUserDto); // Mise à jour de l'utilisateur
  }
}
