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

class VirtualAccountBankAccountDto {
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

class VirtualAccountDto {
  @ApiProperty({ description: 'Virtual account ID' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Account reference' })
  @IsString()
  @IsNotEmpty()
  accountReference: string;

  @ApiProperty({ description: 'Bank account details', type: VirtualAccountBankAccountDto })
  @ValidateNested()
  @Type(() => VirtualAccountBankAccountDto)
  bankAccount: VirtualAccountBankAccountDto;

  @ApiProperty({ description: 'Virtual account type', enum: ['Static Virtual Account', 'Dynamic Virtual Account'] })
  @IsString()
  @IsNotEmpty()
  type: 'Static Virtual Account' | 'Dynamic Virtual Account';

  @ApiProperty({ description: 'Virtual account status', enum: ['active', 'expired', 'blacklisted'] })
  @IsString()
  @IsNotEmpty()
  status: 'active' | 'expired' | 'blacklisted';

  @ApiProperty({ description: 'Creation timestamp' })
  @IsString()
  @IsNotEmpty()
  createdAt: string;

  @ApiProperty({ description: 'Expiration timestamp', required: false })
  @IsString()
  @IsOptional()
  expiresAt: string | null;

  @ApiProperty({ description: 'Currency' })
  @IsString()
  @IsNotEmpty()
  currency: string;
}

export class VirtualAccountTransactionDataDto {
  @ApiProperty({ description: 'Transaction ID' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Transaction amount' })
  @IsString()
  @IsNotEmpty()
  transactionAmount: string;

  @ApiProperty({ description: 'Transaction fee' })
  @IsString()
  @IsNotEmpty()
  fee: string;

  @ApiProperty({ description: 'Stamp duty' })
  @IsString()
  @IsNotEmpty()
  stampDuty: string;

  @ApiProperty({ description: 'Settlement amount' })
  @IsString()
  @IsNotEmpty()
  settlementAmount: string;

  @ApiProperty({ description: 'Currency' })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({ description: 'Transaction type', enum: ['credit'] })
  @IsString()
  @IsNotEmpty()
  type: 'credit';

  @ApiProperty({ description: 'Transaction status', enum: ['successful'] })
  @IsString()
  @IsNotEmpty()
  status: 'successful';

  @ApiProperty({ description: 'Transaction narration' })
  @IsString()
  @IsNotEmpty()
  narration: string;

  @ApiProperty({ description: 'Transaction details', type: TransactionDetailsDto })
  @ValidateNested()
  @Type(() => TransactionDetailsDto)
  details: TransactionDetailsDto;

  @ApiProperty({ description: 'Virtual account details', type: VirtualAccountDto })
  @ValidateNested()
  @Type(() => VirtualAccountDto)
  virtualAccount: VirtualAccountDto;

  @ApiProperty({ description: 'Account reference' })
  @IsString()
  @IsNotEmpty()
  accountReference: string;

  @ApiProperty({ description: 'Settlement account ID' })
  @IsString()
  @IsNotEmpty()
  settlementAccountId: string;

  @ApiProperty({ description: 'Transaction datetime' })
  @IsString()
  @IsNotEmpty()
  datetime: string;

  @ApiProperty({ description: 'NIP session ID' })
  @IsString()
  @IsNotEmpty()
  nipSessionId: string;

  @ApiProperty({ description: 'Transaction reference', required: false })
  @IsString()
  @IsOptional()
  transactionReference: string | null;

  @ApiProperty({ description: 'Settlement status', enum: ['pending', 'settled'] })
  @IsString()
  @IsNotEmpty()
  settlementStatus: 'pending' | 'settled';
}

export class VirtualAccountTransactionSettledDataDto extends VirtualAccountTransactionDataDto {
  @ApiProperty({ description: 'Settlement status', enum: ['settled'] })
  @IsString()
  @IsNotEmpty()
  declare settlementStatus: 'settled';
}

