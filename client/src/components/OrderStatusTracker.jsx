const DELIVERY_STEPS = [
  { key: "pending", label: "Order Placed", sub: "We've received your order" },
  { key: "confirmed", label: "Confirmed", sub: "Kitchen has confirmed it" },
  { key: "preparing", label: "Preparing", sub: "Your food is being cooked" },
  { key: "out_for_delivery", label: "Out for Delivery", sub: "On the way to you" },
  { key: "delivered", label: "Delivered", sub: "Enjoy your meal!" },
];

const PICKUP_STEPS = [
  { key: "pending", label: "Order Placed", sub: "We've received your order" },
  { key: "confirmed", label: "Confirmed", sub: "Kitchen has confirmed it" },
  { key: "preparing", label: "Preparing", sub: "Your food is being cooked" },
  { key: "ready_for_pickup", label: "Ready for Pickup", sub: "Come grab your order" },
  { key: "delivered", label: "Picked Up", sub: "Enjoy your meal!" },
];

export default function OrderStatusTracker({ order }) {
  if (order.status === "cancelled") {
    return (
      <div className="status-badge sb-cancelled" style={{ display: "inline-block" }}>
        Order Cancelled
      </div>
    );
  }

  const steps = order.fulfillmentType === "pickup" ? PICKUP_STEPS : DELIVERY_STEPS;
  const currentIdx = steps.findIndex((s) => s.key === order.status);

  return (
    <div className="status-track">
      {steps.map((step, idx) => {
        const done = idx < currentIdx;
        const current = idx === currentIdx;
        return (
          <div key={step.key} className={`status-step ${done ? "done" : ""} ${current ? "current" : ""}`}>
            {idx < steps.length - 1 && <div className="status-line" />}
            <div className="status-dot" />
            <div>
              <div className="status-label">{step.label}</div>
              <div className="status-sub">{step.sub}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
