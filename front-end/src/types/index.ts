export type AvailableDatesResponse = { dates: string[] }

export type DeliveryWindowResponse = {
    id: string
    date: string
    start: string
    end: string
    cost: number
    capacity: number
    reserved: number
    remaining: number
    status: 'AVAILABLE' | 'SOLD_OUT'
}


export type CreateReservationRequest = { address: string; windowId: string }

export type CreateReservationResponse = {
    reservationId: string
    windowId: string
    zoneId: string
    createdAt: string
}

export type ApiError = { error?: string; message?: string; fields?: Record<string, string> }
