import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionPlanSeeder } from './subscription-plan.seeder';
import { SubscriptionPlan } from 'src/subscription-plan/subscription-plan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionPlan])],
  providers: [SubscriptionPlanSeeder],
})
export class SeedModule {}
