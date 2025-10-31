import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { BookCollectionRequestDto, BookCollectionResponseDto } from './dto/book-collection.dto';
import { TrackShipmentResponseDto } from './dto/track-shipment.dto';

/**
 * Mercury API service for handling shipping operations
 */
@Injectable()
export class MercuryService {
  private readonly logger = new Logger(MercuryService.name);
  private readonly axiosInstance: AxiosInstance;
  private readonly mercuryApiUrl: string;
  private readonly mercuryEmail: string;
  private readonly mercuryPrivateKey: string;
  private readonly SUCCESS_CODE = 508;

  constructor() {
    this.mercuryApiUrl = process.env.MERCURY_API_URL || 'http://116.202.29.37/quotation1/app';
    this.mercuryEmail = process.env.MERCURY_EMAIL || '';
    this.mercuryPrivateKey = process.env.MERCURY_PRIVATE_KEY || '';
    this.axiosInstance = axios.create({
      baseURL: this.mercuryApiUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        this.logger.log(`Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        this.logger.error(`Request error: ${error.message}`);
        return Promise.reject(error);
      },
    );
    this.axiosInstance.interceptors.response.use(
      (response) => {
        this.logger.log(`Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        this.logger.error(`Response error: ${error.message}`);
        return Promise.reject(error);
      },
    );
  }

  /**
   * Books a collection/shipment via Mercury API
   */
  async bookCollection(request: BookCollectionRequestDto): Promise<BookCollectionResponseDto> {
    try {
      const payload = {
        email: request.email || this.mercuryEmail,
        private_key: request.private_key || this.mercuryPrivateKey,
        domestic_service: request.domestic_service,
        international_service: request.international_service,
        insurance: request.insurance,
        shipment: request.shipment,
      };
      const response = await this.axiosInstance.post<BookCollectionResponseDto>(
        '/bookcollection',
        payload,
      );
      if (response.data.error_code !== this.SUCCESS_CODE) {
        throw new HttpException(
          response.data.error_msg || 'Failed to book collection',
          HttpStatus.BAD_REQUEST,
        );
      }
      return response.data;
    } catch (error) {
      this.logger.error(`Error booking collection: ${error.message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to book collection via Mercury API',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Gets full shipment tracking details
   */
  async getShipmentTrackingDetails(waybill: string): Promise<TrackShipmentResponseDto> {
    try {
      const response = await this.axiosInstance.get<TrackShipmentResponseDto>(
        `/getshipmenttrackingdetails/wbid/${waybill}`,
        {
          params: {
            email: this.mercuryEmail,
            private_key: this.mercuryPrivateKey,
          },
        },
      );
      if (response.data.error_code !== this.SUCCESS_CODE) {
        throw new HttpException(
          response.data.error_msg || 'Failed to get tracking details',
          HttpStatus.BAD_REQUEST,
        );
      }
      return response.data;
    } catch (error) {
      this.logger.error(`Error getting tracking details: ${error.message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to get tracking details from Mercury API',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Gets latest shipment status
   */
  async getShipmentStatus(waybill: string): Promise<TrackShipmentResponseDto> {
    try {
      const response = await this.axiosInstance.get<TrackShipmentResponseDto>(
        `/getshipmenttracking/wbid/${waybill}`,
        {
          params: {
            email: this.mercuryEmail,
            private_key: this.mercuryPrivateKey,
          },
        },
      );
      if (response.data.error_code !== this.SUCCESS_CODE) {
        throw new HttpException(
          response.data.error_msg || 'Failed to get shipment status',
          HttpStatus.BAD_REQUEST,
        );
      }
      return response.data;
    } catch (error) {
      this.logger.error(`Error getting shipment status: ${error.message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to get shipment status from Mercury API',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

