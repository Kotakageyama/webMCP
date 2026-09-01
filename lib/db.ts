import postgres from "postgres";
import { demoOrder, type Order } from "./order";

const url = process.env.DATABASE_URL;
const sql = url ? postgres(url, { ssl: "require", max: 5, prepare: false }) : null;

export async function getOrder(id: string): Promise<Order> {
  if (!sql) return demoOrder;
  const orders = await sql`SELECT id, customer_name, customer_email, status, shipping_address FROM orders WHERE id = ${id}`;
  if (!orders[0]) return demoOrder;
  const items = await sql`SELECT id, title, variant, quantity, unit_price_yen, status FROM order_items WHERE order_id = ${id} ORDER BY id`;
  return { id: orders[0].id, customerName: orders[0].customer_name, customerEmail: orders[0].customer_email, status: orders[0].status, shippingAddress: orders[0].shipping_address, items: items.map((x) => ({ id: x.id, title: x.title, variant: x.variant, quantity: x.quantity, unitPriceYen: x.unit_price_yen, status: x.status })) };
}

export async function persistAction(orderId: string, kind: string, payload: unknown) {
  if (!sql) return;
  // Request JSON is normalized before reaching the driver; this rejects values
  // that Postgres cannot serialize and keeps the persisted event replayable.
  const jsonPayload = JSON.parse(JSON.stringify(payload ?? {})) as postgres.JSONValue;
  await sql.begin(async (tx) => {
    await tx`INSERT INTO task_actions (order_id, kind, payload, actor) VALUES (${orderId}, ${kind}, ${tx.json(jsonPayload)}, 'human')`;
    if (kind === "refund") await tx`UPDATE orders SET status = 'partially_refunded', updated_at = now() WHERE id = ${orderId}`;
    if (kind === "shipment_cancel") await tx`UPDATE orders SET status = 'shipment_cancelled', updated_at = now() WHERE id = ${orderId}`;
    if (kind === "shipping_update") await tx`UPDATE orders SET shipping_address = ${tx.json(jsonPayload)}, updated_at = now() WHERE id = ${orderId}`;
  });
}
