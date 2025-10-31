import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { ShipmentsModule } from './shipments/shipments.module';
import { TrackingModule } from './tracking/tracking.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [ShipmentsModule, TrackingModule, AdminModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
