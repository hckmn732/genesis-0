import { Payment } from 'src/payment/payment.entity';
import { SubscriptionPlan } from 'src/subscription-plan/subscription-plan.entity';
import { Roles } from 'src/types/user.types';
import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('subscription')
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @Column()
  isActive: boolean;

  @OneToOne(() => User, (user) => user.subscription)
  user: User;

  @ManyToOne(
    () => SubscriptionPlan,
    (subscriptionPlan) => subscriptionPlan.subscriptions,
  )
  subscriptionPlan: SubscriptionPlan;

  @OneToMany(() => Payment, (payment) => payment.subscription)
  payments: Payment[];
}
