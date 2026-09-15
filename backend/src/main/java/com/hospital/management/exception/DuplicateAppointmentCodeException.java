package com.hospital.management.exception;

public class DuplicateAppointmentCodeException extends RuntimeException {

    public DuplicateAppointmentCodeException(String message) {
        super(message);
    }
}
