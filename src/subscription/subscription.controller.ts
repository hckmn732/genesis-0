import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('subscription')
@UseGuards(JwtAuthGuard) // Protège toutes les routes de ce contrôleur
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  // 🔐 Récupère la clé Stripe pour le frontend
  @Get('stripe')
  getStripeToken() {
    return this.subscriptionService.getStripe();
  }

  // 🚀 Crée une session de paiement Stripe
  @Post(':id/create-checkout-session')
  async createCheckoutSession(
    @Param('id') planId: number,
    @Req() req: Request,
  ) {
    const user = req.user as any;
    const session = await this.subscriptionService.createCheckoutSession(
      user.email,
      planId,
    );
    return {
      url: session.url,
      id: session.id,
    };
  }

  // 🔎 Récupère l’abonnement de l’utilisateur connecté
  @Get('me')
  async getMySubscription(@Req() req: Request) {
    const user = req.user as any;

    const subscription = await this.subscriptionService.getSubscriptionByUserId(
      user.id,
    );

    return {
      subscription: subscription
        ? {
            id: subscription.id,
            planName: subscription.subscriptionPlan?.name || 'Inconnu',
            startDate: subscription.startDate,
            endDate: subscription.endDate,
            isActive: subscription.isActive,
            plan: subscription.subscriptionPlan,
          }
        : null,
    };
  }

  // ❌ Annule l’abonnement en cours de l’utilisateur connecté
  @Delete('cancel')
  async cancelSubscription(@Req() req: Request) {
    const user = req.user as any;
    return this.subscriptionService.cancelSubscription(user.id);
  }
  // @Get('available-plans')
  // async getAvailablePlans(@Req() req: Request) {
  //   const user = req.user as any;

  //   const activeSub = await this.subscriptionService.getSubscriptionByUserId(
  //     user.id,
  //   );
  //   const currentPlanId = activeSub?.subscriptionPlan?.id;

  //   const plans = await this.subscriptionService.getAllPlans();

  //   return plans.filter((plan) => plan.id !== currentPlanId);
  // }
}
