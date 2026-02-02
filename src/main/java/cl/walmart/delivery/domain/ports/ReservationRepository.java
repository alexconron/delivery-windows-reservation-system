package cl.walmart.delivery.domain.ports;

import cl.walmart.delivery.domain.model.Reservation;

import java.util.List;

public interface ReservationRepository {
    List<Reservation> findByWindowId(String windowId);
    void save(Reservation reservation);
}
