import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SearchX } from 'lucide-react'


import { useDeliveryQuery } from '../hooks/useDeliveryQuery'
import { AddressSearch } from '../components/AddressSearch'
import { DateSelector } from '../components/DateSelector'
import { DeliveryWindowCard } from '../components/DeliveryWindowCard'

export function ReservationPage() {
    // Estados para el Debounce (Freeze de consulta)
    // Default to 'Santiago' as per user requirement (it seems) or better, let it be empty?
    // User wants a dropdown now.
    const [searchTerm, setSearchTerm] = useState('Santiago')
    const [debouncedAddress, setDebouncedAddress] = useState(searchTerm)
    const [selectedDate, setSelectedDate] = useState<string>('')

    // Lógica de Debounce
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedAddress(searchTerm)
            setSelectedDate('') // Reiniciar fecha si cambia la dirección
        }, 500)
        return () => clearTimeout(handler)
    }, [searchTerm])

    const { datesQuery, windowsQuery, reserveMutation } = useDeliveryQuery(debouncedAddress, selectedDate)

    const loadingDates = datesQuery.isLoading
    const isError = datesQuery.isError
    const datesData = datesQuery.data
    const windows = windowsQuery.data

    return (
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Panel lateral: Configuración  */}
            <div className="lg:col-span-4 space-y-6">
                <AddressSearch
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    loading={loadingDates}
                    hasError={isError}
                />

                {/* Lista de Fechas */}
                {!isError && datesData?.dates && (
                    <DateSelector
                        dates={datesData.dates}
                        selectedDate={selectedDate}
                        onSelect={setSelectedDate}
                    />
                )}
            </div>

            {/* Área Principal: Ventanas Horarias */}
            <div className="lg:col-span-8 space-y-4">
                <AnimatePresence mode="wait">
                    {!selectedDate ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-300 text-slate-400"
                        >
                            <SearchX className="h-16 w-16 mb-4 opacity-10" />
                            <p className="font-semibold italic">Selecciona una fecha para ver horarios</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="grid"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid gap-4"
                        >
                            {windows?.map((w) => (
                                <DeliveryWindowCard
                                    key={w.id}
                                    window={w}
                                    onReserve={(id) => reserveMutation.mutate(id)}
                                    isPending={reserveMutation.isPending}
                                    pendingId={reserveMutation.variables}
                                />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
