import { Controller, Get } from '@nestjs/common';
import { SubscriptionPlanService } from './subscription-plan.service';

@Controller('subscription-plan')
export class SubscriptionPlanController {
  constructor(private readonly planService: SubscriptionPlanService) {}
  @Get('')
  getSubscriptionPlans() {
    return this.planService.getPlans();
  }
}
