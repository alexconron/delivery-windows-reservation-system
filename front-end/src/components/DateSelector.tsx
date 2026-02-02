import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'

interface DateSelectorProps {
    dates: string[]
    selectedDate: string
    onSelect: (date: string) => void
}

export function DateSelector({ dates, selectedDate, onSelect }: DateSelectorProps) {
    if (!dates?.length) return null

    return (
        <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Fechas disponibles</h3>
            <div className="flex flex-col gap-2">
                {dates.map(date => (
                    <Button
                        key={date}
                        variant={selectedDate === date ? "default" : "outline"}
                        onClick={() => onSelect(date)}
                        className={`justify-between h-14 rounded-xl font-bold transition-all ${selectedDate === date ? "bg-[#0071dc] shadow-md" : "bg-white border-slate-200"
                            }`}
                    >
                        {date}
                        <ChevronRight className={`h-4 w-4 ${selectedDate === date ? "opacity-100" : "opacity-30"}`} />
                    </Button>
                ))}
            </div>
        </div>
    )
}
