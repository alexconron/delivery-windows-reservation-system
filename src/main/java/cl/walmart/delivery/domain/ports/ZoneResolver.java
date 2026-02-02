package cl.walmart.delivery.domain.ports;

import java.util.Optional;

public interface ZoneResolver {
    Optional<String> resolveZoneIdFromAddress(String address);
}
