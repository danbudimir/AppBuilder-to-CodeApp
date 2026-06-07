import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="skeleton" className={cn("bg-accent animate-pulse rounded-md", className)} {...props} data-pa-control-id="src/components/ui/skeleton.tsx:5:5-9:7"/>
  )
}

export { Skeleton }

