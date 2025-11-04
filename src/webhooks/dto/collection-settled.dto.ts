import {
  IsString,
  IsNotEmpty,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class SettlementDto {
  @ApiProperty({ description: 'Settlement ID' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Amount settled' })
  @IsString()
  @IsNotEmpty()
  amountSettled: string;

  @ApiProperty({ description: 'Currency' })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({ description: 'Settlement creation timestamp' })
  @IsString()
  @IsNotEmpty()
  createdAt: string;

  @ApiProperty({ description: 'Settlement timestamp' })
  @IsString()
  @IsNotEmpty()
  settledAt: string;

  @ApiProperty({ description: 'Settlement status' })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({ description: 'Settlement type' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ description: 'Account ID' })
  @IsString()
  @IsNotEmpty()
  accountId: string;
}

class MobileMoneyDetailsDto {
  @ApiProperty({ description: 'Country code' })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({ description: 'Phone number' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ description: 'Mobile money operator' })
  @IsString()
  @IsNotEmpty()
  operator: string;

  @ApiProperty({ description: 'Account name' })
  @IsString()
  @IsNotEmpty()
  accountName: string;

  @ApiProperty({ description: 'Operator transaction ID' })
  @IsString()
  @IsNotEmpty()
  operatorTransactionId: string;
}

export class CollectionSettledDataDto {
  @ApiProperty({ description: 'Collection ID' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Initiation timestamp', required: false })
  @IsString()
  @IsOptional()
  initiatedAt: string | null;

  @ApiProperty({ description: 'Completion timestamp', required: false })
  @IsString()
  @IsOptional()
  completedAt: string | null;

  @ApiProperty({ description: 'Collection amount' })
  @IsString()
  @IsNotEmpty()
  amount: string;

  @ApiProperty({ description: 'Fee' })
  @IsString()
  @IsNotEmpty()
  fee: string;

  @ApiProperty({ description: 'Fee bearer' })
  @IsString()
  @IsNotEmpty()
  bearer: string;

  @ApiProperty({ description: 'Currency' })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({ description: 'Reference' })
  @IsString()
  @IsNotEmpty()
  reference: string;

  @ApiProperty({ description: 'Lenco reference' })
  @IsString()
  @IsNotEmpty()
  lencoReference: string;

  @ApiProperty({ description: 'Collection type' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ description: 'Status' })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({ description: 'Source' })
  @IsString()
  @IsNotEmpty()
  source: string;

  @ApiProperty({ description: 'Reason for failure', required: false })
  @IsString()
  @IsOptional()
  reasonForFailure: string | null;

  @ApiProperty({ description: 'Settlement status' })
  @IsString()
  @IsNotEmpty()
  settlementStatus: string;

  @ApiProperty({ description: 'Settlement details', type: SettlementDto })
  @ValidateNested()
  @Type(() => SettlementDto)
  settlement: SettlementDto;

  @ApiProperty({
    description: 'Mobile money details',
    type: MobileMoneyDetailsDto,
    required: false,
  })
  @ValidateNested()
  @Type(() => MobileMoneyDetailsDto)
  @IsOptional()
  mobileMoneyDetails: MobileMoneyDetailsDto | null;

  @ApiProperty({ description: 'Bank account details', required: false })
  @IsOptional()
  bankAccountDetails: unknown;

  @ApiProperty({ description: 'Card details', required: false })
  @IsOptional()
  cardDetails: unknown;
}
