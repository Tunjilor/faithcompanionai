// src/lib/paypal.ts
export function loadPayPalScript(clientId: string) {
  return new Promise<boolean>((resolve, reject) => {
    if (typeof window === "undefined") return resolve(false);

    // already loaded
    if (document.getElementById("paypal-sdk")) return resolve(true);

    const script = document.createElement("script");
    script.id = "paypal-sdk";
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`;
    script.async = true;

    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error("Failed to load PayPal SDK"));

    document.body.appendChild(script);
  });
}

type RenderArgs = {
  containerId: string;      // e.g. "paypal-button-container-Monthly"
  amount: string;           // e.g. "4.99"
  description: string;      // e.g. "FaithCompanion Premium — Monthly Plan"
  onApproved: (orderId: string) => Promise<void> | void;
};

export function renderPayPalButtons(args: RenderArgs) {
  const { containerId, amount, description, onApproved } = args;

  if (!window.paypal) throw new Error("PayPal SDK not available on window");

  // IMPORTANT: clear container before rendering again
  const el = document.getElementById(containerId);
  if (el) el.innerHTML = "";

  window.paypal
    .Buttons({
      style: { layout: "vertical", color: "gold", shape: "pill", label: "paypal" },
      createOrder: (_data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [
            {
              amount: { value: amount },
              description,
            },
          ],
        });
      },
      onApprove: async (_data: any, actions: any) => {
        const details = await actions.order.capture();
        await onApproved(details.id);
      },
    })
    .render(`#${containerId}`);
}
