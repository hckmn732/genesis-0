import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionPlan } from './subscription-plan.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SubscriptionPlanService {
  constructor(
    @InjectRepository(SubscriptionPlan)
    private readonly planRepo: Repository<SubscriptionPlan>,
  ) {}

  async getPlans() {
    const plans = await this.planRepo.find();

    return plans?.map((plan) => ({
      ...plan,
      features: plan.features.split('|'),
    }));
  }
}
