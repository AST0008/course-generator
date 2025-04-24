import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      console.error("[RAZORPAY WEBHOOK] Missing signature");
      return new NextResponse("Missing signature", { status: 400 });
    }

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!secret) {
      console.error("[RAZORPAY WEBHOOK] Missing webhook secret");
      return new NextResponse("Server configuration error", { status: 500 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.error("[RAZORPAY WEBHOOK] Invalid signature");
      return new NextResponse("Invalid signature", { status: 400 });
    }

    const event = JSON.parse(body);
    console.log("[RAZORPAY WEBHOOK] Event received:", event.event);

    if (
      event.event === "subscription.activated" ||
      event.event === "subscription.created"
    ) {
      const subscription = event.payload.subscription.entity;
      const userId = subscription.notes?.userId;

      if (!userId) {
        console.error(
          "[RAZORPAY WEBHOOK] Missing userId in subscription notes"
        );
        return new NextResponse("Missing userId", { status: 400 });
      }

      // Check if subscription record already exists
      const existingSubscription = await prisma.userSubscription.findFirst({
        where: {
          razorpaySubscriptionId: subscription.id,
        },
      });

      if (existingSubscription) {
        // Update existing record
        await prisma.userSubscription.update({
          where: {
            id: existingSubscription.id,
          },
          data: {
            razorpayCurrentPeriodEnd: new Date(subscription.current_end * 1000),
            isPro: true,
          },
        });
      } else {
        // Create new record
        await prisma.userSubscription.create({
          data: {
            userId,
            razorpaySubscriptionId: subscription.id,
            razorpayCustomerId: subscription.customer_id,
            razorpayPlanId: subscription.plan_id,
            razorpayCurrentPeriodEnd: new Date(subscription.current_end * 1000),
            isPro: true,
          },
        });
      }

      console.log(
        "[RAZORPAY WEBHOOK] Subscription record created/updated for user:",
        userId
      );
    }

    if (event.event === "subscription.charged") {
      const subscription = event.payload.subscription.entity;

      await prisma.userSubscription.updateMany({
        where: {
          razorpaySubscriptionId: subscription.id,
        },
        data: {
          razorpayCurrentPeriodEnd: new Date(subscription.current_end * 1000),
          isPro: true,
        },
      });

      console.log("[RAZORPAY WEBHOOK] Subscription renewed:", subscription.id);
    }

    if (
      event.event === "subscription.cancelled" ||
      event.event === "subscription.expired"
    ) {
      const subscription = event.payload.subscription.entity;

      await prisma.userSubscription.updateMany({
        where: {
          razorpaySubscriptionId: subscription.id,
        },
        data: {
          isPro: false,
        },
      });

      console.log(
        "[RAZORPAY WEBHOOK] Subscription cancelled/expired:",
        subscription.id
      );
    }

    return new NextResponse(null, { status: 200 });
  } catch (err) {
    console.error("[RAZORPAY WEBHOOK] Error:", err);
    if (err instanceof Error) {
      console.error("[RAZORPAY WEBHOOK] Error message:", err.message);
    }
    return new NextResponse("Internal server error", { status: 500 });
  }
}
