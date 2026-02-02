package cl.walmart.delivery.infra.repository;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.InputStream;
import java.util.List;

public class DeliveryWindowJsonLoader {

    private final ObjectMapper objectMapper;

    public DeliveryWindowJsonLoader(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public List<DeliveryWindowJsonRecord> loadFromClasspath(String path) {
        try (InputStream in = getClass().getClassLoader().getResourceAsStream(path)) {
            if (in == null) {
                throw new IllegalStateException("No se encontró el archivo en classpath: " + path);
            }
            return objectMapper.readValue(in, new TypeReference<>() {});
        } catch (Exception e) {
            throw new IllegalStateException("Error cargando JSON: " + path, e);
        }
    }
}
