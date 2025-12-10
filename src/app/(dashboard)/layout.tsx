import { DashboardHeader } from '@/components/layout/DashboardHeader'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <DashboardHeader />
            <main className="flex-1 container mx-auto p-4 md:p-6 lg:p-8 animate-in fade-in duration-500">
                {children}
            </main>
        </div>
    )
}
