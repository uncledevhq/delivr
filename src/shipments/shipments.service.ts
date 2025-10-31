import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MercuryService } from '../mercury/mercury.service';
import { CreateShipmentDto, ShipmentResponseDto } from './dto/create-shipment.dto';
import { Prisma } from '@prisma/client';

/**
 * Shipments service for handling shipment operations
 */
@Injectable()
export class ShipmentsService {
  private readonly logger = new Logger(ShipmentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mercuryService: MercuryService,
  ) {}

  /**
   * Creates a shipment after payment callback
   */
  async createShipment(createShipmentDto: CreateShipmentDto): Promise<ShipmentResponseDto> {
    try {
      const mercuryResponse = await this.mercuryService.bookCollection(createShipmentDto.mercuryData);
      const waybill = mercuryResponse.waybill?.[0] || null;
      const rate = mercuryResponse.rate ? Number(mercuryResponse.rate) : null;
      const shipment = await this.prisma.shipment.create({
        data: {
          orderId: createShipmentDto.orderId,
          userEmail: createShipmentDto.userEmail,
          waybill: waybill,
          rate: rate ? new Prisma.Decimal(rate) : null,
          status: 'booked',
        },
      });
      this.logger.log(`Shipment created: ${shipment.id} with waybill: ${waybill}`);
      return this.mapToResponseDto(shipment);
    } catch (error) {
      this.logger.error(`Error creating shipment: ${error.message}`);
      throw error;
    }
  }

  /**
   * Gets shipment by waybill
   */
  async getShipmentByWaybill(waybill: string): Promise<ShipmentResponseDto | null> {
    try {
      const shipment = await this.prisma.shipment.findUnique({
        where: { waybill },
      });
      if (!shipment) {
        return null;
      }
      return this.mapToResponseDto(shipment);
    } catch (error) {
      this.logger.error(`Error getting shipment by waybill: ${error.message}`);
      throw error;
    }
  }

  private mapToResponseDto(shipment: any): ShipmentResponseDto {
    return {
      id: shipment.id,
      orderId: shipment.orderId,
      userEmail: shipment.userEmail,
      waybill: shipment.waybill || undefined,
      rate: shipment.rate ? Number(shipment.rate) : undefined,
      status: shipment.status || 'pending',
      createdAt: shipment.createdAt,
      updatedAt: shipment.updatedAt,
    };
  }
}

