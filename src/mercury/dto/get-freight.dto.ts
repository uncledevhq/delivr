import { IsString, IsNumber, IsArray, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class FreightShipmentDto {
  @ApiProperty({ description: 'Vendor ID' })
  @IsString()
  @IsNotEmpty()
  vendor_id: string;

  @ApiProperty({ description: 'Source country ID' })
  @IsString()
  @IsNotEmpty()
  source_country: string;

  @ApiProperty({ description: 'Source city ID' })
  @IsString()
  @IsNotEmpty()
  source_city: string;

  @ApiProperty({ description: 'Destination country ID' })
  @IsString()
  @IsNotEmpty()
  destination_country: string;

  @ApiProperty({ description: 'Destination city ID' })
  @IsString()
  @IsNotEmpty()
  destination_city: string;

  @ApiProperty({ description: 'Insurance flag: 0=No, 1=Yes' })
  @IsNumber()
  insurance: number;

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

export class GetFreightRequestDto {
  @ApiProperty({ description: 'Mercury account email', required: false })
  @IsString()
  email?: string;

  @ApiProperty({ description: 'Mercury private key', required: false })
  @IsString()
  private_key?: string;

  @ApiProperty({ description: 'Domestic service ID' })
  @IsNumber()
  @IsNotEmpty()
  domestic_service: number;

  @ApiProperty({ description: 'International service ID' })
  @IsNumber()
  @IsNotEmpty()
  international_service: number;

  @ApiProperty({ type: [FreightShipmentDto], description: 'Shipment array for quotation' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FreightShipmentDto)
  shipment: FreightShipmentDto[];
}

export class GetFreightResponseDto {
  @ApiProperty({ description: 'Error message' })
  error_msg: string;

  @ApiProperty({ description: 'Error code (508 = Success)' })
  error_code: number;

  @ApiProperty({ description: 'Freight rate/charge', required: false })
  rate?: number;
}

