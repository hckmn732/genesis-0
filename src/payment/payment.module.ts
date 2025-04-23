import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from 'src/subscription/subscription.entity';
import { Payment } from './payment.entity';
import { User } from 'src/user/user.entity';

@Module({
  providers: [PaymentService],
  controllers: [PaymentController],
  imports: [TypeOrmModule.forFeature([Subscription, Payment, User])],
})
export class PaymentModule {}
