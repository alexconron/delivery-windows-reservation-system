package cl.walmart.delivery.web.controller;

import cl.walmart.delivery.app.service.ReservationAppService;
import cl.walmart.delivery.domain.ports.DeliveryWindowRepository;
import cl.walmart.delivery.domain.ports.ReservationRepository;
import cl.walmart.delivery.web.dto.DeliveryWindowResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * Controlador REST para recuperar el detalle de ventanas horarias.
 * <p>
 * Entrega la información detallada (horario, costo, disponibilidad) de las ventanas
 * para un día y ubicación específicos.
 * </p>
 */
@RestController
public class WindowsController {
    private final ReservationAppService reservationAppService;

    public WindowsController(ReservationAppService reservationAppService) {
        this.reservationAppService = reservationAppService;
    }

    /**
     * Endpoint: GET /api/windows
     * <p>
     * Obtiene el listado de ventanas de despacho para una fecha y dirección.
     * Calculando la disponibilidad en tiempo real según la zona de la dirección.
     * </p>
     *
     * @param address Dirección del cliente.
     * @param date    Fecha de despacho solicitada (formato ISO-8601: YYYY-MM-DD).
     * @return Lista de ventanas con su estado (AVAILABLE/SOLD_OUT), costo y capacidad restante.
     */
    @GetMapping("/api/windows")
    public List<DeliveryWindowResponse> windows(
            @RequestParam String address,
            @RequestParam String date
    ) {
        LocalDate parsedDate = LocalDate.parse(date, DateTimeFormatter.ISO_LOCAL_DATE);

        return reservationAppService.windowsForAddressAndDate(address, parsedDate).stream()
                .map(a -> new DeliveryWindowResponse(
                        a.window().getId(),
                        a.window().getDate().toString(),
                        a.window().getStart().toString(),
                        a.window().getEnd().toString(),
                        a.window().getCost(),
                        a.capacity(),
                        a.reserved(),
                        a.remaining(),
                        a.remaining() > 0 ? "AVAILABLE" : "SOLD_OUT"
                ))
                .toList();
    }


}
