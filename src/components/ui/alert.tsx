
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pr-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        success:
          "border-green-500/50 text-green-600 dark:text-green-400 dark:border-green-500/50 [&>svg]:text-green-600 dark:bg-green-500/10",
        warning:
          "border-amber-500/50 text-amber-600 dark:text-amber-400 dark:border-amber-500/50 [&>svg]:text-amber-600 dark:bg-amber-500/10",
        info:
          "border-blue-500/50 text-blue-600 dark:text-blue-400 dark:border-blue-500/50 [&>svg]:text-blue-600 dark:bg-blue-500/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  icon?: React.ReactNode;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, icon, children, ...props }, ref) => {
    const getDefaultIcon = () => {
      if (!icon) {
        switch (variant) {
          case "success":
            return <CheckCircle className="h-5 w-5" />;
          case "destructive":
            return <AlertCircle className="h-5 w-5" />;
          case "warning":
            return <AlertTriangle className="h-5 w-5" />;
          case "info":
            return <Info className="h-5 w-5" />;
          default:
            return null;
        }
      }
      return icon;
    };
    
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          alertVariants({ variant }),
          "animate-in fade-in-50 duration-300",
          className
        )}
        {...props}
      >
        {getDefaultIcon()}
        {children}
      </div>
    );
  }
)
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
