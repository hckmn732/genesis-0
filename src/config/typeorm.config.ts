import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { Payment } from 'src/payment/payment.entity';
import { SubscriptionPlan } from 'src/subscription-plan/subscription-plan.entity';
import { Subscription } from 'src/subscription/subscription.entity';
import { User } from 'src/user/user.entity';

export const typeOrmConfigs = (
  config: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: config.get('DB_HOST'),
  port: config.get<number>('DB_PORT'),
  username: config.get('DB_USER'),
  password: config.get('DB_PASSWORD'),
  database: config.get('DB_NAME'),
  entities: [User, Payment, Subscription, SubscriptionPlan],
  synchronize: true,
});
