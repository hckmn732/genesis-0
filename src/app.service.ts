import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getUser() {
    return [
      {
        nom: 'florine',
        prenom: 'kitio',
        sexe: 'feminin',
      },
    ];
  }
}
