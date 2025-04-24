import { getAuthSession } from "./auth";
import { prisma } from "./db";
import { razorpay } from "./razorpay";

const DAY_IN_MS = 1000 * 60 * 60 * 24;

async function updateSubscriptionStatus(userId: string) {
  const userSubscription = await prisma.userSubscription.findUnique({
    where: { userId },
  });

  if (!userSubscription?.razorpaySubscriptionId) {
    return false;
  }

  try {
    const subscription = await razorpay.subscriptions.fetch(userSubscription.razorpaySubscriptionId);
    
    if (!subscription.current_end) {
      return false;
    }

    await prisma.userSubscription.update({
      where: { userId },
      data: {
        razorpayCurrentPeriodEnd: new Date(subscription.current_end * 1000),
        isPro: subscription.status === 'active',
      },
    });

    return true;
  } catch (err) {
    console.error("[SUBSCRIPTION] Error updating subscription status:", err);
    return false;
  }
}

export async function checkSubscription() {
  const session = await getAuthSession();

  if (!session?.user) {
    throw new Error("User not found");
  }

  const userSubscription = await prisma.userSubscription.findUnique({
    where: {
      userId: session.user.id,
    },
  });

  if (!userSubscription) {
    return false;
  }

  // If currentPeriodEnd is null, try to update the subscription status
  if (!userSubscription.razorpayCurrentPeriodEnd) {
    await updateSubscriptionStatus(session.user.id);
    // Fetch the updated subscription
    const updatedSubscription = await prisma.userSubscription.findUnique({
      where: {
        userId: session.user.id,
      },
    });
    if (updatedSubscription) {
      userSubscription.razorpayCurrentPeriodEnd = updatedSubscription.razorpayCurrentPeriodEnd;
      userSubscription.isPro = updatedSubscription.isPro;
    }
  }

  console.log('Raw subscription details:', userSubscription);
  console.log('Processed subscription details:', {
    isPro: userSubscription.isPro,
    isProType: typeof userSubscription.isPro,
    currentPeriodEnd: userSubscription.razorpayCurrentPeriodEnd,
    currentDate: new Date()
  });

  // If isPro is null or undefined, treat it as false
  const isPro = Boolean(userSubscription.isPro);

  const isValid =
    isPro &&
    userSubscription.razorpayCurrentPeriodEnd &&
    userSubscription.razorpayCurrentPeriodEnd > new Date();

  console.log('Final validation:', {
    isPro,
    isValid,
    hasEndDate: !!userSubscription.razorpayCurrentPeriodEnd,
    endDateValid: userSubscription.razorpayCurrentPeriodEnd ? userSubscription.razorpayCurrentPeriodEnd > new Date() : false
  });

  return isPro;
}

