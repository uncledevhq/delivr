import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { BookCollectionRequestDto } from '../../mercury/dto/book-collection.dto';

export class ShippingAddressDto {
  @ApiProperty({ description: 'Full shipping address' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ description: 'City', required: false })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ description: 'State/Province', required: false })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiProperty({ description: 'Country', required: false })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({ description: 'Postal/ZIP code', required: false })
  @IsString()
  @IsOptional()
  postalCode?: string;
}

export class CreateDeliveryRequestDto {
  @ApiProperty({ description: 'Order ID from the storefront' })
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @ApiProperty({ description: 'Customer email address' })
  @IsEmail()
  @IsNotEmpty()
  customerEmail: string;

  @ApiProperty({ description: 'Customer name', required: false })
  @IsString()
  @IsOptional()
  customerName?: string;

  @ApiProperty({ description: 'Transaction reference', required: false })
  @IsString()
  @IsOptional()
  transactionReference?: string;

  @ApiProperty({ description: 'Payment amount', required: false })
  @IsString()
  @IsOptional()
  amount?: string;

  @ApiProperty({
    description: 'Shipping address',
    type: ShippingAddressDto,
  })
  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shippingAddress: ShippingAddressDto;

  @ApiProperty({
    description: 'Mercury book collection request data',
    type: BookCollectionRequestDto,
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => BookCollectionRequestDto)
  mercuryData?: BookCollectionRequestDto;
}

export class DeliveryRequestResponseDto {
  @ApiProperty({ description: 'Shipment ID' })
  id: string;

  @ApiProperty({ description: 'Order ID' })
  orderId: string;

  @ApiProperty({ description: 'Customer email' })
  customerEmail: string;

  @ApiProperty({ description: 'Waybill number', required: false })
  waybill?: string;

  @ApiProperty({ description: 'Shipping rate', required: false })
  rate?: number;

  @ApiProperty({ description: 'Shipment status' })
  status: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;

  @ApiProperty({ description: 'Email sent status' })
  emailsSent: boolean;
}

