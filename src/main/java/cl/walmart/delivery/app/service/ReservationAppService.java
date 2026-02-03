package cl.walmart.delivery.app.service;

import cl.walmart.delivery.domain.model.DeliveryWindow;
import cl.walmart.delivery.domain.model.Reservation;
import cl.walmart.delivery.domain.model.WindowSoldOutException;
import cl.walmart.delivery.domain.ports.DeliveryWindowRepository;
import cl.walmart.delivery.domain.ports.ReservationRepository;
import cl.walmart.delivery.domain.ports.ZoneResolver;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.locks.ReentrantLock;

/**
 * Servicio de aplicación principal para la gestión de reservas de ventanas de despacho.
 * <p>
 * Este servicio orquesta la lógica de negocio, validando cobertura (zonas),
 * disponibilidad de fechas y cupos (capacidad), y gestionando la concurrencia
 * para garantizar la integridad de las reservas.
 * </p>
 */
public class ReservationAppService {


    private final DeliveryWindowRepository windowRepository;
    private final ReservationRepository reservationRepository;
    private final ZoneResolver zoneResolver;

    private final ConcurrentHashMap<String, ReentrantLock> locksByWindow = new ConcurrentHashMap<>();

    public ReservationAppService(
            DeliveryWindowRepository windowRepository,
            ReservationRepository reservationRepository,
            ZoneResolver zoneResolver
    ) {
        this.windowRepository = windowRepository;
        this.reservationRepository = reservationRepository;
        this.zoneResolver = zoneResolver;
    }

    /**
     * Obtiene el conjunto de fechas con al menos una ventana disponible para una dirección dada.
     *
     * @param address Dirección del cliente para determinar la zona de cobertura.
     * @return Set de fechas (LocalDate) que tienen cupos disponibles.
     * @throws IllegalArgumentException si la dirección no tiene cobertura (zona no identificada).
     */
    public Set<LocalDate> availableDatesForAddress(String address) {
        String zoneId = zoneResolver.resolveZoneIdFromAddress(address)
                .orElseThrow(() -> new IllegalArgumentException("Address without coverage"));

        return windowRepository.findAll().stream()
                .filter(w -> w.capacityForZone(zoneId) > 0)
                .map(DeliveryWindow::getDate)
                .collect(java.util.stream.Collectors.toSet());
    }

    /**
     * Intenta reservar una ventana de despacho para una dirección específica.
     * <p>
     * <b>Manejo de Concurrencia:</b>
     * Utiliza un bloqueo pesimista en memoria ({@link ReentrantLock}) por {@code windowId}.
     * Esto asegura que las validaciones de capacidad y la persistencia de la reserva
     * sean atómicas para una misma ventana, evitando condiciones de carrera (over-booking).
     * </p>
     *
     * @param address  Dirección del cliente.
     * @param windowId Identificador único de la ventana a reservar.
     * @return La reserva creada si la operación es exitosa.
     * @throws WindowSoldOutException   Si la ventana ya no tiene cupos para la zona.
     * @throws IllegalArgumentException Si la dirección no tiene cobertura o la ventana no existe.
     */
    public Reservation reserve(String address, String windowId) {
        String zoneId = zoneResolver.resolveZoneIdFromAddress(address)
                .orElseThrow(() -> new IllegalArgumentException("Address without coverage"));

        ReentrantLock lock = locksByWindow.computeIfAbsent(windowId, k -> new ReentrantLock());

        lock.lock();

        try {
            DeliveryWindow window = windowRepository.findById(windowId)
                    .orElseThrow(() -> new IllegalArgumentException("Window does not exists"));

            int maxCapacity = window.capacityForZone(zoneId);
            long used = reservationRepository.findByWindowId(windowId).stream()
                    .filter(r -> r.getZoneId().equals(zoneId))
                    .count();

            if (used >= maxCapacity) throw new WindowSoldOutException("Window sold out for the zone: " + zoneId);

            Reservation reservation = new Reservation(
                    UUID.randomUUID().toString(),
                    windowId,
                    zoneId,
                    Instant.now()
            );

            reservationRepository.save(reservation);

            return reservation;
        } finally {
            lock.unlock();
        }
    }

    public List<WindowAvailability> windowsForAddressAndDate(String address, LocalDate date) {
        String zoneId = zoneResolver.resolveZoneIdFromAddress(address)
                .orElseThrow(() -> new IllegalArgumentException("Address without coverage"));

        return windowRepository.findByDate(date).stream()
                .map(w -> {
                    int capacity = w.capacityForZone(zoneId);
                    long reserved = reservationRepository.findByWindowId(w.getId()).stream()
                            .filter(r -> r.getZoneId().equals(zoneId))
                            .count();

                    long remaining = Math.max(0, capacity - reserved);
                    return new WindowAvailability(w, capacity, reserved, remaining);
                })
                .toList();
    }


    public record WindowAvailability(
            cl.walmart.delivery.domain.model.DeliveryWindow window,
            int capacity,
            long reserved,
            long remaining
            long remaining
    ) {
    }
}