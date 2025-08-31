import { cn } from "@/lib/utils";

export default function DashboardPage({ children, className }: { children: React.ReactNode, className?: string }) {
    return <div className={cn('', className)}>
        {children}
    </div>
}