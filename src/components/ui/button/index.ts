import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

export { default as Button } from "./Button.vue";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:brightness-110 hover:saturate-110 focus-visible:ring-primary/40",
        secondary:
          "border bg-background hover:bg-muted text-foreground focus-visible:ring-primary/30",
        outline:
          "border border-input bg-background shadow-sm hover:bg-muted/50 hover:border-border focus-visible:ring-primary/30 hover:shadow-md hover:translate-y-[1px] active:translate-y-[2px] transition-all",
        ghost: "hover:bg-muted/60 focus-visible:ring-primary/30",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:brightness-110 focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:opacity-80 focus-visible:ring-transparent",
      },
      size: {
        default: "h-9 px-4 py-2",
        xs: "h-7 rounded px-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;
