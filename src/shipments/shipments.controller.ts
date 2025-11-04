import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ShipmentsService } from './shipments.service';
import {
  CreateShipmentDto,
  ShipmentResponseDto,
} from './dto/create-shipment.dto';
import {
  GetFreightRequestDto,
  GetFreightResponseDto,
} from '../mercury/dto/get-freight.dto';
import {
  CreateDeliveryRequestDto,
  DeliveryRequestResponseDto,
} from './dto/create-delivery-request.dto';

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

  @Get('quotation')
  @ApiOperation({ summary: 'Get shipping quotation/rate without booking' })
  @ApiResponse({
    status: 200,
    description: 'Quotation retrieved successfully',
    type: GetFreightResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async getQuotation(
    @Query() quotationRequest: GetFreightRequestDto,
  ): Promise<GetFreightResponseDto> {
    return await this.shipmentsService.getQuotation(quotationRequest);
  }

  @Post('delivery-request')
  @ApiOperation({ summary: 'Create delivery request and send emails' })
  @ApiResponse({
    status: 201,
    description: 'Delivery request created successfully and emails sent',
    type: DeliveryRequestResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async createDeliveryRequest(
    @Body() createDeliveryRequestDto: CreateDeliveryRequestDto,
  ): Promise<DeliveryRequestResponseDto> {
    return await this.shipmentsService.createDeliveryRequest(
      createDeliveryRequestDto,
    );
  }
}
