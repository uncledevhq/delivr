import {
  Controller,
  Post,
  Req,
  Res,
  Headers,
  HttpStatus,
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
    if (!signature) {
      res.status(HttpStatus.UNAUTHORIZED).send('Missing signature');
      return;
    }

    const body = req.body as LencoWebhookDto;

    if (!body || !body.event || !body.data) {
      res.status(HttpStatus.BAD_REQUEST).send('Invalid webhook payload');
      return;
    }

    const isValid = this.webhooksService.verifySignature(req.body, signature);

    if (!isValid) {
      res.status(HttpStatus.UNAUTHORIZED).send('Invalid signature');
      return;
    }

    try {
      await this.webhooksService.handleEvent(body.event, body.data);
      res.status(HttpStatus.ACCEPTED).send('OK');
    } catch {
      res.status(HttpStatus.ACCEPTED).send('OK');
    }
  }
}
