import { IsString, IsNotEmpty, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class BankDetailsDto {
  @ApiProperty({ description: 'Bank code' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ description: 'Bank name' })
  @IsString()
  @IsNotEmpty()
  name: string;
}

class TransactionDetailsDto {
  @ApiProperty({ description: 'Account name' })
  @IsString()
  @IsNotEmpty()
  accountName: string;

  @ApiProperty({ description: 'Account number' })
  @IsString()
  @IsNotEmpty()
  accountNumber: string;

  @ApiProperty({ description: 'Bank details', type: BankDetailsDto })
  @ValidateNested()
  @Type(() => BankDetailsDto)
  bank: BankDetailsDto;
}

export class TransactionSuccessfulDataDto {
  @ApiProperty({ description: 'Transaction ID' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Transaction amount' })
  @IsString()
  @IsNotEmpty()
  amount: string;

  @ApiProperty({ description: 'Transaction fee' })
  @IsString()
  @IsNotEmpty()
  fee: string;

  @ApiProperty({ description: 'Transaction narration' })
  @IsString()
  @IsNotEmpty()
  narration: string;

  @ApiProperty({ description: 'Transaction type', enum: ['credit', 'debit'] })
  @IsString()
  @IsNotEmpty()
  type: 'credit' | 'debit';

  @ApiProperty({ description: 'Initiation timestamp', required: false })
  @IsString()
  @IsOptional()
  initiatedAt: string | null;

  @ApiProperty({ description: 'Completion timestamp' })
  @IsString()
  @IsNotEmpty()
  completedAt: string;

  @ApiProperty({ description: 'Account ID' })
  @IsString()
  @IsNotEmpty()
  accountId: string;

  @ApiProperty({ description: 'Transaction details', type: TransactionDetailsDto, required: false })
  @ValidateNested()
  @Type(() => TransactionDetailsDto)
  @IsOptional()
  details: TransactionDetailsDto | null;

  @ApiProperty({ description: 'Transaction status', enum: ['successful'] })
  @IsString()
  @IsNotEmpty()
  status: 'successful';

  @ApiProperty({ description: 'Failure timestamp', required: false })
  @IsString()
  @IsOptional()
  failedAt: null;

  @ApiProperty({ description: 'Reason for failure', required: false })
  @IsString()
  @IsOptional()
  reasonForFailure: null;

  @ApiProperty({ description: 'Client reference', required: false })
  @IsString()
  @IsOptional()
  clientReference: string | null;

  @ApiProperty({ description: 'Transaction reference' })
  @IsString()
  @IsNotEmpty()
  transactionReference: string;

  @ApiProperty({ description: 'NIP session ID', required: false })
  @IsString()
  @IsOptional()
  nipSessionId: string | null;
}

