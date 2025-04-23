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
import { IncomingMessage } from 'http';
import { StripeEventType } from 'src/types/payment.types';
import Stripe from 'stripe';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2025-03-31.basil',
  });

  @Get(':id/check-payment-status')
  checkPaymentStatus(@Req() { user }, @Param('id') id: string) {
    return this.paymentService.checkPaymentStatus(user?.email, id);
  }

  @Post('webhook')
  async handleWebhook(@Req() req: Request) {
    const event = req.body as unknown as {
      type: StripeEventType;
      data: {
        object: { id: string; amount_paid: number; customer_email: string };
      };
    };

    switch (event.type) {
      case StripeEventType.InvoicePaid:
        const result = event.data.object;

        this.paymentService.confirmSubscription(
          result.customer_email,
          result.id,
        );
        break;
      case StripeEventType.PaymentIntentFailed:
        const failedIntent = event?.data?.object;
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  }
}
