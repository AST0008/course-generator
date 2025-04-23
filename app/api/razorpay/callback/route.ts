import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { razorpay } from "@/lib/razorpay";

export async function GET() {
  try {
    const session = await getAuthSession();
    
    if (!session?.user) {
      return NextResponse.redirect(new URL("/sign-in", process.env.NEXTAUTH_URL!));
    }
    
    // Redirect to settings page
    return NextResponse.redirect(new URL("/settings", process.env.NEXTAUTH_URL!));
  } catch (err) {
    console.error("[RAZORPAY CALLBACK] Error:", err);
    return NextResponse.redirect(new URL("/settings?error=payment", process.env.NEXTAUTH_URL!));
  }
}