import { SubscriptionPlan } from 'src/subscription-plan/subscription-plan.entity';
import { Subscription } from 'src/subscription/subscription.entity';
import { PaymentStatuses } from 'src/types/payment.types';
import { User } from 'src/user/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('payment')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @Column({ nullable: true })
  date: Date;

  @Column()
  status: PaymentStatuses;

  @Column({ nullable: true })
  stripeId: string;

  @Column()
  currency: string;

  @ManyToOne(() => Subscription, (subscription) => subscription.payments)
  subscription: Subscription;

  @ManyToOne(
    () => SubscriptionPlan,
    (subscriptionPlan) => subscriptionPlan.payments,
  )
  subscriptionPlan: SubscriptionPlan;

  @ManyToOne(() => User, (user) => user.payments)
  user: User;
}
