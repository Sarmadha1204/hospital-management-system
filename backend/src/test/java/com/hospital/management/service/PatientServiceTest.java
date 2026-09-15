package com.hospital.management.service;

import com.hospital.management.entity.Patient;
import com.hospital.management.exception.DuplicatePatientCodeException;
import com.hospital.management.exception.PatientNotFoundException;
import com.hospital.management.repository.PatientRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PatientServiceTest {

    @Mock
    private PatientRepository patientRepository;

    @InjectMocks
    private PatientService patientService;

    @Test
    void createPatient_shouldSavePatient() {

        Patient patient = createPatient("P100");

        when(patientRepository.existsByPatientCode("P100"))
                .thenReturn(false);

        when(patientRepository.save(patient))
                .thenReturn(patient);

        Patient result = patientService.createPatient(patient);

        assertNotNull(result);
        assertEquals("P100", result.getPatientCode());

        verify(patientRepository).existsByPatientCode("P100");
        verify(patientRepository).save(patient);
    }

    @Test
    void createPatient_shouldThrowExceptionForDuplicateCode() {

        Patient patient = createPatient("P100");

        when(patientRepository.existsByPatientCode("P100"))
                .thenReturn(true);

        assertThrows(
                DuplicatePatientCodeException.class,
                () -> patientService.createPatient(patient)
        );

        verify(patientRepository)
                .existsByPatientCode("P100");

        verify(patientRepository, never())
                .save(any(Patient.class));
    }

    @Test
    void getAllPatients_shouldReturnPatients() {

        Patient patient1 = createPatient("P100");
        Patient patient2 = createPatient("P101");

        when(patientRepository.findAll())
                .thenReturn(List.of(patient1, patient2));

        List<Patient> result = patientService.getAllPatients();

        assertEquals(2, result.size());
        assertEquals("P100", result.get(0).getPatientCode());
        assertEquals("P101", result.get(1).getPatientCode());

        verify(patientRepository).findAll();
    }

    @Test
    void getPatientById_shouldReturnPatient() {

        Patient patient = createPatient("P100");
        patient.setId(1L);

        when(patientRepository.findById(1L))
                .thenReturn(Optional.of(patient));

        Patient result = patientService.getPatientById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("P100", result.getPatientCode());

        verify(patientRepository).findById(1L);
    }

    @Test
    void getPatientById_shouldThrowExceptionWhenNotFound() {

        when(patientRepository.findById(999L))
                .thenReturn(Optional.empty());

        assertThrows(
                PatientNotFoundException.class,
                () -> patientService.getPatientById(999L)
        );

        verify(patientRepository).findById(999L);
    }

    @Test
    void searchPatients_shouldReturnMatchingPatients() {

        Patient patient = createPatient("P100");

        when(patientRepository
                .findByPatientCodeContainingIgnoreCaseOrFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrPhoneContaining(
                        "John",
                        "John",
                        "John",
                        "John"
                ))
                .thenReturn(List.of(patient));

        List<Patient> result =
                patientService.searchPatients("John");

        assertEquals(1, result.size());
        assertEquals("P100", result.get(0).getPatientCode());

        verify(patientRepository)
                .findByPatientCodeContainingIgnoreCaseOrFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrPhoneContaining(
                        "John",
                        "John",
                        "John",
                        "John"
                );
    }

    @Test
    void deletePatient_shouldDeleteExistingPatient() {

        when(patientRepository.existsById(1L))
                .thenReturn(true);

        patientService.deletePatient(1L);

        verify(patientRepository).existsById(1L);
        verify(patientRepository).deleteById(1L);
    }

    @Test
    void deletePatient_shouldThrowExceptionWhenNotFound() {

        when(patientRepository.existsById(999L))
                .thenReturn(false);

        assertThrows(
                PatientNotFoundException.class,
                () -> patientService.deletePatient(999L)
        );

        verify(patientRepository).existsById(999L);
        verify(patientRepository, never()).deleteById(anyLong());
    }

    private Patient createPatient(String patientCode) {

        Patient patient = new Patient();

        patient.setPatientCode(patientCode);
        patient.setFirstName("John");
        patient.setLastName("Test");
        patient.setDateOfBirth(
                LocalDate.of(1995, 5, 10)
        );
        patient.setGender("Male");
        patient.setPhone("9876543210");
        patient.setEmail("john.test@example.com");
        patient.setBloodGroup("O+");
        patient.setAddress("Chennai");

        return patient;
    }
}