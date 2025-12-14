import { HttpsError } from "firebase-functions/v2/https";

export interface PaymentVerifier {
  verifyTransaction(reference: string, secret: string): Promise<boolean>;
}

export const paystackVerifier: PaymentVerifier = {
  async verifyTransaction(reference: string, secret: string): Promise<boolean> {
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
      }
    );

    if (!response.ok) {
      console.error("Paystack verification failed:", await response.text());
      return false;
    }

    const json = (await response.json()) as any;
    return json?.data?.status === "success";
  },
};

// Placeholder for Stripe
export const stripeVerifier: PaymentVerifier = {
  async verifyTransaction(reference: string, secret: string): Promise<boolean> {
    // Implement Stripe verification here
    // const stripe = new Stripe(secret);
    // const session = await stripe.checkout.sessions.retrieve(reference);
    // return session.payment_status === 'paid';
    throw new HttpsError("unimplemented", "Stripe verification not implemented.");
  },
};

export function getPaymentVerifier(provider: "paystack" | "stripe" = "paystack"): PaymentVerifier {
  switch (provider) {
    case "paystack":
      return paystackVerifier;
    case "stripe":
      return stripeVerifier;
    default:
      return paystackVerifier;
  }
}
