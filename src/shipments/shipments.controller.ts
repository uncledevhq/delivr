import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ShipmentsService } from './shipments.service';
import {
  CreateShipmentDto,
  ShipmentResponseDto,
} from './dto/create-shipment.dto';

/**
 * Shipments controller for handling shipment operations
 */
@ApiTags('shipments')
@Controller('shipments')
export class ShipmentsController {
  constructor(private readonly shipmentsService: ShipmentsService) {}

  @Post('callback')
  @ApiOperation({ summary: 'Create shipment after payment callback' })
  @ApiResponse({
    status: 201,
    description: 'Shipment created successfully',
    type: ShipmentResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async createShipment(
    @Body() createShipmentDto: CreateShipmentDto,
  ): Promise<ShipmentResponseDto> {
    return await this.shipmentsService.createShipment(createShipmentDto);
  }
}
