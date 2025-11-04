import { IsString, IsNotEmpty, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { TransactionSuccessfulDataDto } from './transaction-successful.dto';
import { TransactionFailedDataDto } from './transaction-failed.dto';
import { AccountBalanceUpdatedDataDto } from './account-balance-updated.dto';
import {
  VirtualAccountTransactionDataDto,
  VirtualAccountTransactionSettledDataDto,
} from './virtual-account-transaction.dto';

export class LencoWebhookDto {
  @ApiProperty({ description: 'Event type', enum: ['transaction.successful', 'transaction.failed', 'account.balance-updated', 'virtual-account.transaction', 'virtual-account.transaction.settled'] })
  @IsString()
  @IsNotEmpty()
  event:
    | 'transaction.successful'
    | 'transaction.failed'
    | 'account.balance-updated'
    | 'virtual-account.transaction'
    | 'virtual-account.transaction.settled';

  @ApiProperty({ description: 'Event data payload' })
  @IsObject()
  @IsNotEmpty()
  data:
    | TransactionSuccessfulDataDto
    | TransactionFailedDataDto
    | AccountBalanceUpdatedDataDto
    | VirtualAccountTransactionDataDto
    | VirtualAccountTransactionSettledDataDto;
}

