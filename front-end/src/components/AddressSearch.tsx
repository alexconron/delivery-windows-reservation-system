import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, MapPin, AlertCircle } from 'lucide-react'

interface AddressSearchProps {
    searchTerm: string
    setSearchTerm: (val: string) => void
    loading: boolean
    hasError: boolean
}

export function AddressSearch({ searchTerm, setSearchTerm, loading, hasError }: AddressSearchProps) {
    return (
        <Card className="border-none shadow-lg rounded-2xl bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-[#004f9a]">
                    <MapPin className="h-4 w-4" /> Dirección de Despacho
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
                <div className="relative">
                    <Input
                        placeholder="Comuna o calle..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border-slate-300 rounded-xl h-12 focus:ring-[#0071dc]"
                    />
                    {loading && (
                        <Loader2 className="absolute right-3 top-3.5 h-5 w-5 animate-spin text-slate-400" />
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
