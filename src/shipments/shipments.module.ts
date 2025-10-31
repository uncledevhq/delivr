import { Module } from '@nestjs/common';
import { ShipmentsController } from './shipments.controller';
import { ShipmentsService } from './shipments.service';
import { PrismaService } from '../prisma/prisma.service';
import { MercuryModule } from '../mercury/mercury.module';

@Module({
  imports: [MercuryModule],
  controllers: [ShipmentsController],
  providers: [ShipmentsService, PrismaService],
  exports: [ShipmentsService],
})
export class ShipmentsModule {}

