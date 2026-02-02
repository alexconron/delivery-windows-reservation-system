package cl.walmart.delivery.infra.repository;

import cl.walmart.delivery.domain.ports.ZoneResolver;

import java.util.Locale;
import java.util.Map;
import java.util.Optional;

public class StaticZoneResolver implements ZoneResolver {
    private final Map<String, String> keywordToZoneId;

    public StaticZoneResolver(Map<String, String> keywordToZoneId) {
        this.keywordToZoneId = keywordToZoneId;
    }

    @Override
    public Optional<String> resolveZoneIdFromAddress(String address) {
        if (address == null || address.isBlank()) return Optional.empty();

        String normalized = address.toLowerCase(Locale.ROOT);
        for (Map.Entry<String, String> entry : keywordToZoneId.entrySet()) {
            if (normalized.contains(entry.getKey().toLowerCase(Locale.ROOT)))
                return Optional.of(entry.getValue());
        }
        return Optional.empty();
    }
}
