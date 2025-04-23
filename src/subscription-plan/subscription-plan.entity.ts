import { Payment } from 'src/payment/payment.entity';
import { Subscription } from 'src/subscription/subscription.entity';
import { Roles } from 'src/types/user.types';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('subscription_plan')
export class SubscriptionPlan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column({ type: 'text', nullable: true })
  stripePriceId: string;

  @Column()
  billingCycle: string;

  @Column({ type: 'text' })
  features: string;

  @OneToMany(
    () => Subscription,
    (subscription) => subscription.subscriptionPlan,
  )
  subscriptions: Subscription[];

  @OneToMany(() => Payment, (payment) => payment.subscriptionPlan)
  payments: Payment[];
}
