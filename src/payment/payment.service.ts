import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription } from 'src/subscription/subscription.entity';
import { Repository } from 'typeorm';
import { Payment } from './payment.entity';
import { User } from 'src/user/user.entity';
import { PaymentStatuses } from 'src/types/payment.types';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepo: Repository<Subscription>,
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async paymentFailed(email: string) {
    //handle payment failed
  }

  async confirmSubscription(email: string, stripeId: string) {
    const customer = await this.userRepo.findOneBy({ email });
    const subscription = await this.subscriptionRepo.findOne({
      where: { user: customer! },
    });

    const payment = await this.paymentRepo.findOne({
      where: { subscription: subscription!, status: PaymentStatuses.PENDING },
    });

    const now = new Date();
    const future = new Date();
    future.setMonth(future.getMonth() + 3);

    if (customer && subscription && payment) {
      subscription.isActive = true;
      subscription.startDate = now;
      subscription.endDate = future;

      payment.date = new Date();
      payment.status = PaymentStatuses.PAID;
      await this.paymentRepo.save(payment);

      subscription.payments.push(payment);

      await this.subscriptionRepo.save(subscription);

      return true;
    }

    return false;
  }

  async checkPaymentStatus(email: string, stripeId: string) {
    const user = await this.userRepo.findOneBy({ email });

    const subscription = await this.subscriptionRepo.findOne({
      where: { user: user! },
    });

    if (!user || !subscription)
      throw new ForbiddenException(
        'You are not allowed to access this resource',
      );

    const payment = await this.paymentRepo.findOne({
      where: { subscription, stripeId },
    });

    if (!payment) throw new NotFoundException('Not found');

    if (payment.status === PaymentStatuses.PAID) return { paid: true };
  }
}
