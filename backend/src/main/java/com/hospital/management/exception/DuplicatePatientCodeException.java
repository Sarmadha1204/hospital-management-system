package com.hospital.management.exception;

public class DuplicatePatientCodeException extends RuntimeException {

    public DuplicatePatientCodeException(String message) {
        super(message);
    }
}