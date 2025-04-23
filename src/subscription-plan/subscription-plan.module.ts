import { Module } from '@nestjs/common';
import { SubscriptionPlanService } from './subscription-plan.service';
import { SubscriptionPlanController } from './subscription-plan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionPlan } from './subscription-plan.entity';

@Module({
  providers: [SubscriptionPlanService],
  controllers: [SubscriptionPlanController],
  imports: [TypeOrmModule.forFeature([SubscriptionPlan])],
})
export class SubscriptionPlanModule {}
