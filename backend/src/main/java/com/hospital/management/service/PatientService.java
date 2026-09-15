package com.hospital.management.service;

import com.hospital.management.entity.Patient;
import com.hospital.management.exception.DuplicatePatientCodeException;
import com.hospital.management.exception.PatientNotFoundException;
import com.hospital.management.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PatientService {

    private final PatientRepository patientRepository;

    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    public Patient createPatient(Patient patient) {

        if (patientRepository.existsByPatientCode(
                patient.getPatientCode())) {

            throw new DuplicatePatientCodeException(
                    "Patient code already exists: "
                            + patient.getPatientCode()
            );
        }

        return patientRepository.save(patient);
    }

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public List<Patient> searchPatients(String search) {

        return patientRepository
                .findByPatientCodeContainingIgnoreCaseOrFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrPhoneContaining(
                        search,
                        search,
                        search,
                        search
                );
    }

    public Patient getPatientById(Long id) {

        return patientRepository.findById(id)
                .orElseThrow(() ->
                        new PatientNotFoundException(
                                "Patient not found with id: " + id
                        )
                );
    }

    public Patient updatePatient(
            Long id,
            Patient updatedPatient) {

        Patient existingPatient =
                patientRepository.findById(id)
                        .orElseThrow(() ->
                                new PatientNotFoundException(
                                        "Patient not found with id: " + id
                                )
                        );

        if (patientRepository.existsByPatientCodeAndIdNot(
                updatedPatient.getPatientCode(), id)) {

            throw new DuplicatePatientCodeException(
                    "Patient code already exists: "
                            + updatedPatient.getPatientCode()
            );
        }

        existingPatient.setPatientCode(
                updatedPatient.getPatientCode()
        );

        existingPatient.setFirstName(
                updatedPatient.getFirstName()
        );

        existingPatient.setLastName(
                updatedPatient.getLastName()
        );

        existingPatient.setDateOfBirth(
                updatedPatient.getDateOfBirth()
        );

        existingPatient.setGender(
                updatedPatient.getGender()
        );

        existingPatient.setPhone(
                updatedPatient.getPhone()
        );

        existingPatient.setEmail(
                updatedPatient.getEmail()
        );

        existingPatient.setBloodGroup(
                updatedPatient.getBloodGroup()
        );

        existingPatient.setAddress(
                updatedPatient.getAddress()
        );

        return patientRepository.save(existingPatient);
    }

    public void deletePatient(Long id) {

        if (!patientRepository.existsById(id)) {
            throw new PatientNotFoundException(
                    "Patient not found with id: " + id
            );
        }

        patientRepository.deleteById(id);
    }
}