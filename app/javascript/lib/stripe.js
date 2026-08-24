const STRIPE_SCRIPT_ID = "stripe-js";
const STRIPE_SCRIPT_SRC = "https://js.stripe.com/clover/stripe.js";

let stripePromise;

export function loadStripe() {
  if (typeof window.Stripe === "function") return Promise.resolve(window.Stripe);
  if (stripePromise) return stripePromise;

  stripePromise = new Promise((resolve, reject) => {
    let script = document.getElementById(STRIPE_SCRIPT_ID);

    const load = () => {
      if (typeof window.Stripe === "function") {
        resolve(window.Stripe);
      } else {
        stripePromise = undefined;
        reject(new Error("Stripe failed to load"));
      }
    };
    const error = () => {
      stripePromise = undefined;
      reject(new Error("Stripe failed to load"));
    };

    if (!script) {
      script = document.createElement("script");
      script.id = STRIPE_SCRIPT_ID;
      script.src = STRIPE_SCRIPT_SRC;
    }

    script.addEventListener("load", load, { once: true });
    script.addEventListener("error", error, { once: true });
    if (!script.isConnected) document.head.appendChild(script);
  });

  return stripePromise;
}
