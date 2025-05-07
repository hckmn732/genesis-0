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

    if (!user) throw new NotFoundException('User not found');

    let subscription = await this.subscriptionRepo
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.user', 'user')
      .where('user.id = :user', { user: user.id })
      .getOne();

    if (!subscription) {
      subscription = this.subscriptionRepo.create({
        isActive: false,
        user,
      });
    }
    subscription.subscriptionPlan = plan;

    const savedSubscription = await this.subscriptionRepo.save(subscription);

    const pendingPayment = await this.paymentRepo
      .createQueryBuilder('p')
      .innerJoinAndSelect('p.subscription', 'subscription')
      .where('subscription.user = :user', { user: user.id })
      .andWhere('p.status = :status', { status: 'PENDING' })
      .getOne();

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
      success_url: 'http://localhost:5173/dashboard',
      cancel_url: 'http://localhost:5173/cancel',
    });

    payment.stripeId = created.id;

    await this.paymentRepo.save(payment);

    return created;
  }

  getStripe() {
    return process.env.STRIPE_SECRET_KEY;
  }
  async getUserSubscription(userId: number) {
    return this.subscriptionRepo.findOne({
      where: { user: { id: userId } },
      relations: ['subscriptionPlan'],
    });
  }
  async getSubscriptionByUserId(userId: number): Promise<Subscription | null> {
    return this.subscriptionRepo.findOne({
      where: { user: { id: userId } },
      relations: ['subscriptionPlan'],
    });
  }
  // async changePlan(userId: number, newPlanId: number) {
  //   // 1. On récupère l'abonnement de l'utilisateur avec le plan actuel
  //   const subscription = await this.subscriptionRepo.findOne({
  //     where: { user: { id: userId } },
  //     relations: ['user', 'subscriptionPlan'],
  //   });

  //   if (!subscription) {
  //     throw new NotFoundException('Abonnement introuvable');
  //   }

  //   // 2. On récupère le nouveau plan
  //   const newPlan = await this.planRepo.findOne({
  //     where: { id: newPlanId },
  //   });

  //   if (!newPlan) {
  //     throw new NotFoundException('Nouveau plan introuvable');
  //   }

  //   // 3. Mise à jour du plan de l'abonnement
  //   subscription.subscriptionPlan = newPlan;

  //   // 4. Sauvegarde
  //   await this.subscriptionRepo.save(subscription);

  //   return subscription;
  // }
  async cancelSubscription(userId: number): Promise<{ message: string }> {
    const subscription = await this.subscriptionRepo.findOne({
      where: { user: { id: userId } },
    });

    if (!subscription) {
      throw new NotFoundException('Aucun abonnement à annuler');
    }

    subscription.isActive = false;
    subscription.endDate = new Date();
    await this.subscriptionRepo.save(subscription);

    return { message: 'Abonnement annulé avec succès' };
  }
  // async createBillingPortal(email: string): Promise<{ url: string }> {
  //   // Récupère le client Stripe existant
  //   const customers = await this.stripe.customers.list({ email });
  //   if (!customers.data.length) {
  //     throw new NotFoundException('Client Stripe non trouvé');
  //   }
  //   // Crée une session sur le Customer Portal
  //   const session = await this.stripe.billingPortal.sessions.create({
  //     customer: customers.data[0].id,
  //     return_url: process.env.FRONT_URL || 'http://localhost:5173/dashboard',
  //   });
  //   return { url: session.url };
  // }
}
