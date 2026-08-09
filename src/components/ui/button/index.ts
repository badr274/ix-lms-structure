import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"

export { default as Button } from "./Button.vue"

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[24px] font-ibm font-medium transition-all duration-150 cursor-pointer select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary/20 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 shadow-xs focus-visible:ring-destructive/20",
        outline:
          "border border-border bg-background hover:bg-muted text-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-muted hover:text-foreground rounded-xl",
        link:
          "text-primary underline-offset-4 hover:underline",
      },
      size: {
        "default": "h-[48px] px-6 py-2 text-[14px] rounded-[24px]",
        "xs": "h-7 gap-1 rounded-[14px] px-2.5 text-xs",
        "sm": "h-[38px] rounded-[20px] gap-1.5 px-4 text-xs",
        "lg": "h-[52px] rounded-[26px] px-8 text-[15px] font-semibold",
        "icon": "size-10 rounded-full",
        "icon-xs": "size-7 rounded-full",
        "icon-sm": "size-8 rounded-full",
        "icon-lg": "size-12 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)
export type ButtonVariants = VariantProps<typeof buttonVariants>
