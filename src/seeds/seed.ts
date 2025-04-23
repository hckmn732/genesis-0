import { NestFactory } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SeedModule } from './seed.module';
import { SubscriptionPlanSeeder } from './subscription-plan.seeder';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeedModule, {
    logger: false,
  });

  const seeder = app.get(SubscriptionPlanSeeder);
  await seeder.seed();

  await app.close();
}

bootstrap();
