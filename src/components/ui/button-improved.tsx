
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98] shadow-sm",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:scale-[0.98] shadow-sm",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground active:scale-[0.98]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-[0.98]",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-green-600 text-white hover:bg-green-700 active:scale-[0.98] shadow-sm",
        warning: "bg-amber-500 text-white hover:bg-amber-600 active:scale-[0.98] shadow-sm",
        subtle: "bg-muted/50 text-foreground hover:bg-muted active:scale-[0.98]",
        neon: "bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white shadow-lg shadow-purple-500/20 active:scale-[0.98]",
        glass: "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 active:scale-[0.98]",
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
      hasAnimation: {
        true: "transition-transform hover:-translate-y-0.5",
        false: "",
      }
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
      {
        isLoading: true,
        variant: "neon",
        className: "bg-gradient-to-r from-purple-600/80 to-violet-600/80",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      isLoading: false,
      hasAnimation: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  hasAnimation?: boolean;
}

const ButtonImproved = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, loadingText, hasAnimation, children, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    // تأثير الضغط على الزر
    const [isPressed, setIsPressed] = React.useState(false);
    
    const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsPressed(true);
      props.onMouseDown?.(e);
    };
    
    const handleMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
      setTimeout(() => setIsPressed(false), 300);
      props.onMouseUp?.(e);
    };
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      // إضافة تأثير صوتي بسيط (اختياري)
      if (typeof window !== 'undefined' && window.navigator?.vibrate) {
        window.navigator.vibrate(50); // يعمل فقط على الأجهزة المحمولة المدعومة
      }
      
      props.onClick?.(e);
    };
    
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, isLoading, hasAnimation, className }),
          isPressed ? 'btn-ripple' : '',
          'relative overflow-hidden'
        )}
        ref={ref}
        disabled={props.disabled || isLoading}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onClick={handleClick}
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
