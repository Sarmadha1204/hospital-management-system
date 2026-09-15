package com.hospital.management.service;

import com.hospital.management.entity.Doctor;
import com.hospital.management.exception.DoctorNotFoundException;
import com.hospital.management.exception.DuplicateDoctorCodeException;
import com.hospital.management.repository.DoctorRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DoctorServiceTest {

    @Mock
    private DoctorRepository doctorRepository;

    @InjectMocks
    private DoctorService doctorService;

    @Test
    void createDoctor_shouldSaveDoctor() {

        Doctor doctor = createDoctor("D100");

        when(doctorRepository.existsByDoctorCode("D100"))
                .thenReturn(false);

        when(doctorRepository.save(doctor))
                .thenReturn(doctor);

        Doctor result = doctorService.createDoctor(doctor);

        assertNotNull(result);
        assertEquals("D100", result.getDoctorCode());

        verify(doctorRepository).existsByDoctorCode("D100");
        verify(doctorRepository).save(doctor);
    }

    @Test
    void createDoctor_shouldThrowExceptionForDuplicateCode() {

        Doctor doctor = createDoctor("D100");

        when(doctorRepository.existsByDoctorCode("D100"))
                .thenReturn(true);

        assertThrows(
                DuplicateDoctorCodeException.class,
                () -> doctorService.createDoctor(doctor)
        );

        verify(doctorRepository)
                .existsByDoctorCode("D100");

        verify(doctorRepository, never())
                .save(any(Doctor.class));
    }

    @Test
    void getAllDoctors_shouldReturnDoctors() {

        Doctor doctor1 = createDoctor("D100");
        Doctor doctor2 = createDoctor("D101");

        when(doctorRepository.findAll())
                .thenReturn(List.of(doctor1, doctor2));

        List<Doctor> result = doctorService.getAllDoctors();

        assertEquals(2, result.size());
        assertEquals("D100", result.get(0).getDoctorCode());
        assertEquals("D101", result.get(1).getDoctorCode());

        verify(doctorRepository).findAll();
    }

    @Test
    void getDoctorById_shouldReturnDoctor() {

        Doctor doctor = createDoctor("D100");

        when(doctorRepository.findById(1L))
                .thenReturn(Optional.of(doctor));

        Doctor result = doctorService.getDoctorById(1L);

        assertNotNull(result);
        assertEquals("D100", result.getDoctorCode());

        verify(doctorRepository).findById(1L);
    }

    @Test
    void getDoctorById_shouldThrowExceptionWhenNotFound() {

        when(doctorRepository.findById(999L))
                .thenReturn(Optional.empty());

        assertThrows(
                DoctorNotFoundException.class,
                () -> doctorService.getDoctorById(999L)
        );

        verify(doctorRepository).findById(999L);
    }

    @Test
    void getDoctorsBySpecialization_shouldReturnMatchingDoctors() {

        Doctor doctor1 = createDoctor("D100");
        Doctor doctor2 = createDoctor("D101");

        doctor1.setSpecialization("Cardiology");
        doctor2.setSpecialization("Cardiology");

        when(doctorRepository
                .findBySpecializationIgnoreCase("Cardiology"))
                .thenReturn(List.of(doctor1, doctor2));

        List<Doctor> result =
                doctorService.getDoctorsBySpecialization("Cardiology");

        assertEquals(2, result.size());
        assertEquals(
                "Cardiology",
                result.get(0).getSpecialization()
        );

        verify(doctorRepository)
                .findBySpecializationIgnoreCase("Cardiology");
    }

    @Test
    void deleteDoctor_shouldDeleteExistingDoctor() {

        when(doctorRepository.existsById(1L))
                .thenReturn(true);

        doctorService.deleteDoctor(1L);

        verify(doctorRepository).existsById(1L);
        verify(doctorRepository).deleteById(1L);
    }

    @Test
    void deleteDoctor_shouldThrowExceptionWhenNotFound() {

        when(doctorRepository.existsById(999L))
                .thenReturn(false);

        assertThrows(
                DoctorNotFoundException.class,
                () -> doctorService.deleteDoctor(999L)
        );

        verify(doctorRepository).existsById(999L);
        verify(doctorRepository, never()).deleteById(anyLong());
    }

    private Doctor createDoctor(String doctorCode) {

        Doctor doctor = new Doctor();

        doctor.setDoctorCode(doctorCode);
        doctor.setName("Dr. Test");
        doctor.setSpecialization("Cardiology");
        doctor.setPhone("9876543210");
        doctor.setEmail("doctor.test@example.com");
        doctor.setAvailability("Mon-Fri 09:00-17:00");

        return doctor;
    }
}