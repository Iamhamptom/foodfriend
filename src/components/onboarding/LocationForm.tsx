import { MapPin } from 'lucide-react'

interface LocationFormProps {
    data: any
    updateData: (data: any) => void
}

export function LocationForm({ data, updateData }: LocationFormProps) {
    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold">Where are you located?</h2>
                <p className="text-muted-foreground">
                    We need this to find stores and prices near you.
                </p>
            </div>

            <div className="space-y-4">
                <div className="grid gap-2">
                    <label htmlFor="city" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        City / Area
                    </label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                            id="city"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="e.g. Cape Town, Sea Point"
                            value={data.location_city || ''}
                            onChange={(e) => updateData({ ...data, location_city: e.target.value })}
                            autoFocus
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
