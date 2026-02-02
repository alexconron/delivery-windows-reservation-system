import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../services/api'
import { toast } from 'sonner'
import { mapBusinessError } from '@/errors'

export function useDeliveryQuery(address: string, date: string) {
    const queryClient = useQueryClient()

    const datesQuery = useQuery({
        queryKey: ['dates', address],
        queryFn: () => api.availableDates(address),
        enabled: address.length >= 3,
        retry: false,
    })

    const windowsQuery = useQuery({
        queryKey: ['windows', address, date],
        queryFn: () => api.windows(address, date),
        enabled: !!date && !datesQuery.isError,
        retry: false,
        staleTime: 0,
        refetchInterval: 1500,
        refetchIntervalInBackground: true,
        refetchOnWindowFocus: true,
    })

    const reserveMutation = useMutation({
        mutationFn: (windowId: string) =>
            api.reserve({ address: address.trim(), windowId }),

        onSuccess: async () => {
            toast.success('Reserva confirmada')
            await queryClient.invalidateQueries({
                queryKey: ['windows', address, date],
            })
        },

        onError: async (err: any) => {
            const status = err?.status
            const uiError = mapBusinessError(status)
            toast.error(uiError.title, {
                description: uiError.description,
            })

            await queryClient.invalidateQueries({
                queryKey: ['windows', address, date],
            })
        },
    })

    return {
        datesQuery,
        windowsQuery,
        reserveMutation,
    }
}
