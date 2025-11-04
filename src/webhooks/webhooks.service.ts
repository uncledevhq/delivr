import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import { LencoWebhookDto } from './dto/lenco-webhook.dto';
import { TransactionSuccessfulDataDto } from './dto/transaction-successful.dto';
import { TransactionFailedDataDto } from './dto/transaction-failed.dto';
import { AccountBalanceUpdatedDataDto } from './dto/account-balance-updated.dto';
import {
  VirtualAccountTransactionDataDto,
  VirtualAccountTransactionSettledDataDto,
} from './dto/virtual-account-transaction.dto';
import { MailService } from '../mail/mail.service';

/**
 * Webhooks service for handling Lenco webhook events
 */
@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);
  private readonly webhookHashKey =
    process.env.LENCO_WEBHOOK_HASH_KEY ||
    '58bba0681697f6e19e08a9c2c917206b4eac79dc385f6969daf33ec9b083fb59';

  constructor(private readonly mailService: MailService) {}

  /**
   * Verifies the HMAC SHA512 signature from Lenco webhook
   */
  verifySignature(body: unknown, signature: string): boolean {
    try {
      const computedHash = crypto
        .createHmac('sha512', this.webhookHashKey)
        .update(JSON.stringify(body))
        .digest('hex');
      return computedHash === signature;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error verifying signature: ${errorMessage}`);
      return false;
    }
  }

  /**
   * Handles webhook events and routes to appropriate handlers
   */
  async handleEvent(event: string, data: unknown): Promise<void> {
    try {
      switch (event) {
        case 'transaction.successful':
          await this.handleTransactionSuccess(
            data as TransactionSuccessfulDataDto,
          );
          break;
        case 'transaction.failed':
          await this.handleTransactionFailure(data as TransactionFailedDataDto);
          break;
        case 'account.balance-updated':
          await this.handleBalanceUpdate(
            data as AccountBalanceUpdatedDataDto,
          );
          break;
        case 'virtual-account.transaction':
          await this.handleVirtualAccountEvent(
            data as VirtualAccountTransactionDataDto,
          );
          break;
        case 'virtual-account.transaction.settled':
          await this.handleVirtualAccountSettled(
            data as VirtualAccountTransactionSettledDataDto,
          );
          break;
        default:
          this.logger.warn(`Unhandled event: ${event}`);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error handling event ${event}: ${errorMessage}`);
      throw error;
    }
  }

  /**
   * Handles successful transaction events
   */
  private async handleTransactionSuccess(
    data: TransactionSuccessfulDataDto,
  ): Promise<void> {
    this.logger.log(
      `Transaction successful: ${data.id} - ${data.transactionReference}`,
    );

    try {
      const customerEmail = this.extractEmailFromData(data);
      const shippingDetails = {
        transactionReference: data.transactionReference,
        amount: data.amount,
        narration: data.narration,
        address: data.details
          ? {
              accountName: data.details.accountName,
              accountNumber: data.details.accountNumber,
              bank: data.details.bank
                ? {
                    name: data.details.bank.name,
                    code: data.details.bank.code,
                  }
                : undefined,
            }
          : undefined,
        status: data.status,
      };

      if (customerEmail && this.isValidEmail(customerEmail)) {
        await this.mailService.sendCustomerEmail(
          customerEmail,
          shippingDetails,
        );
      }

      await this.mailService.sendStaffEmail({
        ...shippingDetails,
        customerEmail: customerEmail && this.isValidEmail(customerEmail) ? customerEmail : undefined,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        `Error sending emails for transaction ${data.id}: ${errorMessage}`,
      );
    }
  }

  /**
   * Handles failed transaction events
   */
  private async handleTransactionFailure(
    data: TransactionFailedDataDto,
  ): Promise<void> {
    this.logger.warn(
      `Transaction failed: ${data.id} - ${data.reasonForFailure}`,
    );
    // TODO: Implement business logic for failed transactions
    // e.g., log failures, send alerts, etc.
  }

  /**
   * Handles account balance update events
   */
  private async handleBalanceUpdate(
    data: AccountBalanceUpdatedDataDto,
  ): Promise<void> {
    this.logger.log(
      `Balance updated for account ${data.id}: ${data.availableBalance} ${data.currency}`,
    );
    // TODO: Implement business logic for balance updates
    // e.g., sync balances, update records, etc.
  }

  /**
   * Handles virtual account transaction events
   */
  private async handleVirtualAccountEvent(
    data: VirtualAccountTransactionDataDto,
  ): Promise<void> {
    this.logger.log(
      `Virtual account transaction: ${data.id} - ${data.accountReference} - Status: ${data.settlementStatus}`,
    );

    try {
      const customerEmail = this.extractEmailFromVirtualAccountData(data);
      const shippingDetails = {
        transactionReference: data.transactionReference || undefined,
        amount: data.transactionAmount,
        narration: data.narration,
        address: data.details
          ? {
              accountName: data.details.accountName,
              accountNumber: data.details.accountNumber,
              bank: data.details.bank
                ? {
                    name: data.details.bank.name,
                    code: data.details.bank.code,
                  }
                : undefined,
            }
          : undefined,
        status: data.status,
      };

      if (customerEmail && this.isValidEmail(customerEmail)) {
        await this.mailService.sendCustomerEmail(
          customerEmail,
          shippingDetails,
        );
      }

      await this.mailService.sendStaffEmail({
        ...shippingDetails,
        customerEmail: customerEmail && this.isValidEmail(customerEmail) ? customerEmail : undefined,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        `Error sending emails for virtual account transaction ${data.id}: ${errorMessage}`,
      );
    }
  }

  /**
   * Handles virtual account transaction settled events
   */
  private async handleVirtualAccountSettled(
    data: VirtualAccountTransactionSettledDataDto,
  ): Promise<void> {
    this.logger.log(
      `Virtual account transaction settled: ${data.id} - ${data.accountReference}`,
    );

    try {
      const customerEmail = this.extractEmailFromVirtualAccountData(data);
      const shippingDetails = {
        transactionReference: data.transactionReference || undefined,
        amount: data.transactionAmount,
        narration: data.narration,
        address: data.details
          ? {
              accountName: data.details.accountName,
              accountNumber: data.details.accountNumber,
              bank: data.details.bank
                ? {
                    name: data.details.bank.name,
                    code: data.details.bank.code,
                  }
                : undefined,
            }
          : undefined,
        status: data.settlementStatus,
      };

      if (customerEmail && this.isValidEmail(customerEmail)) {
        await this.mailService.sendCustomerEmail(
          customerEmail,
          shippingDetails,
        );
      }

      await this.mailService.sendStaffEmail({
        ...shippingDetails,
        customerEmail: customerEmail && this.isValidEmail(customerEmail) ? customerEmail : undefined,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        `Error sending emails for settled transaction ${data.id}: ${errorMessage}`,
      );
    }
  }

  /**
   * Extracts email from transaction data
   */
  private extractEmailFromData(
    data: TransactionSuccessfulDataDto,
  ): string | null {
    if (data.narration) {
      const emailMatch = data.narration.match(
        /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/,
      );
      if (emailMatch) {
        return emailMatch[0];
      }
    }
    return null;
  }

  /**
   * Extracts email from virtual account transaction data
   */
  private extractEmailFromVirtualAccountData(
    data: VirtualAccountTransactionDataDto | VirtualAccountTransactionSettledDataDto,
  ): string | null {
    if (data.narration) {
      const emailMatch = data.narration.match(
        /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/,
      );
      if (emailMatch) {
        return emailMatch[0];
      }
    }
    return null;
  }

  /**
   * Validates email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

