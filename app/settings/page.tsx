import { useSession } from "next-auth/react";
import { checkSubscription } from "@/lib/subscription";
import Navbar from "@/components/Navbar";
import { getAuthSession } from "@/lib/auth";
import SubscriptionButton from "@/components/SubscriptionButton";
import { redirect } from "next/navigation";

const SettingsPage = async () => {
    const session = await getAuthSession();
    if (!session?.user) {
        redirect("/api/auth/signin")
    }
  const isPro = await checkSubscription();
  console.log('isPro', isPro)
  return (
    <>
      <Navbar session={session} />
      <div className="py-8 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold leading-7   sm:text-4xl ">
          Settings
        </h1>
        {isPro ? (
          <div className="mt-8 max-w-md">
            <p className="text-xl text-secondary-foreground/90">
              You are currently on the Pro plan.
            </p>
          </div>
        ) : (
          <div className="mt-8 max-w-md">
            <p className="text-xl text-secondary-foreground/90">
              You are currently on the Free plan.
            </p>
            <SubscriptionButton isPro={isPro ?? false} />
          </div>
        )}
      </div>
    </>
  );
};

export default SettingsPage;
