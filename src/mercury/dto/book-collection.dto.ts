import { IsString, IsNumber, IsArray, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PickupAddressDto {
  @ApiProperty({ description: 'Sender first name' })
  @IsString()
  @IsNotEmpty()
  s_first_name: string;

  @ApiProperty({ description: 'Sender last name' })
  @IsString()
  @IsNotEmpty()
  s_last_name: string;

  @ApiProperty({ description: 'Sender country ID' })
  @IsString()
  @IsNotEmpty()
  s_country: string;

  @ApiProperty({ description: 'Sender state ID' })
  @IsString()
  @IsNotEmpty()
  s_statelist: string;

  @ApiProperty({ description: 'Sender city ID' })
  @IsString()
  @IsNotEmpty()
  s_city: string;

  @ApiProperty({ description: 'Sender address line 1' })
  @IsString()
  @IsNotEmpty()
  s_add_1: string;

  @ApiProperty({ description: 'Sender address line 2' })
  @IsString()
  s_add_2: string;

  @ApiProperty({ description: 'Sender mobile number' })
  @IsString()
  @IsNotEmpty()
  s_mobile_no: string;

  @ApiProperty({ description: 'Sender email' })
  @IsString()
  @IsNotEmpty()
  s_email: string;
}

export class DeliveryAddressDto {
  @ApiProperty({ description: 'Receiver first name' })
  @IsString()
  @IsNotEmpty()
  r_first_name: string;

  @ApiProperty({ description: 'Receiver last name' })
  @IsString()
  @IsNotEmpty()
  r_last_name: string;

  @ApiProperty({ description: 'Receiver country ID' })
  @IsString()
  @IsNotEmpty()
  r_country: string;

  @ApiProperty({ description: 'Receiver state ID' })
  @IsString()
  @IsNotEmpty()
  r_statelist: string;

  @ApiProperty({ description: 'Receiver city ID' })
  @IsString()
  @IsNotEmpty()
  r_city: string;

  @ApiProperty({ description: 'Receiver address line 1' })
  @IsString()
  @IsNotEmpty()
  r_add_1: string;

  @ApiProperty({ description: 'Receiver address line 2' })
  @IsString()
  r_add_2: string;

  @ApiProperty({ description: 'Receiver mobile number' })
  @IsString()
  @IsNotEmpty()
  r_mobile_no: string;

  @ApiProperty({ description: 'Receiver email' })
  @IsString()
  @IsNotEmpty()
  r_email: string;
}

export class ItemDetailsDto {
  @ApiProperty({ description: 'Number of pieces' })
  @IsNumber()
  pieces: number;

  @ApiProperty({ description: 'Package length in cm' })
  @IsNumber()
  length: number;

  @ApiProperty({ description: 'Package width in cm' })
  @IsNumber()
  width: number;

  @ApiProperty({ description: 'Package height in cm' })
  @IsNumber()
  height: number;

  @ApiProperty({ description: 'Gross weight in kg' })
  @IsNumber()
  gross_weight: number;

  @ApiProperty({ description: 'Declared value' })
  @IsNumber()
  declared_value: number;
}

export class ShipmentDetailsDto {
  @ApiProperty({ description: 'Payment type: 2=Cash, 3=On Account, 4=COD' })
  @IsNumber()
  paymenttype: number;
}

export class ShipmentDto {
  @ApiProperty({ type: [PickupAddressDto], description: 'Pickup address details' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PickupAddressDto)
  shipment_pickup_address: PickupAddressDto[];

  @ApiProperty({ type: [DeliveryAddressDto], description: 'Delivery address details' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DeliveryAddressDto)
  shipment_delivery_address: DeliveryAddressDto[];

  @ApiProperty({ type: [ShipmentDetailsDto], description: 'Shipment payment details' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ShipmentDetailsDto)
  shipment_details: ShipmentDetailsDto[];

  @ApiProperty({ type: [ItemDetailsDto], description: 'Item details' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemDetailsDto)
  item_details: ItemDetailsDto[];
}

export class BookCollectionRequestDto {
  @ApiProperty({ description: 'Mercury account email' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Mercury private key' })
  @IsString()
  @IsNotEmpty()
  private_key: string;

  @ApiProperty({ description: 'Domestic service ID' })
  @IsNumber()
  domestic_service: number;

  @ApiProperty({ description: 'International service ID' })
  @IsNumber()
  international_service: number;

  @ApiProperty({ description: 'Insurance flag: 0=No, 1=Yes' })
  @IsNumber()
  insurance: number;

  @ApiProperty({ type: [ShipmentDto], description: 'Shipment array' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ShipmentDto)
  shipment: ShipmentDto[];
}

export class BookCollectionResponseDto {
  error_msg: string;
  error_code: number;
  rate?: number;
  waybill?: string[];
}

