CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS orders (
  id text PRIMARY KEY,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  status text NOT NULL DEFAULT 'fulfilled',
  shipping_address jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id text PRIMARY KEY,
  order_id text NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  title text NOT NULL,
  variant text NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price_yen integer NOT NULL CHECK (unit_price_yen >= 0),
  status text NOT NULL DEFAULT 'fulfilled'
);

CREATE TABLE IF NOT EXISTS task_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id text NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('refund','shipping_update','shipment_cancel')),
  payload jsonb NOT NULL,
  actor text NOT NULL CHECK (actor IN ('agent','human')),
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO orders (id, customer_name, customer_email, status, shipping_address)
VALUES ('TS-1042', 'Maya Chen', 'maya.chen@example.com', 'fulfilled', '{"recipient":"Maya Chen","line1":"1-8-5 Shibuya","city":"Tokyo","postalCode":"150-0002","country":"Japan"}')
ON CONFLICT (id) DO NOTHING;
INSERT INTO order_items (id, order_id, title, variant, quantity, unit_price_yen)
VALUES
 ('item-red-shirt', 'TS-1042', 'Essential T-Shirt', 'Red / M', 1, 7800),
 ('item-pants', 'TS-1042', 'Everyday Trousers', 'Black / 30', 1, 12000),
 ('item-cap', 'TS-1042', 'Canvas Cap', 'Stone / One size', 1, 3600)
ON CONFLICT (id) DO NOTHING;
