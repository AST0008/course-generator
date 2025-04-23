"use client";

import { useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Zap } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { notify } from "./ui/sonner";

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

const SubscriptionAction = () => {
  const { data } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubscription = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/razorpay");
      if (response.status === 200) {
        const { checkoutSession } = response.data as { checkoutSession: RazorpayCheckoutSession };
        console.log("Razorpay checkout session:", checkoutSession);
        
        // Initialize Razorpay checkout
        const options = {
          key: checkoutSession.key,
          subscription_id: checkoutSession.subscription_id,
          name: checkoutSession.name,
          description: checkoutSession.description,
          callback_url: checkoutSession.callback_url,
          redirect: checkoutSession.redirect,
          prefill: checkoutSession.prefill,
          handler: function (response: any) {
            console.log("Payment successful:", response);
            notify({
              title: "Success",
              description: "Subscription activated successfully!",
            });
            window.location.href = checkoutSession.callback_url;
          },
          modal: {
            ondismiss: function() {
              notify({
                title: "Payment Cancelled",
                description: "You can try again later",
                variant: "destructive",
              });
            }
          }
        };

        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
      }
    } catch (error) {
      console.error("Subscription error:", error);
      notify({
        title: "Error",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-grey-700 items-center justify-center w-1/2 p-4 mx-auto mt-8 rounded-lg border border-secondary/20">
      {data?.user?.credits} / 10 Free Generations Left
      <Progress
        className="mt-2"
        value={data?.user?.credits ? (data?.user?.credits / 10) * 100 : 0}
      />
      <Button
        onClick={handleSubscription}
        disabled={isLoading}
        className="mt-3 font-bold cursor-pointer text-white transition-all duration-300 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
        variant="outline"
      >
        {isLoading ? "Loading..." : "Upgrade"} <Zap className="w-4 fill-white h-4 ml-2" />
      </Button>
    </div>
  );
};

export default SubscriptionAction;
