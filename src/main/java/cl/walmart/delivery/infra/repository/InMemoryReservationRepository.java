package cl.walmart.delivery.infra.repository;

import cl.walmart.delivery.domain.model.Reservation;
import cl.walmart.delivery.domain.ports.ReservationRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class InMemoryReservationRepository implements ReservationRepository {
    private final Map<String, List<Reservation>> reservationsByWindow = new ConcurrentHashMap<>();

    @Override
    public List<Reservation> findByWindowId(String windowId) {
        return reservationsByWindow.getOrDefault(windowId, List.of());
    }

    @Override
    public void save(Reservation reservation) {
        reservationsByWindow
            .computeIfAbsent(reservation.getWindowId(), k -> new ArrayList<>())
            .add(reservation);
    }

}
