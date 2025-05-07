import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { Delete } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('subscription')
@UseGuards(JwtAuthGuard)
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get('stripe')
  getStripeToken() {
    return this.subscriptionService.getStripe();
  }

  @Post(':id/create-checkout-session')
  async createCheckout(@Param('id') id: number, @Req() { user }) {
    const session = await this.subscriptionService.createCheckoutSession(
      user.email,
      id,
    );
    return { url: session.url, id: session.id };
  }
  @Get('me')
  async getMySubscription(@Req() req: Request) {
    const user = req.user as any;

    const subscription = await this.subscriptionService.getSubscriptionByUserId(
      user.id,
    );

    // Le contrôleur formate ici la réponse vers le frontend
    return {
      subscription: subscription
        ? {
            id: subscription.id,
            planName: subscription.subscriptionPlan?.name || 'Inconnu',
            startDate: subscription.startDate,
            endDate: subscription.endDate,
            isActive: subscription.isActive,
          }
        : null,
    };
  }
  // @Post('change-plan')
  // async changePlan(@Req() req: Request, @Body() body: { newPlanId: number }) {
  //   const user = req.user as any;
  //   const { newPlanId } = body;

  //   return this.subscriptionService.changePlan(user.id, newPlanId);
  // }
  @Delete('cancel')
  async cancel(@Req() req: Request) {
    const user = req.user as any; // injecté par JwtAuthGuard
    return this.subscriptionService.cancelSubscription(user.id);
  }
  // @Get('manage-billing')
  // async manageBilling(@Req() req: Request) {
  //   const user = req.user as any; // injecté par JwtAuthGuard
  //   // Renvoie { url }
  //   return this.subscriptionService.createBillingPortal(user.email);
  // }
}
