import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { typeOrmConfigs } from 'src/config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionPlan } from 'src/subscription-plan/subscription-plan.entity';
import { Payment } from 'src/payment/payment.entity';
import { Subscription } from './subscription.entity';
import { User } from 'src/user/user.entity';

@Module({
  providers: [SubscriptionService],
  controllers: [SubscriptionController],
  imports: [
    TypeOrmModule.forFeature([SubscriptionPlan, Payment, Subscription, User]),
  ],
})
export class SubscriptionModule {}
