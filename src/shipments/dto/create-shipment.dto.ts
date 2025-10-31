import { IsString, IsEmail, IsNotEmpty, IsOptional, IsNumber, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { BookCollectionRequestDto } from '../../mercury/dto/book-collection.dto';

export class CreateShipmentDto {
  @ApiProperty({ description: 'Order ID from the storefront' })
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @ApiProperty({ description: 'Customer email address' })
  @IsEmail()
  @IsNotEmpty()
  userEmail: string;

  @ApiProperty({ description: 'Mercury book collection request data', type: BookCollectionRequestDto })
  @IsObject()
  @ValidateNested()
  @Type(() => BookCollectionRequestDto)
  mercuryData: BookCollectionRequestDto;
}

export class ShipmentResponseDto {
  @ApiProperty({ description: 'Shipment ID' })
  id: string;

  @ApiProperty({ description: 'Order ID' })
  orderId: string;

  @ApiProperty({ description: 'User email' })
  userEmail: string;

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
}

