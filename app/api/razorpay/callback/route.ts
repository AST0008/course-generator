import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { razorpay } from "@/lib/razorpay";

export async function GET(request: Request) {
  try {
    const session = await getAuthSession();
    
    if (!session?.user) {
      return NextResponse.redirect(new URL("/sign-in", process.env.NEXTAUTH_URL!));
    }

    // Get the subscription ID from the URL
    const url = new URL(request.url);
    const subscriptionId = url.searchParams.get("subscription_id");
    
    if (!subscriptionId) {
      throw new Error("No subscription ID provided");
    }

    // Fetch subscription details from Razorpay
    const subscription = await razorpay.subscriptions.fetch(subscriptionId);
    
    console.log("[RAZORPAY CALLBACK] Subscription details:", {
      id: subscription.id,
      status: subscription.status,
      current_end: subscription.current_end,
    });

    if (!subscription.current_end) {
      throw new Error("Subscription end date not found");
    }

    // Update user subscription in database
    await prisma.userSubscription.update({
      where: {
        userId: session.user.id,
      },
      data: {
        razorpaySubscriptionId: subscription.id,
        razorpayCurrentPeriodEnd: new Date(subscription.current_end * 1000),
        isPro: subscription.status === 'active',
      },
    });
    
    // Redirect to settings page
    return NextResponse.redirect(new URL("/settings", process.env.NEXTAUTH_URL!));
  } catch (err) {
    console.error("[RAZORPAY CALLBACK] Error:", err);
    return NextResponse.redirect(new URL("/settings?error=payment", process.env.NEXTAUTH_URL!));
  }
}