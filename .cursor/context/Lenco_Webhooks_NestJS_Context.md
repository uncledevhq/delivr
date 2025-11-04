# 🧠 Context for Cursor: Lenco Webhooks Integration (NestJS)

## 📘 Overview

This NestJS app integrates with **Lenco’s Webhook System** to receive and process real-time notifications about transactions, balance updates, virtual account activities, and settlement events.

Lenco sends POST requests to the app’s public webhook endpoint (e.g. `/webhooks/lenco`) whenever an event occurs.  
Each event includes:

- an `event` string (e.g., `"transaction.successful"`)
- a structured `data` payload specific to that event type.

The system must **verify** each event via a HMAC signature and respond with **HTTP 200–202** to acknowledge receipt.

---

## ⚙️ Requirements

- Public POST endpoint `/webhooks/lenco`
- No authentication (Lenco verifies using `X-Lenco-Signature`)
- Verify authenticity:
  - Compute SHA256(API_TOKEN) → `webhook_hash_key`
  - Validate HMAC SHA512 signature with `webhook_hash_key`
- Respond with status 200/201/202 only
- Use DTOs to type event payloads
- Use switch-case or mapping pattern in the service to handle different events
- Store or process data asynchronously if tasks take long

---

## 🧩 Event Schemas (Type Definitions)

### 🪙 `transaction.successful`

```ts
{
  event: "transaction.successful",
  data: {
    id: string;
    amount: string;
    fee: string;
    narration: string;
    type: "credit" | "debit";
    initiatedAt: string | null;
    completedAt: string;
    accountId: string;
    details: {
      accountName: string;
      accountNumber: string;
      bank: { code: string; name: string };
    } | null;
    status: "successful";
    failedAt: null;
    reasonForFailure: null;
    clientReference: string | null;
    transactionReference: string;
    nipSessionId: string | null;
  };
}
```

### ❌ `transaction.failed`

```ts
{
  event: "transaction.failed",
  data: {
    id: string;
    amount: string;
    fee: string;
    narration: string;
    type: "debit";
    initiatedAt: string | null;
    completedAt: null;
    accountId: string;
    details: {
      accountName: string;
      accountNumber: string;
      bank: { code: string; name: string };
    } | null;
    status: "failed";
    failedAt: string;
    reasonForFailure: string;
    clientReference: string | null;
    transactionReference: string;
    nipSessionId: string | null;
  };
}
```

### 💰 `account.balance-updated`

```ts
{
  event: "account.balance-updated",
  data: {
    id: string;
    name: string;
    bankAccount: {
      accountName: string;
      accountNumber: string;
      bank: { code: string; name: string };
    };
    type: string;
    status: "active" | "deleted";
    availableBalance: string;
    currentBalance: string;
    currency: string;
    createdAt: string;
  };
}
```

### 🏦 `virtual-account.transaction`

```ts
{
  event: "virtual-account.transaction",
  data: {
    id: string;
    transactionAmount: string;
    fee: string;
    stampDuty: string;
    settlementAmount: string;
    currency: string;
    type: "credit";
    status: "successful";
    narration: string;
    details: {
      accountName: string;
      accountNumber: string;
      bank: { name: string; code: string };
    };
    virtualAccount: {
      id: string;
      accountReference: string;
      bankAccount: {
        accountName: string;
        accountNumber: string;
        bank: { code: string; name: string };
      };
      type: "Static Virtual Account" | "Dynamic Virtual Account";
      status: "active" | "expired" | "blacklisted";
      createdAt: string;
      expiresAt: string | null;
      currency: string;
    };
    accountReference: string;
    settlementAccountId: string;
    datetime: string;
    nipSessionId: string;
    transactionReference: string | null;
    settlementStatus: "pending" | "settled";
  };
}
```

### ✅ `virtual-account.transaction.settled`

```ts
{
  event: "virtual-account.transaction.settled",
  data: {
    id: string;
    transactionAmount: string;
    fee: string;
    stampDuty: string;
    settlementAmount: string;
    currency: string;
    type: "credit";
    status: "successful";
    narration: string;
    details: {
      accountName: string;
      accountNumber: string;
      bank: { name: string; code: string };
    };
    virtualAccount: {
      id: string;
      accountReference: string;
      bankAccount: {
        accountName: string;
        accountNumber: string;
        bank: { code: string; name: string };
      };
      type: "Static Virtual Account" | "Dynamic Virtual Account";
      status: "active" | "expired" | "blacklisted";
      createdAt: string;
      expiresAt: string | null;
      currency: string;
    };
    accountReference: string;
    settlementAccountId: string;
    datetime: string;
    nipSessionId: string;
    transactionReference: string | null;
    settlementStatus: "settled";
  };
}
```

---

## 🔐 Signature Verification Logic

```ts
import * as crypto from 'crypto';

function verifyLencoSignature(
  body: any,
  signature: string,
  apiToken: string,
): boolean {
  const webhookHashKey = crypto
    .createHash('sha256')
    .update(apiToken)
    .digest('hex');
  const computedHash = crypto
    .createHmac('sha512', webhookHashKey)
    .update(JSON.stringify(body))
    .digest('hex');
  return computedHash === signature;
}
```

---

## 🚀 Example NestJS Controller

```ts
import { Controller, Post, Req, Res, Headers } from '@nestjs/common';
import { Request, Response } from 'express';
import { WebhookService } from './webhook.service';

@Controller('webhooks')
export class LencoWebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('lenco')
  async handleWebhook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('x-lenco-signature') signature: string,
  ) {
    const isValid = this.webhookService.verifySignature(req.body, signature);
    if (!isValid) return res.status(401).send('Invalid signature');

    await this.webhookService.handleEvent(req.body.event, req.body.data);
    return res.status(200).send('OK');
  }
}
```

---

## 🧠 Service Example

```ts
@Injectable()
export class WebhookService {
  verifySignature(body: any, signature: string): boolean {
    const apiToken = process.env.LENCO_API_TOKEN!;
    const key = crypto.createHash('sha256').update(apiToken).digest('hex');
    const hash = crypto
      .createHmac('sha512', key)
      .update(JSON.stringify(body))
      .digest('hex');
    return hash === signature;
  }

  async handleEvent(event: string, data: any) {
    switch (event) {
      case 'transaction.successful':
        return this.handleTransactionSuccess(data);
      case 'transaction.failed':
        return this.handleTransactionFailure(data);
      case 'account.balance-updated':
        return this.handleBalanceUpdate(data);
      case 'virtual-account.transaction':
      case 'virtual-account.transaction.settled':
        return this.handleVirtualAccountEvent(data);
      default:
        console.warn(`Unhandled event: ${event}`);
    }
  }

  private async handleTransactionSuccess(data) {
    // update DB, notify users, etc.
  }

  private async handleTransactionFailure(data) {
    // log or alert
  }

  private async handleBalanceUpdate(data) {
    // sync balances
  }

  private async handleVirtualAccountEvent(data) {
    // manage virtual account settlements
  }
}
```

---

## ✅ Cursor Usage Tips

- Cursor will autocomplete `@Post('lenco')` or `"transaction."` events using this context.
- It will infer types and suggest DTO interfaces automatically.
- Helps with service imports, typing, and event handling patterns.
