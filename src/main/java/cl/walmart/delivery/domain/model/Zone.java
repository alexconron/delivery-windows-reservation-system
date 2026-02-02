package cl.walmart.delivery.domain.model;

import java.util.Objects;

public final class Zone {
    private final String id;
    private final String name;

    public Zone(String id, String name) {
        if (id == null || id.isBlank()) throw new IllegalArgumentException("zone.id is required");
        if (name == null || name.isBlank()) throw new IllegalArgumentException("name is required");
        this.id = id;
        this.name = name;
    }

    public String getId(){
        return id;
    }

    public String getName(){
        return name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Zone)) return false;
        Zone other = (Zone) o;
        return id.equals(other.id);
    }

    @Override
    public int hashCode(){
        return Objects.hash(id);
    }
}
