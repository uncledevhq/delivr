import { Controller, Get, Param, HttpStatus, HttpException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { MercuryService } from '../mercury/mercury.service';
import { TrackShipmentResponseDto } from '../mercury/dto/track-shipment.dto';
import { ShipmentsService } from '../shipments/shipments.service';

/**
 * Tracking controller for handling shipment tracking operations
 */
@ApiTags('shipments')
@Controller('tracking')
export class TrackingController {
  constructor(
    private readonly mercuryService: MercuryService,
    private readonly shipmentsService: ShipmentsService,
  ) {}

  @Get(':waybill')
  @ApiOperation({ summary: 'Check full shipment tracking details' })
  @ApiParam({ name: 'waybill', description: 'Waybill number', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tracking details retrieved successfully',
    type: TrackShipmentResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Shipment not found' })
  async getTrackingDetails(@Param('waybill') waybill: string): Promise<TrackShipmentResponseDto> {
    const shipment = await this.shipmentsService.getShipmentByWaybill(waybill);
    if (!shipment) {
      throw new HttpException('Shipment not found', HttpStatus.NOT_FOUND);
    }
    return await this.mercuryService.getShipmentTrackingDetails(waybill);
  }

  @Get('status/:waybill')
  @ApiOperation({ summary: 'Get latest shipment status' })
  @ApiParam({ name: 'waybill', description: 'Waybill number', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Shipment status retrieved successfully',
    type: TrackShipmentResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Shipment not found' })
  async getTrackingStatus(@Param('waybill') waybill: string): Promise<TrackShipmentResponseDto> {
    const shipment = await this.shipmentsService.getShipmentByWaybill(waybill);
    if (!shipment) {
      throw new HttpException('Shipment not found', HttpStatus.NOT_FOUND);
    }
    return await this.mercuryService.getShipmentStatus(waybill);
  }
}

