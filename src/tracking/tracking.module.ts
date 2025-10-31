import { Module } from '@nestjs/common';
import { TrackingController } from './tracking.controller';
import { MercuryModule } from '../mercury/mercury.module';
import { ShipmentsModule } from '../shipments/shipments.module';

@Module({
  imports: [MercuryModule, ShipmentsModule],
  controllers: [TrackingController],
})
export class TrackingModule {}

