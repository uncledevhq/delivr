# Mercury MES API Context

This document provides integration context for the **Mercury MES API v2**, which is used by the **Delivr Shipping Service** to handle shipping operations such as booking collections, tracking shipments, and fetching freight charges.

---

## 🌐 Base Configuration

- **Base URL:** `http://116.202.29.37/quotation1/app`
- **Auth:** Requires two parameters for all requests:
  - `email` → Registered account email.
  - `private_key` → Provided private key.
- **Response Codes:**

| Code | Message |
|------|----------|
| 500 | Email or Private key is blank |
| 501 | Email or Private key does not exist |
| 502 | Both Service IDs are null |
| 503 | Please Provide Shipment Data |
| 504 | Domestic Service ID Required |
| 505 | International Service ID Required |
| 506 | All fields Required |
| 507 | Country or city does not exist |
| 508 | Success |
| 509 | Service ID mismatch |

---

## 🚚 Main Endpoints

### 1️⃣ Get Country List

**Endpoint:**  
`GET /getcountrystatecity`

**Description:**  
Fetches a list of countries and (for Zambia) their states and cities.

**Response Example:**
```json
[
  {
    "id": "3",
    "country_name": "Zambia",
    "state_name": "Lusaka Province",
    "city_name": "Lusaka"
  }
]
```

---

### 2️⃣ Get Freight Charge

**Endpoint:**  
`GET /getfreight`

**Required Parameters:**
```json
{
  "email": "sumit@inerun.com",
  "private_key": "$ARtdDYJRDMKhs",
  "domestic_service": 1,
  "international_service": 4,
  "shipment": [
    {
      "vendor_id": "1",
      "source_country": "8",
      "source_city": "1",
      "destination_country": "3",
      "destination_city": "1",
      "insurance": 1,
      "pieces": 1,
      "length": 1,
      "width": 1,
      "height": 1,
      "gross_weight": 2,
      "declared_value": 1
    }
  ]
}
```

**Response Example:**
```json
{
  "error_msg": "Success",
  "error_code": 508,
  "rate": 5519.67
}
```

---

### 3️⃣ Book Collection

**Endpoint:**  
`POST /bookcollection`

**Required Parameters:**
```json
{
  "email": "sumit@inerun.com",
  "private_key": "$ARtdDYJRDMKhs",
  "domestic_service": 1,
  "international_service": 4,
  "insurance": 1,
  "shipment": [
    {
      "shipment_pickup_address": [
        {
          "s_first_name": "sumit",
          "s_last_name": "singh",
          "s_country": "3",
          "s_statelist": "1",
          "s_city": "1",
          "s_add_1": "Lusaka",
          "s_add_2": "Lusaka",
          "s_mobile_no": "9876543210",
          "s_email": "amit@inerun.com"
        }
      ],
      "shipment_delivery_address": [
        {
          "r_first_name": "Abhishek",
          "r_last_name": "Mann",
          "r_country": "3",
          "r_statelist": "4",
          "r_city": "4",
          "r_add_1": "Solwezi",
          "r_add_2": "Solwezi",
          "r_mobile_no": "9876543210",
          "r_email": "abhishek@inerun.com"
        }
      ],
      "shipment_details": [{ "paymenttype": "4" }],
      "item_details": [
        {
          "pieces": 1,
          "length": 33,
          "width": 21,
          "height": 5,
          "gross_weight": 4,
          "declared_value": 100
        }
      ]
    }
  ]
}
```

**Response Example:**
```json
{
  "error_msg": "Success",
  "error_code": 508,
  "rate": 380.31,
  "waybill": ["0000352838", "0000352839"]
}
```

**Notes:**
- `paymenttype`: 2 = Cash, 3 = On Account, 4 = COD.
- The `waybill` array may contain multiple shipments.

---

### 4️⃣ Track Shipment

**Endpoint:**  
`GET /getshipmenttrackingdetails/wbid/{waybill}`

**Example:**  
`GET /getshipmenttrackingdetails/wbid/0000352838`

**Response Example:**
```json
{
  "error_msg": "Success",
  "error_code": 508,
  "detail": [
    {
      "status_timestamp": "2023-04-27 18:32:04",
      "location": "Lusaka",
      "status_comment": "DELIVERED"
    },
    {
      "status_timestamp": "2023-04-26 09:57:05",
      "location": "Lusaka",
      "status_comment": "Assigned to driver for delivery"
    }
  ],
  "other_detail": {
    "receiver_name": "Martha James",
    "pod": "http://116.202.29.37/quotation1/public/images/pod/1682600525Signature.jpg"
  }
}
```

---

### 5️⃣ Get Shipment Status

**Endpoint:**  
`GET /getshipmenttracking/wbid/{waybill}`

**Response Example:**
```json
{
  "error_msg": "Success",
  "error_code": 508,
  "detail": [
    {
      "status_timestamp": "2023-04-27 18:32:04",
      "location": "Lusaka",
      "status_comment": "DELIVERED"
    }
  ]
}
```

---

### 6️⃣ Get Waybill Details

**Endpoint:**  
`GET /getwaybilldetail/bid/{waybill}`

**Response Example:**
```json
{
  "error_msg": "Success",
  "error_code": 508,
  "detail": {
    "WayBill": "0000352838",
    "origin": "Lusaka",
    "destination": "Solwezi",
    "receiver_name": "sumit singh",
    "sender_name": "Abhishek Mann",
    "price": 250.16,
    "vat": 27.04,
    "total": 196.07,
    "barcode_img_path": "http://116.202.29.37/quotation1/public/images/waybill/0000352838.png"
  }
}
```

---

## 📦 Data Models (as per documentation)

| Entity | Field | Description |
|--------|--------|-------------|
| Shipment | `waybill` | Mercury’s shipment ID |
| Shipment | `rate` | Freight charge |
| Shipment | `status_comment` | Current shipment status |
| Parcel | `pieces`, `length`, `width`, `height`, `mass_kg` | Package dimensions |
| Address | `s_*` or `r_*` fields | Sender/Receiver details |

---

## ⚙️ Integration Notes

- **Authentication** → always include `email` and `private_key`.
- **Headers** → None specified; all parameters are query or body params.
- **Responses** → All responses include `error_msg` and `error_code`.
- **Successful Responses** → Identified by `error_code = 508`.

---

## 🧩 Recommended NestJS Wrapper Design

The Mercury integration should be wrapped in a dedicated module with:
- `mercury.service.ts` → handles network requests via Axios.
- `dto/` folder → defines validated request/response structures.
- A centralized config file for credentials.

---

## ✅ Example Integration Flow (Delivr)

1. Delivr receives payment success callback.
2. Calls `bookCollection` on Mercury API.
3. Saves waybill, rate, and order data in database.
4. Returns shipment confirmation to main backend.
5. Sends notifications via Resend.

---

This context ensures Cursor understands the **Mercury API contract**, available endpoints, and how to implement compliant integration logic within the **Delivr NestJS service**.
