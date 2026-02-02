package cl.walmart.delivery.domain.model;

public class WindowSoldOutException extends RuntimeException{
    public WindowSoldOutException(String message) {
        super(message);
    }
}
