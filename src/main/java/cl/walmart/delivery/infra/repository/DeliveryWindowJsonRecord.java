package cl.walmart.delivery.infra.repository;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Map;

public class DeliveryWindowJsonRecord {
    public String id;
    public String date;
    public String start;
    public String end;

    public Integer cost;

    public Integer capacityTotal;

    @JsonProperty("capacityByZone")
    public Map<String, Integer> capacityByZone;
}
