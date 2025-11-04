import { IsString, IsNotEmpty, ValidateNested } from 'class-validator';
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

class BankAccountDto {
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

export class AccountBalanceUpdatedDataDto {
  @ApiProperty({ description: 'Account ID' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Account name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Bank account details', type: BankAccountDto })
  @ValidateNested()
  @Type(() => BankAccountDto)
  bankAccount: BankAccountDto;

  @ApiProperty({ description: 'Account type' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ description: 'Account status', enum: ['active', 'deleted'] })
  @IsString()
  @IsNotEmpty()
  status: 'active' | 'deleted';

  @ApiProperty({ description: 'Available balance' })
  @IsString()
  @IsNotEmpty()
  availableBalance: string;

  @ApiProperty({ description: 'Current balance' })
  @IsString()
  @IsNotEmpty()
  currentBalance: string;

  @ApiProperty({ description: 'Currency' })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({ description: 'Creation timestamp' })
  @IsString()
  @IsNotEmpty()
  createdAt: string;
}

