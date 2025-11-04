import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MercuryService } from '../mercury/mercury.service';
import {
  CreateShipmentDto,
  ShipmentResponseDto,
} from './dto/create-shipment.dto';
import { Prisma } from '@prisma/client';
import {
  GetFreightRequestDto,
  GetFreightResponseDto,
} from '../mercury/dto/get-freight.dto';
import {
  CreateDeliveryRequestDto,
  DeliveryRequestResponseDto,
} from './dto/create-delivery-request.dto';
import { MailService } from '../mail/mail.service';

/**
 * Shipments service for handling shipment operations
 */
@Injectable()
export class ShipmentsService {
  private readonly logger = new Logger(ShipmentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mercuryService: MercuryService,
    private readonly mailService: MailService,
  ) {}

  /**
   * Creates a shipment after payment callback
   */
  async createShipment(
    createShipmentDto: CreateShipmentDto,
  ): Promise<ShipmentResponseDto> {
    try {
      const mercuryResponse = await this.mercuryService.bookCollection(
        createShipmentDto.mercuryData,
      );
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
      this.logger.log(
        `Shipment created: ${shipment.id} with waybill: ${waybill}`,
      );
      return this.mapToResponseDto(shipment);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error creating shipment: ${errorMessage}`);
      throw error;
    }
  }

  /**
   * Gets shipment by waybill
   */
  async getShipmentByWaybill(
    waybill: string,
  ): Promise<ShipmentResponseDto | null> {
    try {
      const shipment = await this.prisma.shipment.findUnique({
        where: { waybill },
      });
      if (!shipment) {
        return null;
      }
      return this.mapToResponseDto(shipment);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error getting shipment by waybill: ${errorMessage}`);
      throw error;
    }
  }

  /**
   * Gets shipping quotation/rate without booking a shipment
   */
  async getQuotation(
    quotationRequest: GetFreightRequestDto,
  ): Promise<GetFreightResponseDto> {
    try {
      const quotation: GetFreightResponseDto =
        await this.mercuryService.getFreightQuotation(quotationRequest);
      const rate = quotation.rate ?? 0;
      this.logger.log(
        `Quotation retrieved: Rate ${rate} for service ${quotationRequest.domestic_service}/${quotationRequest.international_service}`,
      );
      return quotation;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error getting quotation: ${errorMessage}`);
      throw error;
    }
  }

  /**
   * Creates a delivery request and sends emails
   */
  async createDeliveryRequest(
    createDeliveryRequestDto: CreateDeliveryRequestDto,
  ): Promise<DeliveryRequestResponseDto> {
    try {
      this.logger.log(
        `Creating delivery request for order ${createDeliveryRequestDto.orderId}`,
      );

      let waybill: string | null = null;
      let rate: number | null = null;

      if (createDeliveryRequestDto.mercuryData) {
        this.logger.log('Booking collection with Mercury API');
        const mercuryResponse = await this.mercuryService.bookCollection(
          createDeliveryRequestDto.mercuryData,
        );
        waybill = mercuryResponse.waybill?.[0] || null;
        rate = mercuryResponse.rate ? Number(mercuryResponse.rate) : null;
        this.logger.log(
          `Mercury booking successful - Waybill: ${waybill}, Rate: ${rate}`,
        );
      } else {
        this.logger.log('No Mercury data provided - skipping booking');
      }

      const shipment = await this.prisma.shipment.create({
        data: {
          orderId: createDeliveryRequestDto.orderId,
          userEmail: createDeliveryRequestDto.customerEmail,
          waybill: waybill,
          rate: rate ? new Prisma.Decimal(rate) : null,
          status: waybill ? 'booked' : 'pending',
        },
      });

      this.logger.log(
        `Shipment created: ${shipment.id} with waybill: ${waybill}`,
      );

      const shippingAddressString = this.formatShippingAddress(
        createDeliveryRequestDto.shippingAddress,
      );

      const shippingDetails = {
        transactionReference:
          createDeliveryRequestDto.transactionReference || undefined,
        amount: createDeliveryRequestDto.amount || undefined,
        narration: `Order ${createDeliveryRequestDto.orderId}`,
        shippingAddress: shippingAddressString,
        waybill: waybill || undefined,
        status: waybill ? 'booked' : 'pending',
      };

      let emailsSent = false;

      try {
        this.logger.log(
          `Sending customer email to: ${createDeliveryRequestDto.customerEmail}`,
        );
        await this.mailService.sendCustomerEmail(
          createDeliveryRequestDto.customerEmail,
          shippingDetails,
        );

        this.logger.log('Sending staff email');
        await this.mailService.sendStaffEmail({
          ...shippingDetails,
          customerEmail: createDeliveryRequestDto.customerEmail,
        });

        emailsSent = true;
        this.logger.log('Emails sent successfully');
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        this.logger.error(`Error sending emails: ${errorMessage}`);
        this.logger.warn('Shipment created but emails failed to send');
      }

      return {
        id: shipment.id,
        orderId: shipment.orderId,
        customerEmail: shipment.userEmail,
        waybill: shipment.waybill || undefined,
        rate: shipment.rate ? Number(shipment.rate) : undefined,
        status: shipment.status || 'pending',
        createdAt: shipment.createdAt,
        updatedAt: shipment.updatedAt,
        emailsSent,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error creating delivery request: ${errorMessage}`);
      throw error;
    }
  }

  /**
   * Formats shipping address into a readable string
   */
  private formatShippingAddress(address: {
    address: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  }): string {
    const parts: string[] = [address.address];

    if (address.city) {
      parts.push(address.city);
    }

    if (address.state) {
      parts.push(address.state);
    }

    if (address.postalCode) {
      parts.push(address.postalCode);
    }

    if (address.country) {
      parts.push(address.country);
    }

    return parts.join(', ');
  }

  private mapToResponseDto(
    shipment: Prisma.ShipmentGetPayload<Record<string, never>>,
  ): ShipmentResponseDto {
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
