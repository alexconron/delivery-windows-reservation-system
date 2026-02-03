import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, MapPin, Calendar, TrendingUp, AlertCircle, ShieldCheck } from 'lucide-react'
import { useAdminQueries } from '../hooks/useAdminQueries'
import { Badge } from '@/components/ui/badge'

export function AdminPage() {
    const [selectedDate, setSelectedDate] = useState<string>('2026-01-28')

    const { zones, results, isLoading } = useAdminQueries(selectedDate)

    const stats = results.reduce((acc, result) => {
        if (result.data) {
            result.data.forEach(w => {
                acc.totalCapacity += (w.capacity || 0) // Ensure w.capacity is available or fallback
                acc.totalReserved += w.reserved
                acc.totalRevenue += (w.reserved * w.cost)
            })
        }
        return acc
    }, { totalCapacity: 0, totalReserved: 0, totalRevenue: 0 })

    const occupancyRate = stats.totalCapacity > 0
        ? Math.round((stats.totalReserved / stats.totalCapacity) * 100)
        : 0

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <header className="mb-10 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                        <ShieldCheck className="h-8 w-8 text-[#0071dc]" />
                        Panel de Administración
                    </h1>
                    <p className="text-slate-500 mt-2">Gestión de cobertura y monitoreo de flota</p>
                </div>

                <div className="flex items-center gap-4 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                    <Calendar className="text-slate-400 h-5 w-5 ml-2" />
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="bg-transparent font-medium text-slate-700 outline-none"
                    />
                </div>
            </header>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <KpiCard
                    title="Cobertura Activa"
                    value={zones.length}
                    suffix=" Comunas"
                    icon={<MapPin className="h-5 w-5" />}
                    color="blue"
                />
                <KpiCard
                    title="Reservas Totales"
                    value={stats.totalReserved}
                    suffix=" Envíos"
                    icon={<Users className="h-5 w-5" />}
                    color="indigo"
                />
                <KpiCard
                    title="Ocupación Flota"
                    value={occupancyRate}
                    suffix="%"
                    icon={<TrendingUp className="h-5 w-5" />}
                    color={occupancyRate > 80 ? 'orange' : 'emerald'}
                />
                <KpiCard
                    title="Ingresos Estimados"
                    value={`$${stats.totalRevenue.toLocaleString()}`}
                    suffix=""
                    icon={<div className="font-serif font-bold">$</div>}
                    color="slate"
                />
            </div>

            {/* Zone Grid */}
            <h2 className="text-xl font-bold text-slate-800 mb-6">Detalle por Comuna</h2>
            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0071dc]"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {zones.map((zone, idx) => {
                        const query = results[idx]
                        const windows = query.data || []
                        const hasData = windows.length > 0

                        return (
                            <motion.div
                                key={zone}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                    <h3 className="font-bold text-lg text-slate-700">{zone}</h3>
                                    <Badge variant={hasData ? 'default' : 'secondary'} className={hasData ? 'bg-green-100 text-green-700 hover:bg-green-200' : ''}>
                                        {hasData ? 'Operativo' : 'Sin Servicio'}
                                    </Badge>
                                </div>
                                <div className="p-4 space-y-3">
                                    {hasData ? windows.map(w => (
                                        <div key={w.id} className="flex items-center justify-between text-sm p-3 rounded-xl bg-slate-50 border border-slate-100">
                                            <div className="font-medium text-slate-600">
                                                {w.start} - {w.end}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="text-right">
                                                    <div className="text-xs text-slate-400">Cupos</div>
                                                    <div className={`font-bold ${w.remaining === 0 ? 'text-red-500' : 'text-slate-700'}`}>
                                                        {w.remaining}/{w.capacity}
                                                    </div>
                                                </div>
                                                <div className="h-8 w-1 bg-slate-200 rounded-full relative overflow-hidden">
                                                    <div
                                                        className={`absolute bottom-0 w-full rounded-full ${w.remaining === 0 ? 'bg-red-500' : 'bg-[#0071dc]'}`}
                                                        style={{ height: `${(w.remaining / w.capacity) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="py-10 text-center text-slate-400 flex flex-col items-center">
                                            <AlertCircle className="h-8 w-8 mb-2 opacity-20" />
                                            <p className="text-xs">No hay ventanas programadas</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

function KpiCard({ title, value, suffix, icon, color }: any) {
    const colors: any = {
        blue: 'bg-blue-50 text-blue-600',
        indigo: 'bg-indigo-50 text-indigo-600',
        emerald: 'bg-emerald-50 text-emerald-600',
        orange: 'bg-orange-50 text-orange-600',
        slate: 'bg-slate-100 text-slate-600'
    }

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-slate-300 transition-colors">
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${colors[color] || colors.slate}`}>
                    {icon}
                </div>
            </div>
            <div>
                <p className="text-sm font-medium text-slate-400">{title}</p>
                <h3 className="text-2xl font-black text-slate-800 mt-1">
                    {value}<span className="text-lg text-slate-400 font-bold ml-1">{suffix}</span>
                </h3>
            </div>
        </div>
    )
}
