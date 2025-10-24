// hooks/usePaystack.ts
import { useEffect, useState } from "react";

type PaystackResponse = {
  reference: string;
  trans: string;
  status: string;
  message: string;
  transaction: string;
  trxref: string;
};

type PaystackConfig = {
  email: string;
  amount: number; // amount in kobo
  reference: string;
  onSuccess: (res: PaystackResponse) => void;
  onClose?: () => void;
};

type PaystackHandler = {
  openIframe: () => void;
};

declare global {
  interface Window {
    PaystackPop?: {
      setup: (config: {
        key?: string;
        email: string;
        amount: number;
        ref: string;
        callback: (response: PaystackResponse) => void;
        onClose?: () => void;
      }) => PaystackHandler;
    };
  }
}

export const usePaystack = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Dynamically load the Paystack script once
  useEffect(() => {
    if (document.getElementById("paystack-inline-script")) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.id = "paystack-inline-script";
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.defer = true;

    script.onload = () => setIsLoaded(true);
    script.onerror = () => {
      console.error("Failed to load Paystack script");
    };

    document.body.appendChild(script);

    return () => {
      // optional cleanup (don’t remove if you want persistent availability)
      // document.getElementById("paystack-inline-script")?.remove();
    };
  }, []);

  const pay = ({
    email,
    amount,
    reference,
    onSuccess,
    onClose,
  }: PaystackConfig) => {
    if (!isLoaded || !window.PaystackPop) {
      console.error("Paystack script not ready yet");
      return;
    }

    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email,
      amount,
      ref: reference,
      callback: (response: PaystackResponse) => {
        onSuccess(response);
      },
      onClose: () => {
        onClose?.();
      },
    });

    setTimeout(() => {
      handler.openIframe();
    }, 100);
  };

  return { pay, isLoaded };
};
