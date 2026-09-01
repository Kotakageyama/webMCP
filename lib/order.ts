export type TaskKind = "refund" | "shipping_update" | "shipment_cancel";
export type OrderItem = { id: string; title: string; variant: string; quantity: number; unitPriceYen: number; status: string };
export type Order = { id: string; customerName: string; customerEmail: string; status: string; shippingAddress: { recipient: string; line1: string; city: string; postalCode: string; country: string }; items: OrderItem[] };
export const demoOrder: Order = {
  id: "TS-1042", customerName: "Maya Chen", customerEmail: "maya.chen@example.com", status: "fulfilled",
  shippingAddress: { recipient: "Maya Chen", line1: "1-8-5 Shibuya", city: "Tokyo", postalCode: "150-0002", country: "Japan" },
  items: [
    { id: "item-red-shirt", title: "Essential T-Shirt", variant: "Red / M", quantity: 1, unitPriceYen: 7800, status: "fulfilled" },
    { id: "item-pants", title: "Everyday Trousers", variant: "Black / 30", quantity: 1, unitPriceYen: 12000, status: "fulfilled" },
    { id: "item-cap", title: "Canvas Cap", variant: "Stone / One size", quantity: 1, unitPriceYen: 3600, status: "fulfilled" }
  ]
};
export const yen = (value: number) => new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY", maximumFractionDigits: 0 }).format(value);
