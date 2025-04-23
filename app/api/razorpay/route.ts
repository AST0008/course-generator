import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { razorpay } from "@/lib/razorpay";
import { NextResponse } from "next/server";

const settingsUrl = process.env.NEXTAUTH_URL + "/settings";

export async function GET() {
  try {
    // Log environment variables (without sensitive data)
    console.log("[RAZORPAY DEBUG] NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
    console.log("[RAZORPAY DEBUG] RAZORPAY_PLAN_ID exists:", !!process.env.RAZORPAY_PLAN_ID);
    
    const session = await getAuthSession();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userSubscription = await prisma.userSubscription.findUnique({
      where: { userId: session.user.id },
    });

    if (userSubscription?.razorpaySubscriptionId && userSubscription?.razorpayCustomerId) {
      // Redirect to settings — Razorpay does not offer a billing portal like Stripe
      return NextResponse.json({ url: settingsUrl });
    }

    if (!process.env.RAZORPAY_PLAN_ID) {
      console.error("[RAZORPAY ERROR] RAZORPAY_PLAN_ID is not set");
      return new NextResponse("Subscription plan not configured", { status: 500 });
    }

    if (!process.env.RAZORPAY_KEY_ID) {
      console.error("[RAZORPAY ERROR] RAZORPAY_KEY_ID is not set");
      return new NextResponse("Razorpay key not configured", { status: 500 });
    }

    // Handle customer creation or retrieval
    let customerId;
    try {
      // First check if user already has a customerId stored
      if (userSubscription?.razorpayCustomerId) {
        customerId = userSubscription.razorpayCustomerId;
        console.log("[RAZORPAY DEBUG] Using existing customer ID from database:", customerId);
      } else {
        // If not, try to find customer by email
        const email = session.user.email;
        if (!email) {
          return new NextResponse("User email required", { status: 400 });
        }
        
        console.log("[RAZORPAY DEBUG] Searching for customer with email:", email);
        
        try {
          // Try to fetch customer by email
          const customers = await razorpay.customers.all();
          const existingCustomer = customers.items.find(cust => 
            cust.email === email
          );
          
          if (existingCustomer) {
            customerId = existingCustomer.id;
            console.log("[RAZORPAY DEBUG] Found existing customer:", customerId);
          } else {
            // Create new customer if none exists
            const newCustomer = await razorpay.customers.create({
              name: session.user.name ?? "User",
              email: email,
              contact: "9999999999", // Ideally should be dynamic
              notes: {
                userId: session.user.id
              }
            });
            customerId = newCustomer.id;
            console.log("[RAZORPAY DEBUG] Created new customer:", customerId);
          }
        } catch (err) {
          console.error("[RAZORPAY ERROR] Failed to fetch customers:", err);
          // Fall back to creating customer directly
          try {
            // Try to create unique customer ID with timestamp
            const timestamp = new Date().getTime();
            const newCustomer = await razorpay.customers.create({
              name: session.user.name ?? "User",
              email: `${email}_${timestamp}`,  // Make email unique with timestamp
              contact: "9999999999", // Ideally should be dynamic
              notes: {
                userId: session.user.id,
                originalEmail: email
              }
            });
            customerId = newCustomer.id;
            console.log("[RAZORPAY DEBUG] Created new customer with modified email:", customerId);
          } catch (createErr) {
            console.error("[RAZORPAY ERROR] Customer creation retry failed:", createErr);
            throw createErr;
          }
        }
      }
    } catch (err) {
      console.error("[RAZORPAY ERROR] Customer handling error:", err);
      return new NextResponse("Failed to process customer", { status: 500 });
    }

    try {
      // Create subscription with the obtained customerId
      console.log("[RAZORPAY DEBUG] Creating subscription with customer:", customerId);
      const subscription = await razorpay.subscriptions.create({
        plan_id: process.env.RAZORPAY_PLAN_ID,
        customer_id: customerId,
        total_count: 12, // 12 months subscription
        customer_notify: 1,
        notes: { 
          userId: session.user.id 
        },
      });
      
      console.log("[RAZORPAY DEBUG] Subscription created:", subscription.id);

      // Store customer ID in database if not already there
      if (!userSubscription?.razorpayCustomerId) {
        // Check if user subscription exists
        if (userSubscription) {
          await prisma.userSubscription.update({
            where: { userId: session.user.id },
            data: { razorpayCustomerId: customerId }
          });
        } else {
          await prisma.userSubscription.create({
            data: {
              userId: session.user.id,
              razorpayCustomerId: customerId,
              // Don't set subscription ID yet, will be updated by webhook
            }
          });
        }
      }

      // Return checkout data for frontend
      return NextResponse.json({
        checkoutSession: {
          key: process.env.RAZORPAY_KEY_ID,
          subscription_id: subscription.id,
          name: "Learning Journey Pro",
          description: "Unlimited course generation!",
          callback_url: `${process.env.NEXTAUTH_URL}/api/razorpay/callback`,
          redirect: true,
          prefill: {
            name: session.user.name,
            email: session.user.email,
            contact: "9999999999",
          },
        }
      });
    } catch (err) {
      console.error("[RAZORPAY ERROR] Subscription creation error:", err);
      if (err instanceof Error) {
        console.error("[RAZORPAY ERROR] Error message:", err.message);
      }
      return new NextResponse("Failed to create subscription", { status: 500 });
    }
  } catch (err) {
    console.error("[RAZORPAY ERROR] Full error:", err);
    if (err instanceof Error) {
      console.error("[RAZORPAY ERROR] Error message:", err.message);
      console.error("[RAZORPAY ERROR] Error stack:", err.stack);
    }
    return new NextResponse("Internal server error", { status: 500 });
  }
}