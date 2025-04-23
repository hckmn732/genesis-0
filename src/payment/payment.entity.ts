import { SubscriptionPlan } from 'src/subscription-plan/subscription-plan.entity';
import { Subscription } from 'src/subscription/subscription.entity';
import { PaymentStatuses } from 'src/types/payment.types';
import { Roles } from 'src/types/user.types';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
}
