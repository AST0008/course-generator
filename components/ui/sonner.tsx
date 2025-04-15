"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps, toast } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }

export const notify = ({
  title,
  description,
  variant = "default",
}: {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
}) => {
  const variantClasses =
    variant === "destructive" ? "text-destructive" : "text-default";

  toast(
    <div
      className={`toast-content bg-${
        variant === "destructive" ? "destructive" : "success"
      } ${variantClasses}`}
    >
      <strong className="font-semibold">{title}</strong>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </div>
  );
};
