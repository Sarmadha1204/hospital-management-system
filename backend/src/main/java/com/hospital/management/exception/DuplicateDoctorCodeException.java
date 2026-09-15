package com.hospital.management.exception;

public class DuplicateDoctorCodeException extends RuntimeException {

    public DuplicateDoctorCodeException(String message) {
        super(message);
    }
}