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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

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
}
