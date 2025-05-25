import {
  BadRequestException,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { UseGuards } from '@nestjs/common';

import { IncomingMessage } from 'http';
import { StripeEventType } from 'src/types/payment.types';
import Stripe from 'stripe';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2025-03-31.basil',
  });
  @UseGuards(JwtAuthGuard)
  @Get(':id/check-payment-status')
  checkPaymentStatus(@Req() { user }, @Param('id') id: string) {
    return this.paymentService.checkPaymentStatus(user?.email, id);
  }

  @Post('webhook')
  async handleWebhook(@Req() req: Request) {
    const event = req.body as unknown as {
      type: StripeEventType;
      data: {
        object: {
          subscription: string;
          amount_paid: number;
          customer_email: string;
        };
      };
    };

    const result = event.data.object;
    switch (event.type) {
      case StripeEventType.CheckoutSessionCompleted:
        console.log({ maindata: result });
        this.paymentService.confirmSubscription(
          result.customer_email,
          result.subscription,
        );

      case StripeEventType.PaymentIntentFailed:
        const failedIntent = event?.data?.object;
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  }
  @UseGuards(JwtAuthGuard)
  @Get('history')
  async getHistory(@Req() { user }) {
    if (!user) {
      throw new Error('Utilisateur non authentifié');
    }

    return this.paymentService.getUserPayments(user.id);
  }
}
