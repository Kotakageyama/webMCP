"use client";

type Tool = { name: string; description: string; inputSchema: Record<string, unknown>; annotations?: { readOnlyHint?: boolean }; execute: (input: Record<string, unknown>, context: { signal: AbortSignal }) => Promise<string> | string };
type ModelContextDocument = Document & { modelContext?: { registerTool: (tool: Tool, options?: { signal?: AbortSignal }) => Promise<void> } };

const emptySchema = { type: "object", properties: {} };

/** Registers only the capabilities usable in the current TaskSurface state. */
export function registerTaskSurfaceTools(options: { task: "refund" | "shipping_update" | "shipment_cancel" | null; open: (task: "refund" | "shipping_update" | "shipment_cancel") => void; prepare: (task: "refund" | "shipping_update" | "shipment_cancel", input: Record<string, unknown>) => void }) {
  const context = (document as ModelContextDocument).modelContext;
  if (!context) return () => undefined;
  const controller = new AbortController();
  const register = (tool: Tool) => context.registerTool(tool, { signal: controller.signal }).catch(() => undefined);
  if (!options.task) {
    register({ name: "start_refund_task", description: "Focus this order page on returning an item. Use when the merchant asks to refund an order item.", inputSchema: emptySchema, execute: async () => { options.open("refund"); return "Opened a focused refund task for order TS-1042."; } });
    register({ name: "start_shipping_update_task", description: "Focus this order page on changing its delivery address.", inputSchema: emptySchema, execute: async () => { options.open("shipping_update"); return "Opened the delivery-address task for order TS-1042."; } });
    register({ name: "start_shipment_cancel_task", description: "Focus this order page on cancelling its shipment.", inputSchema: emptySchema, execute: async () => { options.open("shipment_cancel"); return "Opened the shipment cancellation task for order TS-1042."; } });
  } else if (options.task === "refund") {
    register({ name: "get_order", description: "Read the current order TS-1042 and its fulfilled items.", inputSchema: emptySchema, annotations: { readOnlyHint: true }, execute: async () => "Order TS-1042: Essential T-Shirt Red/M JPY 7,800; Everyday Trousers Black/30 JPY 12,000; Canvas Cap JPY 3,600." });
    register({ name: "prepare_refund", description: "Prepare a refund proposal for the red Essential T-Shirt. The merchant must still review and commit it.", inputSchema: { type: "object", properties: { destination: { type: "string", enum: ["card", "credit"] }, reason: { type: "string" } } }, execute: async (input) => { options.prepare("refund", input); return "Prepared a refund proposal. Waiting for merchant confirmation."; } });
  } else if (options.task === "shipping_update") {
    register({ name: "prepare_shipping_update", description: "Prepare a delivery address update. The merchant must still review and commit it.", inputSchema: { type: "object", properties: { line1: { type: "string" }, city: { type: "string" }, postalCode: { type: "string" }, country: { type: "string" } }, required: ["line1", "city", "postalCode", "country"] }, execute: async (input) => { options.prepare("shipping_update", input); return "Prepared a shipping address proposal. Waiting for merchant confirmation."; } });
  } else {
    register({ name: "prepare_shipment_cancellation", description: "Prepare a cancellation for shipment SHP-029184. The merchant must still review and commit it.", inputSchema: emptySchema, execute: async () => { options.prepare("shipment_cancel", {}); return "Prepared shipment cancellation. Waiting for merchant confirmation."; } });
  }
  return () => controller.abort();
}
