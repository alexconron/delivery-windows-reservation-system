import type { AvailableDatesResponse, DeliveryWindowResponse, CreateReservationRequest, CreateReservationResponse, ApiError } from '@/types'

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
    const res = await fetch(url, init)
    const text = await res.text()

    let data: any = null
    try {
        data = text ? JSON.parse(text) : null
    } catch {
        data = text ? { message: text } : null
    }

    if (!res.ok) {
        throw { status: res.status, data } as { status: number; data: ApiError }
    }
    return data as T
}

export const api = {
    availableDates: (address: string) =>
        requestJson<AvailableDatesResponse>(`/api/availability/dates?address=${encodeURIComponent(address)}`),

    windows: (address: string, date: string) =>
        requestJson<DeliveryWindowResponse[]>(
            `/api/windows?address=${encodeURIComponent(address)}&date=${encodeURIComponent(date)}`
        ),

    reserve: (body: CreateReservationRequest) =>
        requestJson<CreateReservationResponse>('/api/reservations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        }),
}
