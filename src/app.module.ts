import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { ShipmentsModule } from './shipments/shipments.module';
import { TrackingModule } from './tracking/tracking.module';
import { AdminModule } from './admin/admin.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ShipmentsModule,
    TrackingModule,
    AdminModule,
    WebhooksModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
