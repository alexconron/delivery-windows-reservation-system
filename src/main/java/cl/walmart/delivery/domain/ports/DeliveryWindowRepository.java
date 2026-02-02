package cl.walmart.delivery.domain.ports;

import cl.walmart.delivery.domain.model.DeliveryWindow;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DeliveryWindowRepository {

    Optional<DeliveryWindow> findById(String windowId);
    List<DeliveryWindow> findAll();
    List<DeliveryWindow> findByDate(LocalDate date);
}
