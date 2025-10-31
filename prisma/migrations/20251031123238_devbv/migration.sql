-- CreateTable
CREATE TABLE "shipments" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "user_email" TEXT NOT NULL,
    "waybill" TEXT,
    "rate" DECIMAL(10,2),
    "status" TEXT DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shipments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "shipments_waybill_key" ON "shipments"("waybill");

-- CreateIndex
CREATE INDEX "shipments_order_id_idx" ON "shipments"("order_id");

-- CreateIndex
CREATE INDEX "shipments_waybill_idx" ON "shipments"("waybill");
