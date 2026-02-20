import { cn } from "@/lib/utils"

export const DashboardPage = ({ className, children }: { className?: string, children: React.ReactNode }) => {
    return (
        <div className={cn("p-4", className)}>
            {children}
        </div>
    )
}