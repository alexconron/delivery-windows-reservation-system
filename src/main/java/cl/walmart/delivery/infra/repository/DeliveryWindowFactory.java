package cl.walmart.delivery.infra.repository;

import cl.walmart.delivery.domain.model.DeliveryWindow;

import java.time.LocalDate;
import java.time.LocalTime;

public class DeliveryWindowFactory {

    public DeliveryWindow toDomain(DeliveryWindowJsonRecord record) {
        int windowCost = record.cost == null ? 0 : record.cost;

        return new DeliveryWindow(
                record.id,
                LocalDate.parse(record.date),
                LocalTime.parse(record.start),
                LocalTime.parse(record.end),
                windowCost,
                record.capacityByZone
        );
    }
}
