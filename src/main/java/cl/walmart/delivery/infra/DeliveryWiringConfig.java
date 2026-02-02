package cl.walmart.delivery.infra;

import cl.walmart.delivery.app.service.ReservationAppService;
import cl.walmart.delivery.domain.model.DeliveryWindow;
import cl.walmart.delivery.domain.ports.DeliveryWindowRepository;
import cl.walmart.delivery.domain.ports.ReservationRepository;
import cl.walmart.delivery.domain.ports.ZoneResolver;
import cl.walmart.delivery.infra.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;
import java.util.Map;


@Configuration
public class DeliveryWiringConfig {

    @Bean
    public DeliveryWindowRepository deliveryWindowRepository(ObjectMapper objectMapper) {
        DeliveryWindowJsonLoader loader = new DeliveryWindowJsonLoader(objectMapper);
        DeliveryWindowFactory factory = new DeliveryWindowFactory();

        List<DeliveryWindowJsonRecord> records = loader.loadFromClasspath("data/windows-slots.json");
        List<DeliveryWindow> windows = records.stream().map(factory::toDomain).toList();

        return new InMemoryDeliveryWindowRepository(windows);
    }

    @Bean
    public ReservationRepository reservationRepository() {
        return new InMemoryReservationRepository();
    }

    @Bean
    public ZoneResolver zoneResolver() {
        return new StaticZoneResolver(Map.of(
            "santiago", "zone-1",
            "providencia", "zone-2",
            "las condes", "zone-3"
        ));
    }

    @Bean
    public ReservationAppService reservationAppService(
        DeliveryWindowRepository deliveryWindowRepository,
        ReservationRepository reservationRepository,
        ZoneResolver zoneResolver
    ) {
        return new ReservationAppService(deliveryWindowRepository, reservationRepository, zoneResolver);
    }
}
