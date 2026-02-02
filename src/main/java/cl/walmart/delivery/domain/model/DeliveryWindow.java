package cl.walmart.delivery.domain.model;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collections;
import java.util.Map;

/**
 * Representa una Ventana de Despacho (bloque horario).
 * <p>
 * Define el horario, costo y capacidad por zona. Es una entidad inmutable
 * que actúa como la definición del "producto" disponible para reserva.
 * </p>
 */
public final class DeliveryWindow {

    private final String id;
    private final LocalDate date;
    private final LocalTime start;
    private final LocalTime end;
    private final int cost;
    private final Map<String, Integer> capacityByZone;

    public DeliveryWindow(
            String id,
            LocalDate date,
            LocalTime start,
            LocalTime end,
            int cost,
            Map<String, Integer> capacityByZone
    ) {
        if (id == null || id.isBlank()) throw new IllegalArgumentException("window.id is required");
        if (date == null) throw new IllegalArgumentException("window.date is required");
        if (start == null || end == null) throw new IllegalArgumentException("window.start/end is required");
        if (!start.isBefore(end)) throw new IllegalArgumentException("window.start MUST be before window.end");
        if (cost < 0) throw new IllegalArgumentException("window.cost can NOT be negative");
        if (capacityByZone == null) throw new IllegalArgumentException("capacityByZone is required");

        this.id = id;
        this.date = date;
        this.start = start;
        this.end = end;
        this.cost = cost;
        this.capacityByZone = Collections.unmodifiableMap(capacityByZone);
    }

    public String getId() {
        return id;
    }

    public LocalDate getDate() {
        return date;
    }

    public LocalTime getStart() {
        return start;
    }

    public LocalTime getEnd() {
        return end;
    }

    public int getCost() {
        return cost;
    }

    public int capacityForZone(String zoneId) {
        return capacityByZone.getOrDefault(zoneId, 0);
    }
}
