import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from 'src/payment/payment.entity';
import { SubscriptionPlan } from 'src/subscription-plan/subscription-plan.entity';
import Stripe from 'stripe';
import { Repository } from 'typeorm';
import { Subscription } from './subscription.entity';
import { User } from 'src/user/user.entity';
import { PaymentStatuses } from 'src/types/payment.types';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(SubscriptionPlan)
    private readonly planRepo: Repository<SubscriptionPlan>,
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepo: Repository<Subscription>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2025-03-31.basil',
  });

  async createCheckoutSession(email: string, planId: number) {
    const plan = await this.planRepo.findOneBy({ id: planId });
    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    const user = await this.userRepo.findOneBy({ email });
    let subscription = await this.subscriptionRepo.findOne({
      where: { user: user! },
    });

    if (!user) throw new NotFoundException('User not found');

    if (!subscription) {
      subscription = this.subscriptionRepo.create({
        isActive: false,
        user,
        subscriptionPlan: plan,
      });
    }

    const savedSubscription = await this.subscriptionRepo.save(subscription);

    const pendingPayment = await this.paymentRepo.findOne({
      where: { status: PaymentStatuses.PENDING },
    });

    if (pendingPayment) {
      pendingPayment.status = PaymentStatuses.CANCELLED;
      await this.paymentRepo.save(pendingPayment);
    }

    const payment = this.paymentRepo.create({
      amount: plan.price,
      currency: 'EUR',
      status: PaymentStatuses.PENDING,
      subscription: savedSubscription,
      subscriptionPlan: plan,
    });

    await this.paymentRepo.save(payment);

    const created = await this.stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price: plan.stripePriceId,
          quantity: 1,
        },
      ],
      success_url:
        'http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:5173/cancel',
    });

    payment.stripeId = created.id;

    await this.paymentRepo.save(payment);

    return created;
  }

  getStripe() {
    return process.env.STRIPE_SECRET_KEY;
  }
}
