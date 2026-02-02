package cl.walmart.delivery.web.controller;

import cl.walmart.delivery.domain.model.WindowSoldOutException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(WindowSoldOutException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public Map<String, Object> handleSoldOut(WindowSoldOutException ex) {
        return Map.of(
                "error", "WINDOW_SOLD_OUT",
                "message", ex.getMessage()
        );
    }

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, Object> handleBadRequest(IllegalArgumentException ex) {
        return Map.of(
                "error", "BAD_REQUEST",
                "message", ex.getMessage()
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, Object> handleValidation(MethodArgumentNotValidException ex) {
        var fieldErrors = ex.getBindingResult().getFieldErrors().stream()
                .collect(Collectors.toMap(
                        e -> e.getField(),
                        e -> e.getDefaultMessage() == null ? "invalid" : e.getDefaultMessage(),
                        (a, b) -> a
                ));

        return Map.of(
                "error", "VALIDATION_ERROR",
                "fields", fieldErrors
        );
    }
}
