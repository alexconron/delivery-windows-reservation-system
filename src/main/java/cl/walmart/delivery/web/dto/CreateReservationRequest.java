package cl.walmart.delivery.web.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateReservationRequest(
        @NotBlank String address,
        @NotBlank String windowId
        ) { }
