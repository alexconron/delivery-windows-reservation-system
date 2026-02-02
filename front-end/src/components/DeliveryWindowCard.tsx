import { motion } from 'framer-motion'
import { Clock, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { DeliveryWindowResponse } from '@/types'

interface DeliveryWindowCardProps {
    window: DeliveryWindowResponse
    onReserve: (id: string) => void
    isPending: boolean
    pendingId?: string
}

export function DeliveryWindowCard({ window: w, onReserve, isPending, pendingId }: DeliveryWindowCardProps) {
    const soldOut = w.remaining <= 0

    return (
        <motion.div
            layout
            className={`group bg-white rounded-3xl border p-6 transition-all relative overflow-hidden ${soldOut ? 'opacity-50 grayscale bg-slate-50' : 'border-slate-200 hover:border-[#0071dc] hover:shadow-xl'
                }`}
        >
            <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-6">
                    <div className={`p-4 rounded-2xl ${soldOut ? 'bg-slate-200' : 'bg-[#e7f3ff] text-[#0071dc]'}`}>
                        <Clock className="h-8 w-8" />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-[#2e2f32]">{w.start} - {w.end}</p>
                        <div className="flex items-center gap-3 mt-1">
                            <Badge className="bg-[#ffc220] text-[#004f9a] font-bold border-none h-6">
                                ${w.cost.toLocaleString()}
                            </Badge>
                            <span className={`text-sm font-bold ${w.remaining < 3 && !soldOut ? 'text-orange-600' : 'text-slate-500'}`}>
                                {soldOut ? 'AGOTADO' : `${w.remaining} cupos disponibles`}
                            </span>
                        </div>
                    </div>
                </div>

                <Button
                    disabled={soldOut || isPending}
                    onClick={() => onReserve(w.id)}
                    className={`rounded-full px-10 h-14 text-lg font-black transition-all ${soldOut ? "bg-slate-300" : "bg-[#0071dc] hover:bg-[#004f9a] text-white shadow-lg shadow-blue-100"
                        }`}
                >
                    {isPending && pendingId === w.id ? (
                        <Loader2 className="animate-spin h-6 w-6" />
                    ) : (
                        soldOut ? 'AGOTADO' : 'RESERVAR'
                    )}
                </Button>
            </div>

            {!soldOut && (
                <div className="absolute bottom-0 left-0 h-2 w-full bg-slate-100">
                    <motion.div
                        initial={false}
                        animate={{ width: `${(w.remaining / w.capacity) * 100}%` }}
                        className={`h-full ${w.remaining < 3 ? 'bg-orange-500' : 'bg-[#0071dc]'}`}
                    />
                </div>
            )}
        </motion.div>
    )
}
