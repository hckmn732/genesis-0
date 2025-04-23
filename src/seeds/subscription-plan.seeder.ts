import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionPlan } from 'src/subscription-plan/subscription-plan.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SubscriptionPlanSeeder {
  constructor(
    @InjectRepository(SubscriptionPlan)
    private readonly subscriptionPlanRepo: Repository<SubscriptionPlan>,
  ) {}

  async seed() {
    const plans = [
      {
        name: 'Soft',
        price: 9.99,
        billingCycle: 'monthly',
        features: [
          'Basic Support',
          'Single User',
          'Limited Reports',
          'Community Access',
          '5 GB Storage',
        ],
      },
      {
        name: 'Pro',
        price: 29.99,
        billingCycle: 'monthly',
        features: [
          'Priority Support',
          'Multi User',
          'Advanced Reports',
          'Team Collaboration',
          '50 GB Storage',
        ],
      },
      {
        name: 'Elite',
        price: 99.99,
        billingCycle: 'monthly',
        features: [
          '24/7 Support',
          'Unlimited Users',
          'Custom Dashboards',
          'Dedicated Account Manager',
          '1 TB Storage',
        ],
      },
    ];

    for (const plan of plans) {
      const exists = await this.subscriptionPlanRepo.findOneBy({
        name: plan.name,
      });
      if (!exists) {
        const created = this.subscriptionPlanRepo.create({
          ...plan,
          features: plan.features.join(' | '),
        });
        await this.subscriptionPlanRepo.save(created);
        Logger.log(`✅ Seeded plan: ${plan.name}`);
      }
    }
  }
}
