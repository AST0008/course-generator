"use client";

import { useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Zap } from "lucide-react";
const SubscriptionAction = () => {
  const { data } = useSession();

  return (
    <div className="flex flex-col bg-grey-700 items-center justify-center w-1/2 p-4 mx-auto mt-8 rounded-lg border border-secondary/20">
      {data?.user?.credits} / 10 Free Generations Left
      <Progress
        className="mt-2"
        value={data?.user?.credits ? (data?.user?.credits / 10) * 100 : 0}
      />
      <Button
        className="mt-3 font-bold cursor-pointer text-white transition-all duration-300 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
        variant="outline"
      >
        Upgrade <Zap className="w-4 fill-white h-4 ml-2" />
      </Button>
    </div>
  );
};

export default SubscriptionAction;
