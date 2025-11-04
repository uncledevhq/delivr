import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Prisma service for database operations
 * Handles connection lifecycle and provides Prisma Client instance
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit(): Promise<void> {
    await this.$connect();
  }
  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
