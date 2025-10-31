# Delivr Service Context

Delivr is a standalone NestJS microservice responsible for handling shipping operations after successful product payments from the main storefront backend.

---

## 🧩 Purpose

When the main backend sends a callback after a successful payment:
1. Delivr books a shipment via **Mercury MES API**.
2. Stores shipment data using **Prisma + PostgreSQL**.
3. Sends email notifications via **Resend API** — one to the admin, one to the customer.
4. Optionally, supports shipment tracking and freight estimation in the future.

---

## 🧱 Architecture Overview

### Flow

```
Storefront Backend → POST /shipments/callback → Delivr
    ↓
Delivr → Mercury API (Book Collection)
    ↓
Save shipment in Postgres (via Prisma)
    ↓
Send email notifications (via Resend)
    ↓
Return success response
```

### Core Modules

- **Mercury Module** → Handles all Mercury API communication (Book Collection, Track Shipment, etc.)
- **Shipments Module** → Handles incoming callbacks, validation, persistence, and email dispatch.
- **Mail Module** → Uses Resend to send transactional emails.
- **Database (Prisma)** → Stores shipment metadata.
- **Common Utilities** → Shared helpers for network requests, logging, and constants.

---

## 🧰 Tech Stack

| Layer | Technology | Description |
|-------|-------------|--------------|
| Framework | NestJS | Modular backend framework |
| ORM | Prisma | Type-safe database ORM |
| Database | PostgreSQL | Primary data store |
| Network | Axios | For Mercury API integration |
| Email | Resend | Transactional emails |
| Config | dotenv / ConfigModule | Environment variables |
| Validation | class-validator | DTO and request validation |
| Testing | Jest | Unit and e2e testing |

---

## 🧩 Code Design Principles

- Clean, type-safe TypeScript.
- DTOs for all inputs/outputs.
- No inline magic values (use constants).
- One export per file.
- Controllers handle routing and minimal transformation.
- Services contain all business logic.
- Adhere to SOLID and DRY principles.
- Use dependency injection for all external services (Resend, Axios, Prisma).
- Keep functions < 20 instructions and classes < 200 instructions.

---

## 📦 Environment Variables

```
PORT=4002
DATABASE_URL=postgresql://user:password@localhost:5432/delivr
MERCURY_API_URL=http://116.202.29.37/quotation1/app
MERCURY_EMAIL=example@domain.com
MERCURY_PRIVATE_KEY=$ARtdDYJRDMKhs
RESEND_API_KEY=your_resend_api_key
ADMIN_EMAIL=admin@yourdomain.com
```

---

## 🧠 Example Flow

1. **POST /shipments/callback**
   - Receives order data after payment.
   - Calls Mercury `bookcollection` endpoint.
   - Saves shipment to DB.
   - Sends two Resend emails (admin + user).
   - Returns shipment status.

2. **GET /shipments/:waybill**
   - Fetches status from Mercury tracking endpoint.

---

## 🔧 Folder Structure

```
src/
├── app.module.ts
├── main.ts
├── mercury/
│   ├── mercury.module.ts
│   ├── mercury.service.ts
│   └── dto/
│       ├── book-collection.dto.ts
│       └── track-shipment.dto.ts
├── shipments/
│   ├── shipments.module.ts
│   ├── shipments.controller.ts
│   ├── shipments.service.ts
│   ├── entities/
│   │   └── shipment.model.ts
│   └── dto/
│       └── create-shipment.dto.ts
├── mail/
│   ├── mail.module.ts
│   ├── mail.service.ts
├── common/
│   ├── constants/
│   └── utils/
│       └── http-client.ts
└── prisma/
    ├── schema.prisma
    └── prisma.service.ts
```

---

## 🧑‍💻 Development Notes

- Use **Axios** interceptors for Mercury API logging.
- Keep all DTOs validated with `class-validator`.
- Use **Resend SDK** for email dispatch (no direct SMTP).
- Prisma schema defines `Shipment` model with fields:
  - `id`, `orderId`, `userEmail`, `waybill`, `rate`, `status`, `createdAt`.
- Add health endpoint `/admin/test` to confirm service is up.

---

## 🧾 Example Email Templates

### User Email
```
Subject: Your Shipment is Confirmed
Body:
Hi {{firstName}}, your shipment with waybill {{waybill}} has been booked successfully.
Track it via {{trackingUrl}}.
```

### Admin Email
```
Subject: New Shipment Created
Body:
A new shipment (waybill: {{waybill}}) has been booked for order #{{orderId}}.
```

---

This context ensures Cursor always generates consistent, production-ready code aligned with the Delivr architecture and Mercury MES API integration.
