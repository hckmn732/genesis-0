export enum PaymentStatuses {
  PENDING = 'PENDING',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
}

export enum StripeEventType {
  ChargeSucceeded = 'charge.succeeded',
  PaymentMethodAttached = 'payment_method.attached',
  CustomerCreated = 'customer.created',
  CheckoutSessionCompleted = 'checkout.session.completed',
  CustomerSubscriptionCreated = 'customer.subscription.created',
  PaymentIntentSucceeded = 'payment_intent.succeeded',
  PaymentIntentFailed = 'payment_intent.payment_failed',
  PaymentIntentCreated = 'payment_intent.created',
  InvoiceCreated = 'invoice.created',
  InvoiceFinalized = 'invoice.finalized',
  InvoicePaid = 'invoice.paid',
  InvoicePaymentSucceeded = 'invoice.payment_succeeded',
  CustomerUpdated = 'customer.updated',
}
