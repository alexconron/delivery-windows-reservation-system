package cl.walmart.delivery.infra.repository;

import cl.walmart.delivery.domain.model.DeliveryWindow;
import cl.walmart.delivery.domain.ports.DeliveryWindowRepository;

import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class InMemoryDeliveryWindowRepository implements DeliveryWindowRepository {

    private final Map<String, DeliveryWindow> byId = new ConcurrentHashMap<>();

    public InMemoryDeliveryWindowRepository(List<DeliveryWindow> initialWindows) {
        for (DeliveryWindow w : initialWindows) {
            byId.put(w.getId(), w);
        }
    }

    @Override
    public Optional<DeliveryWindow> findById(String windowId) {
        return Optional.ofNullable(byId.get(windowId));
    }

    @Override
    public List<DeliveryWindow> findAll() {
        return new ArrayList<>(byId.values());
    }

    @Override
    public List<DeliveryWindow> findByDate(LocalDate date) {
        return byId.values().stream()
                .filter(w -> w.getDate().equals(date))
                .sorted(Comparator.comparing(DeliveryWindow::getStart))
                .toList();
    }
}
