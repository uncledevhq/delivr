import { ApiProperty } from '@nestjs/swagger';

export class TrackingDetailDto {
  @ApiProperty({ description: 'Status timestamp' })
  status_timestamp: string;

  @ApiProperty({ description: 'Location' })
  location: string;

  @ApiProperty({ description: 'Status comment' })
  status_comment: string;
}

export class TrackingOtherDetailDto {
  @ApiProperty({ description: 'Receiver name', required: false })
  receiver_name?: string;

  @ApiProperty({ description: 'Proof of delivery URL', required: false })
  pod?: string;
}

export class TrackShipmentResponseDto {
  @ApiProperty({ description: 'Error message' })
  error_msg: string;

  @ApiProperty({ description: 'Error code' })
  error_code: number;

  @ApiProperty({ type: [TrackingDetailDto], description: 'Tracking details array' })
  detail: TrackingDetailDto[];

  @ApiProperty({ type: TrackingOtherDetailDto, description: 'Other details', required: false })
  other_detail?: TrackingOtherDetailDto;
}

