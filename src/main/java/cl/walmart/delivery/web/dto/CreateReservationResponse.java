package cl.walmart.delivery.web.dto;

public record CreateReservationResponse(
    String reservationId,
    String windowId,
    String zoneId,
    String createdAt
) { }
