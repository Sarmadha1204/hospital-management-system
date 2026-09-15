package com.hospital.management.exception;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    // Handles validation errors
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException exception,
            HttpHeaders headers,
            HttpStatusCode status,
            WebRequest request) {

        Map<String, String> errors = new HashMap<>();

        exception.getBindingResult()
                .getFieldErrors()
                .forEach(error ->
                        errors.put(
                                error.getField(),
                                error.getDefaultMessage()
                        )
                );

        return ResponseEntity
                .status(HttpStatusCode.valueOf(400))
                .body(errors);
    }

    // Handles duplicate patient code
    @ExceptionHandler(DuplicatePatientCodeException.class)
    public ResponseEntity<Map<String, String>> handleDuplicatePatientCode(
            DuplicatePatientCodeException exception) {

        Map<String, String> error = new HashMap<>();
        error.put("error", exception.getMessage());

        return ResponseEntity
                .status(HttpStatusCode.valueOf(409))
                .body(error);
    }

    // Handles duplicate doctor code
    @ExceptionHandler(DuplicateDoctorCodeException.class)
    public ResponseEntity<Map<String, String>> handleDuplicateDoctorCode(
            DuplicateDoctorCodeException exception) {

        Map<String, String> error = new HashMap<>();
        error.put("error", exception.getMessage());

        return ResponseEntity
                .status(HttpStatusCode.valueOf(409))
                .body(error);
    }

    // Handles duplicate appointment code
    @ExceptionHandler(DuplicateAppointmentCodeException.class)
    public ResponseEntity<Map<String, String>> handleDuplicateAppointmentCode(
            DuplicateAppointmentCodeException exception) {

        Map<String, String> error = new HashMap<>();
        error.put("error", exception.getMessage());

        return ResponseEntity
                .status(HttpStatusCode.valueOf(409))
                .body(error);
    }

    // Handles patient not found
    @ExceptionHandler(PatientNotFoundException.class)
    public ResponseEntity<Map<String, String>> handlePatientNotFound(
            PatientNotFoundException exception) {

        Map<String, String> error = new HashMap<>();
        error.put("error", exception.getMessage());

        return ResponseEntity
                .status(HttpStatusCode.valueOf(404))
                .body(error);
    }

    // Handles doctor not found
    @ExceptionHandler(DoctorNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleDoctorNotFound(
            DoctorNotFoundException exception) {

        Map<String, String> error = new HashMap<>();
        error.put("error", exception.getMessage());

        return ResponseEntity
                .status(HttpStatusCode.valueOf(404))
                .body(error);
    }

    // Handles appointment conflicts
    @ExceptionHandler(AppointmentConflictException.class)
    public ResponseEntity<Map<String, String>> handleAppointmentConflict(
            AppointmentConflictException exception) {

        Map<String, String> error = new HashMap<>();
        error.put("error", exception.getMessage());

        return ResponseEntity
                .status(HttpStatusCode.valueOf(409))
                .body(error);
    }

    // Handles appointment not found
    @ExceptionHandler(AppointmentNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleAppointmentNotFound(
            AppointmentNotFoundException exception) {

        Map<String, String> error = new HashMap<>();
        error.put("error", exception.getMessage());

        return ResponseEntity
                .status(HttpStatusCode.valueOf(404))
                .body(error);
    }
}