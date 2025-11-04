import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

/**
 * Mail service for sending transactional emails via Resend
 */
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly resend: Resend;
  private readonly fromEmail = 'store@syaonlinetrading.com';
  private readonly staffEmails: string[];

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      this.logger.warn('RESEND_API_KEY not found in environment variables');
    }
    this.resend = new Resend(apiKey);
    const staffEmailsEnv = process.env.STAFF_EMAILS || '';
    this.staffEmails = staffEmailsEnv
      .split(',')
      .map((email) => email.trim())
      .filter((email) => email.length > 0);
  }

  /**
   * Sends email to customer with shipping details
   */
  async sendCustomerEmail(
    customerEmail: string,
    shippingDetails: {
      transactionReference?: string;
      amount?: string;
      narration?: string;
      address?: {
        accountName?: string;
        accountNumber?: string;
        bank?: { name?: string; code?: string };
      };
      shippingAddress?: string;
      waybill?: string;
      status?: string;
    },
  ): Promise<void> {
    try {
      const subject = 'Your Order Payment Confirmed - Shipping Details';
      const html = this.generateCustomerEmailTemplate(shippingDetails);

      await this.resend.emails.send({
        from: this.fromEmail,
        to: customerEmail,
        subject,
        html,
      });

      this.logger.log(`Customer email sent to ${customerEmail}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error sending customer email: ${errorMessage}`);
      throw error;
    }
  }

  /**
   * Sends email to staff with shipping details
   */
  async sendStaffEmail(
    shippingDetails: {
      transactionReference?: string;
      amount?: string;
      narration?: string;
      customerEmail?: string;
      address?: {
        accountName?: string;
        accountNumber?: string;
        bank?: { name?: string; code?: string };
      };
      shippingAddress?: string;
      waybill?: string;
      status?: string;
    },
  ): Promise<void> {
    if (this.staffEmails.length === 0) {
      this.logger.warn('No staff emails configured');
      return;
    }

    try {
      const subject = 'New Payment Received - Shipping Required';
      const html = this.generateStaffEmailTemplate(shippingDetails);

      await this.resend.emails.send({
        from: this.fromEmail,
        to: this.staffEmails,
        subject,
        html,
      });

      this.logger.log(`Staff email sent to ${this.staffEmails.join(', ')}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error sending staff email: ${errorMessage}`);
      throw error;
    }
  }

  /**
   * Generates customer email template
   */
  private generateCustomerEmailTemplate(details: {
    transactionReference?: string;
    amount?: string;
    narration?: string;
    address?: {
      accountName?: string;
      accountNumber?: string;
      bank?: { name?: string; code?: string };
    };
    shippingAddress?: string;
    waybill?: string;
    status?: string;
  }): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background-color: #f9f9f9; }
    .details { background-color: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
    .label { font-weight: bold; color: #555; }
    .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Payment Confirmed</h1>
    </div>
    <div class="content">
      <p>Dear Customer,</p>
      <p>Thank you for your payment! Your order has been confirmed and is being processed.</p>
      
      <div class="details">
        <h3>Transaction Details</h3>
        ${details.transactionReference ? `<p><span class="label">Transaction Reference:</span> ${details.transactionReference}</p>` : ''}
        ${details.amount ? `<p><span class="label">Amount:</span> ${details.amount}</p>` : ''}
        ${details.narration ? `<p><span class="label">Narration:</span> ${details.narration}</p>` : ''}
        ${details.status ? `<p><span class="label">Status:</span> ${details.status}</p>` : ''}
      </div>

      ${details.address ? `
      <div class="details">
        <h3>Payment Details</h3>
        ${details.address.accountName ? `<p><span class="label">Account Name:</span> ${details.address.accountName}</p>` : ''}
        ${details.address.accountNumber ? `<p><span class="label">Account Number:</span> ${details.address.accountNumber}</p>` : ''}
        ${details.address.bank?.name ? `<p><span class="label">Bank:</span> ${details.address.bank.name}</p>` : ''}
      </div>
      ` : ''}

      ${details.shippingAddress ? `
      <div class="details">
        <h3>Shipping Address</h3>
        <p>${details.shippingAddress}</p>
      </div>
      ` : ''}

      ${details.waybill ? `
      <div class="details">
        <h3>Shipping Information</h3>
        <p><span class="label">Waybill Number:</span> ${details.waybill}</p>
        <p>You can track your shipment using this waybill number.</p>
      </div>
      ` : ''}

      <p>We will notify you once your order has been shipped.</p>
      <p>If you have any questions, please contact our support team.</p>
    </div>
    <div class="footer">
      <p>Thank you for choosing Sya Online Trading</p>
      <p>This is an automated email. Please do not reply.</p>
    </div>
  </div>
</body>
</html>
    `.trim();
  }

  /**
   * Generates staff email template
   */
  private generateStaffEmailTemplate(details: {
    transactionReference?: string;
    amount?: string;
    narration?: string;
    customerEmail?: string;
    address?: {
      accountName?: string;
      accountNumber?: string;
      bank?: { name?: string; code?: string };
    };
    shippingAddress?: string;
    waybill?: string;
    status?: string;
  }): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #2196F3; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background-color: #f9f9f9; }
    .details { background-color: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #2196F3; }
    .label { font-weight: bold; color: #555; }
    .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
    .action { background-color: #FF9800; color: white; padding: 10px; text-align: center; margin: 20px 0; border-radius: 5px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Payment Received</h1>
    </div>
    <div class="content">
      <p>Dear Team,</p>
      <p>A new payment has been received and requires shipping processing.</p>
      
      <div class="details">
        <h3>Transaction Details</h3>
        ${details.transactionReference ? `<p><span class="label">Transaction Reference:</span> ${details.transactionReference}</p>` : ''}
        ${details.amount ? `<p><span class="label">Amount:</span> ${details.amount}</p>` : ''}
        ${details.narration ? `<p><span class="label">Narration:</span> ${details.narration}</p>` : ''}
        ${details.status ? `<p><span class="label">Status:</span> ${details.status}</p>` : ''}
        ${details.customerEmail ? `<p><span class="label">Customer Email:</span> ${details.customerEmail}</p>` : ''}
      </div>

      ${details.address ? `
      <div class="details">
        <h3>Payment Details</h3>
        ${details.address.accountName ? `<p><span class="label">Account Name:</span> ${details.address.accountName}</p>` : ''}
        ${details.address.accountNumber ? `<p><span class="label">Account Number:</span> ${details.address.accountNumber}</p>` : ''}
        ${details.address.bank?.name ? `<p><span class="label">Bank:</span> ${details.address.bank.name} (${details.address.bank.code || ''})</p>` : ''}
      </div>
      ` : ''}

      ${details.shippingAddress ? `
      <div class="details">
        <h3>Shipping Address</h3>
        <p>${details.shippingAddress}</p>
      </div>
      ` : ''}

      ${details.waybill ? `
      <div class="details">
        <h3>Shipping Information</h3>
        <p><span class="label">Waybill Number:</span> ${details.waybill}</p>
      </div>
      ` : ''}

      <div class="action">
        <p><strong>Action Required:</strong> Please process and ship this order.</p>
      </div>
    </div>
    <div class="footer">
      <p>This is an automated notification from Sya Online Trading</p>
    </div>
  </div>
</body>
</html>
    `.trim();
  }
}

