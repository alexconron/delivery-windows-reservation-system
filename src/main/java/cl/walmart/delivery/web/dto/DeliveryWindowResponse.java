package cl.walmart.delivery.web.dto;

public record DeliveryWindowResponse(
        String id,
        String date,
        String start,
        String end,
        int cost,
        int capacity,
        long reserved,
        long remaining,
        String status
) { }
