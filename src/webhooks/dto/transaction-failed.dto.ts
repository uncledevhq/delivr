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

export class TransactionFailedDataDto {
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

  @ApiProperty({ description: 'Transaction type', enum: ['debit'] })
  @IsString()
  @IsNotEmpty()
  type: 'debit';

  @ApiProperty({ description: 'Initiation timestamp', required: false })
  @IsString()
  @IsOptional()
  initiatedAt: string | null;

  @ApiProperty({ description: 'Completion timestamp', required: false })
  @IsString()
  @IsOptional()
  completedAt: null;

  @ApiProperty({ description: 'Account ID' })
  @IsString()
  @IsNotEmpty()
  accountId: string;

  @ApiProperty({ description: 'Transaction details', type: TransactionDetailsDto, required: false })
  @ValidateNested()
  @Type(() => TransactionDetailsDto)
  @IsOptional()
  details: TransactionDetailsDto | null;

  @ApiProperty({ description: 'Transaction status', enum: ['failed'] })
  @IsString()
  @IsNotEmpty()
  status: 'failed';

  @ApiProperty({ description: 'Failure timestamp' })
  @IsString()
  @IsNotEmpty()
  failedAt: string;

  @ApiProperty({ description: 'Reason for failure' })
  @IsString()
  @IsNotEmpty()
  reasonForFailure: string;

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

