import React from "react";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";

const SignInButton = () => {
    console.log("Button Rendered");
  return <Button className="cursor-pointer" onClick={() => signIn("google")}>Sign In</Button>;
};

export default SignInButton;
