import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, MapPin, AlertCircle, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface AddressSearchProps {
    searchTerm: string
    setSearchTerm: (val: string) => void
    loading: boolean
    hasError: boolean
}

const PREDEFINED_ZONES = ['Santiago', 'Providencia', 'Las Condes']

export function AddressSearch({ searchTerm, setSearchTerm, loading, hasError }: AddressSearchProps) {
    const [isManual, setIsManual] = useState(false)

    // Sync manual mode if searchTerm implies it (e.g. loaded from URL or init)
    useEffect(() => {
        if (searchTerm && !PREDEFINED_ZONES.includes(searchTerm) && searchTerm !== 'CUSTOM') {
            setIsManual(true)
        } else if (PREDEFINED_ZONES.includes(searchTerm)) {
            setIsManual(false)
        }
    }, [])

    const handleSelectChange = (val: string) => {
        if (val === 'CUSTOM') {
            setIsManual(true)
            setSearchTerm('')
        } else {
            setSearchTerm(val)
            setIsManual(false)
        }
    }

    const clearManual = () => {
        setIsManual(false)
        setSearchTerm('Santiago') // Default back to first option or empty?
    }

    return (
        <Card className="border-none shadow-lg rounded-2xl bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-[#004f9a]">
                    <MapPin className="h-4 w-4" /> Dirección de Despacho
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
                <div className="relative">
                    {isManual ? (
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Input
                                    placeholder="Ingresa tu comuna..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="border-slate-300 rounded-xl h-12 focus:ring-[#0071dc] pr-10"
                                    autoFocus
                                />
                                {loading && (
                                    <Loader2 className="absolute right-3 top-3.5 h-5 w-5 animate-spin text-slate-400" />
                                )}
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={clearManual}
                                className="h-12 w-12 rounded-xl border-slate-300 text-slate-500 hover:bg-slate-50"
                                title="Volver a la lista"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                    ) : (
                        <div className="relative">
                            <Select
                                value={PREDEFINED_ZONES.includes(searchTerm) ? searchTerm : ""}
                                onValueChange={handleSelectChange}
                            >
                                <SelectTrigger className="w-full h-12 rounded-xl border-slate-300 bg-white text-base focus:ring-[#0071dc]">
                                    <SelectValue placeholder="Selecciona una comuna" />
                                </SelectTrigger>
                                <SelectContent>
                                    {PREDEFINED_ZONES.map((z) => (
                                        <SelectItem key={z} value={z} className="py-3 text-base">
                                            {z}
                                        </SelectItem>
                                    ))}
                                    <SelectItem value="CUSTOM" className="py-3 text-base text-slate-500 italic border-t mt-1">
                                        Otra comuna...
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {loading && (
                                <Loader2 className="absolute right-10 top-3.5 h-5 w-5 animate-spin text-slate-400 pointer-events-none" />
                            )}
                        </div>
                    )}
                </div>

                {hasError && (
                    <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-900 rounded-xl">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-xs font-medium uppercase">
                            Sin cobertura para esta zona
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    )
}
