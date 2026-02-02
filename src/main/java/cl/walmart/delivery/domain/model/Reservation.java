package cl.walmart.delivery.domain.model;

import java.time.Instant;

public final class Reservation {

    private final String id;
    private final String windowId;
    private final String zoneId;
    private final Instant createdAt;

    public Reservation(String id, String windowId, String zoneId, Instant createdAt) {
        if (id == null || id.isBlank()) throw new IllegalArgumentException("reservation.id is required");
        if (windowId == null || windowId.isBlank()) throw new IllegalArgumentException("reservation.windowId is required");
        if (zoneId == null || zoneId.isBlank()) throw new IllegalArgumentException("reservation.zoneId is required");
        if (createdAt == null) throw new IllegalArgumentException("reservation.createdAt is required");
        this.id = id;
        this.windowId = windowId;
        this.zoneId = zoneId;
        this.createdAt = createdAt;
    }

    public String getId() {
        return id;
    }

    public String getWindowId() {
        return windowId;
    }

    public String getZoneId() {
        return zoneId;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
