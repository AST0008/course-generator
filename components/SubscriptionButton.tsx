'use client'

import { useState } from "react";
import { Button } from "./ui/button";
import axios from "axios";


interface RazorpayCheckoutSession {
    key: string;
    subscription_id: string;
    name: string;
    description: string;
    callback_url: string;
    redirect: boolean;
    prefill: {
      name: string | null;
      email: string | null;
      contact: string;
    };
  }

const SubscriptionButton = ({ isPro }: { isPro: boolean }) => {
    const [loading, setLoading] = useState(false)

    const handleSubscribe = async () => {
        setLoading(true)
        try {
           const response = await axios.get("/api/razorpay")
           if (response.status === 200) {
            const {checkoutSession} = response.data as {checkoutSession: RazorpayCheckoutSession}
            console.log("Razorpay checkout session:", checkoutSession)
           }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }
  return (
    <Button
    disabled={loading}
    onClick={handleSubscribe}
    className="mt-4"
    >
        {isPro ? "Manage Subscription" : "Upgrade to Pro"}
    </Button>
  )
};

export default SubscriptionButton;


