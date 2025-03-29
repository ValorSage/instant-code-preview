
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:scale-[0.98]",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground active:scale-[0.98]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-[0.98]",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-green-600 text-white hover:bg-green-700 active:scale-[0.98]",
        warning: "bg-amber-500 text-white hover:bg-amber-600 active:scale-[0.98]",
        subtle: "bg-muted/50 text-foreground hover:bg-muted active:scale-[0.98]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        xl: "h-12 rounded-md px-10 text-base",
      },
      isLoading: {
        true: "relative text-transparent transition-none hover:text-transparent disabled:cursor-wait",
        false: "",
      },
    },
    compoundVariants: [
      {
        isLoading: true,
        variant: "default",
        className: "bg-primary/80",
      },
      {
        isLoading: true,
        variant: "destructive",
        className: "bg-destructive/80",
      },
      {
        isLoading: true,
        variant: "success",
        className: "bg-green-600/80",
      },
      {
        isLoading: true,
        variant: "warning",
        className: "bg-amber-500/80",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      isLoading: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  loadingText?: string;
}

const ButtonImproved = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, loadingText, children, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, isLoading, className }))}
        ref={ref}
        disabled={props.disabled || isLoading}
        {...props}
      >
        <>
          {children}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-4 w-4 animate-spin" />
              {loadingText && <span className="ms-2 text-foreground">{loadingText}</span>}
            </div>
          )}
        </>
      </Comp>
    );
  }
);
ButtonImproved.displayName = "ButtonImproved";

export { ButtonImproved, buttonVariants };
