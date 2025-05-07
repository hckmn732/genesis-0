import { Payment } from 'src/payment/payment.entity';
import { Subscription } from 'src/subscription/subscription.entity';
import { Roles } from 'src/types/user.types';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'text' })
  password: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column()
  role: Roles;

  // ✅ Relation vers la souscription (1:1)
  @OneToOne(() => Subscription, (subscription) => subscription.user, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  subscription: Subscription;

  // ✅ Relation vers les paiements (1:N)
  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];
}
