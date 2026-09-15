package com.hospital.management.repository;

import com.hospital.management.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PatientRepository extends JpaRepository<Patient, Long> {

    boolean existsByPatientCode(String patientCode);

    boolean existsByPatientCodeAndIdNot(
            String patientCode,
            Long id
    );

    List<Patient> findByPatientCodeContainingIgnoreCaseOrFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrPhoneContaining(
            String patientCode,
            String firstName,
            String lastName,
            String phone
    );
}