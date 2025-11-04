import {
  Controller,
  Post,
  Req,
  Res,
  Headers,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { WebhooksService } from './webhooks.service';
import { LencoWebhookDto } from './dto/lenco-webhook.dto';

/**
 * Webhooks controller for handling Lenco webhook callbacks
 */
@ApiTags('webhooks')
@Controller('webhooks')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('lenco')
  @ApiOperation({ summary: 'Handle Lenco webhook events' })
  @ApiResponse({
    status: 200,
    description: 'Webhook processed successfully',
  })
  @ApiResponse({
    status: 201,
    description: 'Webhook processed successfully',
  })
  @ApiResponse({
    status: 202,
    description: 'Webhook processed successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid signature',
  })
  async handleWebhook(
    @Req() req: Request,
    @Res({ passthrough: false }) res: Response,
    @Headers('x-lenco-signature') signature: string,
  ): Promise<void> {
    this.logger.log('=== Lenco Webhook Received ===');
    this.logger.log(`Signature: ${signature || 'Missing'}`);
    this.logger.log(`Raw Body: ${JSON.stringify(req.body, null, 2)}`);

    if (!signature) {
      this.logger.warn('Missing signature header');
      res.status(HttpStatus.UNAUTHORIZED).send('Missing signature');
      return;
    }

    const body = req.body as LencoWebhookDto;

    if (!body || !body.event || !body.data) {
      this.logger.warn('Invalid webhook payload structure');
      this.logger.warn(`Body received: ${JSON.stringify(body, null, 2)}`);
      res.status(HttpStatus.BAD_REQUEST).send('Invalid webhook payload');
      return;
    }

    this.logger.log(`Event Type: ${body.event}`);
    this.logger.log(`Event Data: ${JSON.stringify(body.data, null, 2)}`);

    const isValid = this.webhooksService.verifySignature(req.body, signature);

    if (!isValid) {
      this.logger.warn('Invalid signature verification');
      res.status(HttpStatus.UNAUTHORIZED).send('Invalid signature');
      return;
    }

    this.logger.log('Signature verified successfully');

    try {
      await this.webhooksService.handleEvent(body.event, body.data);
      this.logger.log('Webhook processed successfully');
      res.status(HttpStatus.ACCEPTED).send('OK');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error processing webhook: ${errorMessage}`);
      res.status(HttpStatus.ACCEPTED).send('OK');
    }

    this.logger.log('=== End Lenco Webhook ===');
  }
}
