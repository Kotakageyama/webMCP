"use client";
import { useEffect, useMemo, useState } from "react";
import { type Order, type TaskKind, yen } from "../lib/order";
import { registerTaskSurfaceTools } from "./webmcp";

const intents: Record<TaskKind, { label: string; copy: string; tools: string[] }> = {
  refund: { label: "Return an item", copy: "Return only the red T-shirt from order #TS-1042", tools: ["search_orders", "get_order", "select_items", "calculate_refund", "refund_order"] },
  shipping_update: { label: "Change delivery address", copy: "Change the delivery address for order #TS-1042", tools: ["get_order", "validate_address", "quote_shipping", "update_shipping"] },
  shipment_cancel: { label: "Cancel shipment", copy: "Cancel the shipment for order #TS-1042", tools: ["get_order", "get_shipment", "cancel_shipping"] }
};

export default function TaskSurface({ initialOrder }: { initialOrder: Order }) {
  const [task, setTask] = useState<TaskKind | null>(null);
  const [destination, setDestination] = useState("card");
  const [reason, setReason] = useState("Incorrect size ordered");
  const [confirmed, setConfirmed] = useState(false);
  const [address, setAddress] = useState(initialOrder.shippingAddress);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const selected = initialOrder.items[0];
  const preview = useMemo(() => task === "refund" ? [`${selected.title} (${selected.variant}) will be refunded`, `${yen(selected.unitPriceYen)} returns to ${destination === "card" ? "Visa •••• 2211" : "store credit"}`, "Order status changes to partially refunded"] : task === "shipping_update" ? [`Delivery address changes to ${address.line1}`, `${address.city}, ${address.postalCode}, ${address.country}`, "Shipment is re-quoted before dispatch"] : ["Shipment SHP-029184 will be cancelled", "Carrier pickup is stopped if it has not been collected", "Merchant review is required before cancellation"], [task, destination, selected, address]);
  useEffect(() => registerTaskSurfaceTools({ task, open: setTask, prepare: (kind, input) => {
    setTask(kind);
    if (kind === "refund") { if (input.destination === "card" || input.destination === "credit") setDestination(input.destination); if (typeof input.reason === "string") setReason(input.reason); }
    if (kind === "shipping_update") setAddress({
      recipient: typeof input.recipient === "string" ? input.recipient : address.recipient,
      line1: typeof input.line1 === "string" ? input.line1 : address.line1,
      city: typeof input.city === "string" ? input.city : address.city,
      postalCode: typeof input.postalCode === "string" ? input.postalCode : address.postalCode,
      country: typeof input.country === "string" ? input.country : address.country
    });
  } }), [task, address]);
  async function commit() {
    if (!task || !confirmed) return;
    const payload = task === "refund" ? { itemId: selected.id, destination, reason, amountYen: selected.unitPriceYen } : task === "shipping_update" ? address : { shipmentId: "SHP-029184" };
    setError(null);
    const response = await fetch(`/api/orders/${initialOrder.id}/actions`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ kind: task, payload, approved: true }) });
    if (response.ok) setDone(task === "refund" ? "Refund recorded" : task === "shipping_update" ? "Shipping address updated" : "Shipment cancellation recorded");
    else setError("Could not commit the action. Your proposal is still unchanged.");
  }
  return <main className="shell">
    <aside className="sidebar"><div className="brand"><b>◫</b> TaskSurface</div><nav>{["Orders", "Products", "Customers", "Shipments"].map((name, index) => <button className={index === 0 ? "nav active" : "nav"} key={name}>{name}</button>)}</nav><div className="agent"><span className="pulse" /> <div><strong>Agent Helix</strong><small>{task ? "Working in this task" : "Ready"}</small></div></div></aside>
    <section className="workspace">
      <header><div><p className="eyebrow">Order management / {task ? "Task mode" : "Full order"}</p><h1>Order #{initialOrder.id} <span className="status">{done ?? initialOrder.status.replace("_", " ")}</span></h1><p className="muted">{initialOrder.customerName} · {initialOrder.customerEmail}</p></div>{task && <button className="textButton" onClick={() => { setTask(null); setDone(null); setConfirmed(false); }}>← Back to full order</button>}</header>
      {!task ? <Dashboard order={initialOrder} onStart={setTask} /> : <div className="taskGrid"><section className="taskForm"><p className="eyebrow">Focused task</p><h2>{intents[task].label}</h2><p className="muted">The agent prepared this task from live page capabilities. You own the final decision.</p>{task === "refund" && <Refund item={selected} destination={destination} setDestination={setDestination} reason={reason} setReason={setReason} />}{task === "shipping_update" && <Address address={address} setAddress={setAddress} />}{task === "shipment_cancel" && <div className="warning"><strong>Shipment SHP-029184</strong><br />Yamato pickup is scheduled for today at 16:00. Cancellation will be sent to the carrier.</div>}<label className="confirm"><input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} /> I reviewed the proposed change and approve this action.</label></section><aside className="inspector"><p className="eyebrow">Agent presence</p><ol className="timeline"><li>Capabilities discovered</li><li>Order and current state read</li><li>Proposal prepared</li><li className="current">Waiting for your decision</li></ol><p className="eyebrow">Live WebMCP tools</p><div className="tools">{intents[task].tools.map((tool) => <code key={tool}>{tool}</code>)}</div><p className="eyebrow previewLabel">Semantic preview</p><div className="preview">{preview.map((line) => <p key={line}>→ {line}</p>)}</div></aside></div>}
      {task && <footer className="approval"><span>{error ?? (confirmed ? "Ready for merchant review" : "Confirm the proposal to enable commit")}</span><div><button className="secondary" onClick={() => setTask(null)}>Cancel</button><button className="primary" disabled={!confirmed} onClick={commit}>{task === "refund" ? "Commit refund" : task === "shipping_update" ? "Commit address update" : "Commit cancellation"}</button></div></footer>}
    </section>
  </main>;
}
function Dashboard({ order, onStart }: { order: Order; onStart: (t: TaskKind) => void }) { return <div className="dashboard"><section className="intent"><p className="eyebrow">What should we accomplish?</p><h2>Turn a live page into a shared task surface.</h2><p className="muted">Choose a purpose. TaskSurface narrows the UI to the required capabilities, then returns final judgment to you.</p><div className="intentButtons">{(Object.keys(intents) as TaskKind[]).map((key) => <button key={key} onClick={() => onStart(key)}><strong>{intents[key].label}</strong><small>{intents[key].copy}</small><span>Start →</span></button>)}</div></section><section className="orderCard"><p className="eyebrow">Current order</p>{order.items.map((item) => <div className="item" key={item.id}><div className={item.id === "item-red-shirt" ? "swatch red" : "swatch"} /><div><strong>{item.title}</strong><small>{item.variant} · Qty {item.quantity}</small></div><b>{yen(item.unitPriceYen)}</b></div>)}<div className="addressSummary"><p className="eyebrow">Delivery</p><strong>{order.shippingAddress.recipient}</strong><span>{order.shippingAddress.line1}, {order.shippingAddress.city}</span></div></section></div>; }
function Refund({ item, destination, setDestination, reason, setReason }: { item: Order["items"][number]; destination: string; setDestination: (v: string) => void; reason: string; setReason: (v: string) => void }) { return <><div className="selectedItem"><div className="swatch red" /><div><strong>{item.title}</strong><small>{item.variant}</small></div><b>{yen(item.unitPriceYen)}</b></div><fieldset><legend>Refund destination <em>Agent is focused here</em></legend><label className={destination === "card" ? "choice selected" : "choice"}><input type="radio" checked={destination === "card"} onChange={() => setDestination("card")} /> Visa •••• 2211 <small>Original payment</small></label><label className={destination === "credit" ? "choice selected" : "choice"}><input type="radio" checked={destination === "credit"} onChange={() => setDestination("credit")} /> Store credit <small>Available immediately</small></label></fieldset><label className="field">Return reason<select value={reason} onChange={(e) => setReason(e.target.value)}><option>Incorrect size ordered</option><option>Damaged or defective</option><option>Changed mind</option></select></label></>; }
function Address({ address, setAddress }: { address: Order["shippingAddress"]; setAddress: (v: Order["shippingAddress"]) => void }) { const update = (key: keyof Order["shippingAddress"], value: string) => setAddress({ ...address, [key]: value }); return <div className="fields">{([['recipient','Recipient'],['line1','Street address'],['city','City'],['postalCode','Postal code'],['country','Country']] as const).map(([key,label]) => <label className="field" key={key}>{label}<input value={address[key]} onChange={(e) => update(key,e.target.value)} /></label>)}</div>; }
