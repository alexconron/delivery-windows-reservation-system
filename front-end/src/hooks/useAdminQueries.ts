import { useQueries } from '@tanstack/react-query'
import { api } from '../services/api'

const ZONES = ['Santiago', 'Providencia', 'Las Condes']

export function useAdminQueries(date: string) {
    const provinceQueries = useQueries({
        queries: ZONES.map((zone) => ({
            queryKey: ['windows', zone, date],
            queryFn: () => api.windows(zone, date),
            enabled: !!date,
            staleTime: 1000 * 60, // 1 minute
        })),
    })

    return {
        zones: ZONES,
        results: provinceQueries,
        isLoading: provinceQueries.some((q) => q.isLoading),
    }
}
