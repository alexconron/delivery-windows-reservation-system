package cl.walmart.delivery.web.controller;

import cl.walmart.delivery.app.service.ReservationAppService;
import cl.walmart.delivery.web.dto.AvailableDatesResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.format.DateTimeFormatter;

/**
 * Controlador REST para consultar días con disponibilidad.
 * <p>
 * Permite a los clientes saber qué días tienen al menos una ventana disponible
 * para su ubicación antes de consultar los detalles de horarios.
 * </p>
 */
@RestController
public class AvailabilityController {

    private final ReservationAppService reservationAppService;

    public AvailabilityController(ReservationAppService reservationAppService){
        this.reservationAppService = reservationAppService;
    }

    /**
     * Endpoint: GET /api/availability/dates
     * <p>
     * Recupera una lista de fechas (ISO-8601) donde existe capacidad de despacho
     * para la dirección indicada.
     * </p>
     *
     * @param address Dirección del cliente (ej. "Monjitas 500").
     * @return Respuesta con la lista de fechas disponibles ordenadas cronológicamente.
     */
    @GetMapping("/api/availability/dates")
    public AvailableDatesResponse availableDatesResponse(@RequestParam String address) {
        var formatter = DateTimeFormatter.ISO_LOCAL_DATE;

        var dates = reservationAppService.availableDatesForAddress(address).stream()
                .sorted()
                .map(formatter::format)
                .toList();

        return new AvailableDatesResponse(dates);
    }
}
