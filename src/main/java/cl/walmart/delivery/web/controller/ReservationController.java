package cl.walmart.delivery.web.controller;

import cl.walmart.delivery.app.service.ReservationAppService;
import cl.walmart.delivery.domain.model.Reservation;
import cl.walmart.delivery.web.dto.CreateReservationRequest;
import cl.walmart.delivery.web.dto.CreateReservationResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ReservationController {
    private final ReservationAppService reservationAppService;

    public ReservationController(ReservationAppService reservationAppService) {
        this.reservationAppService = reservationAppService;
    }

    @PostMapping("/api/reservations")
    public CreateReservationResponse reserve(@Valid @RequestBody CreateReservationRequest request) {

        Reservation reservation = reservationAppService.reserve(
                request.address(),
                request.windowId()
        );

        return new CreateReservationResponse(
                reservation.getId(),
                reservation.getWindowId(),
                reservation.getZoneId(),
                reservation.getCreatedAt().toString()
        );
    }
}

