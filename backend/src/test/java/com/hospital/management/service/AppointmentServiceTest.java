package com.hospital.management.service;

import com.hospital.management.entity.Appointment;
import com.hospital.management.entity.Doctor;
import com.hospital.management.entity.Patient;
import com.hospital.management.exception.AppointmentConflictException;
import com.hospital.management.exception.AppointmentNotFoundException;
import com.hospital.management.exception.DoctorNotFoundException;
import com.hospital.management.exception.DuplicateAppointmentCodeException;
import com.hospital.management.exception.PatientNotFoundException;
import com.hospital.management.repository.AppointmentRepository;
import com.hospital.management.repository.DoctorRepository;
import com.hospital.management.repository.PatientRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AppointmentServiceTest {

    @Mock
    private AppointmentRepository appointmentRepository;

    @Mock
    private PatientRepository patientRepository;

    @Mock
    private DoctorRepository doctorRepository;

    @InjectMocks
    private AppointmentService appointmentService;

    @Test
    void createAppointment_shouldSaveAppointment() {

        Appointment appointment = createAppointment("A100");

        Patient patient = createPatient(1L);
        Doctor doctor = createDoctor(1L);

        appointment.setPatient(patient);
        appointment.setDoctor(doctor);

        when(appointmentRepository.existsByAppointmentCode("A100"))
                .thenReturn(false);

        when(patientRepository.findById(1L))
                .thenReturn(Optional.of(patient));

        when(doctorRepository.findById(1L))
                .thenReturn(Optional.of(doctor));

        when(appointmentRepository
                .existsByDoctorIdAndAppointmentDateAndAppointmentTime(
                        1L,
                        appointment.getAppointmentDate(),
                        appointment.getAppointmentTime()
                ))
                .thenReturn(false);

        when(appointmentRepository.save(appointment))
                .thenReturn(appointment);

        Appointment result =
                appointmentService.createAppointment(appointment);

        assertNotNull(result);
        assertEquals("A100", result.getAppointmentCode());
        assertEquals(patient, result.getPatient());
        assertEquals(doctor, result.getDoctor());

        verify(appointmentRepository)
                .existsByAppointmentCode("A100");

        verify(patientRepository)
                .findById(1L);

        verify(doctorRepository)
                .findById(1L);

        verify(appointmentRepository)
                .save(appointment);
    }

    @Test
    void createAppointment_shouldThrowExceptionForDuplicateCode() {

        Appointment appointment = createAppointment("A100");

        when(appointmentRepository.existsByAppointmentCode("A100"))
                .thenReturn(true);

        assertThrows(
                DuplicateAppointmentCodeException.class,
                () -> appointmentService.createAppointment(appointment)
        );

        verify(appointmentRepository)
                .existsByAppointmentCode("A100");

        verify(appointmentRepository, never())
                .save(any(Appointment.class));
    }

    @Test
    void createAppointment_shouldThrowExceptionWhenPatientNotFound() {

        Appointment appointment = createAppointment("A100");

        Patient patient = createPatient(1L);

        appointment.setPatient(patient);

        when(appointmentRepository.existsByAppointmentCode("A100"))
                .thenReturn(false);

        when(patientRepository.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(
                PatientNotFoundException.class,
                () -> appointmentService.createAppointment(appointment)
        );

        verify(patientRepository)
                .findById(1L);

        verify(appointmentRepository, never())
                .save(any(Appointment.class));
    }

    @Test
    void createAppointment_shouldThrowExceptionWhenDoctorNotFound() {

        Appointment appointment = createAppointment("A100");

        Patient patient = createPatient(1L);
        Doctor doctor = createDoctor(1L);

        appointment.setPatient(patient);
        appointment.setDoctor(doctor);

        when(appointmentRepository.existsByAppointmentCode("A100"))
                .thenReturn(false);

        when(patientRepository.findById(1L))
                .thenReturn(Optional.of(patient));

        when(doctorRepository.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(
                DoctorNotFoundException.class,
                () -> appointmentService.createAppointment(appointment)
        );

        verify(doctorRepository)
                .findById(1L);

        verify(appointmentRepository, never())
                .save(any(Appointment.class));
    }

    @Test
    void createAppointment_shouldThrowExceptionForDoctorConflict() {

        Appointment appointment = createAppointment("A100");

        Patient patient = createPatient(1L);
        Doctor doctor = createDoctor(1L);

        appointment.setPatient(patient);
        appointment.setDoctor(doctor);

        when(appointmentRepository.existsByAppointmentCode("A100"))
                .thenReturn(false);

        when(patientRepository.findById(1L))
                .thenReturn(Optional.of(patient));

        when(doctorRepository.findById(1L))
                .thenReturn(Optional.of(doctor));

        when(appointmentRepository
                .existsByDoctorIdAndAppointmentDateAndAppointmentTime(
                        1L,
                        appointment.getAppointmentDate(),
                        appointment.getAppointmentTime()
                ))
                .thenReturn(true);

        assertThrows(
                AppointmentConflictException.class,
                () -> appointmentService.createAppointment(appointment)
        );

        verify(appointmentRepository)
                .existsByDoctorIdAndAppointmentDateAndAppointmentTime(
                        1L,
                        appointment.getAppointmentDate(),
                        appointment.getAppointmentTime()
                );

        verify(appointmentRepository, never())
                .save(any(Appointment.class));
    }

    @Test
    void getAllAppointments_shouldReturnAppointments() {

        Appointment appointment1 = createAppointment("A100");
        Appointment appointment2 = createAppointment("A101");

        when(appointmentRepository.findAll())
                .thenReturn(List.of(appointment1, appointment2));

        List<Appointment> result =
                appointmentService.getAllAppointments();

        assertEquals(2, result.size());

        assertEquals(
                "A100",
                result.get(0).getAppointmentCode()
        );

        assertEquals(
                "A101",
                result.get(1).getAppointmentCode()
        );

        verify(appointmentRepository).findAll();
    }

    @Test
    void getAppointmentById_shouldReturnAppointment() {

        Appointment appointment = createAppointment("A100");

        when(appointmentRepository.findById(1L))
                .thenReturn(Optional.of(appointment));

        Appointment result =
                appointmentService.getAppointmentById(1L);

        assertNotNull(result);

        assertEquals(
                "A100",
                result.getAppointmentCode()
        );

        verify(appointmentRepository)
                .findById(1L);
    }

    @Test
    void getAppointmentById_shouldThrowExceptionWhenNotFound() {

        when(appointmentRepository.findById(999L))
                .thenReturn(Optional.empty());

        assertThrows(
                AppointmentNotFoundException.class,
                () -> appointmentService.getAppointmentById(999L)
        );

        verify(appointmentRepository)
                .findById(999L);
    }

    @Test
    void getAppointmentsWithFilters_shouldReturnAppointments() {

        Appointment appointment = createAppointment("A100");

        when(appointmentRepository.findAppointmentsWithFilters(
                1L,
                1L,
                LocalDate.of(2026, 9, 22),
                "SCHEDULED"
        )).thenReturn(List.of(appointment));

        List<Appointment> result =
                appointmentService.getAppointmentsWithFilters(
                        1L,
                        1L,
                        LocalDate.of(2026, 9, 22),
                        "SCHEDULED"
                );

        assertEquals(1, result.size());

        assertEquals(
                "A100",
                result.get(0).getAppointmentCode()
        );

        verify(appointmentRepository)
                .findAppointmentsWithFilters(
                        1L,
                        1L,
                        LocalDate.of(2026, 9, 22),
                        "SCHEDULED"
                );
    }

    @Test
    void deleteAppointment_shouldDeleteExistingAppointment() {

        when(appointmentRepository.existsById(1L))
                .thenReturn(true);

        appointmentService.deleteAppointment(1L);

        verify(appointmentRepository)
                .existsById(1L);

        verify(appointmentRepository)
                .deleteById(1L);
    }

    @Test
    void deleteAppointment_shouldThrowExceptionWhenNotFound() {

        when(appointmentRepository.existsById(999L))
                .thenReturn(false);

        assertThrows(
                AppointmentNotFoundException.class,
                () -> appointmentService.deleteAppointment(999L)
        );

        verify(appointmentRepository)
                .existsById(999L);

        verify(appointmentRepository, never())
                .deleteById(anyLong());
    }

    private Appointment createAppointment(String appointmentCode) {

        Appointment appointment = new Appointment();

        appointment.setAppointmentCode(appointmentCode);

        appointment.setAppointmentDate(
                LocalDate.of(2026, 9, 22)
        );

        appointment.setAppointmentTime(
                LocalTime.of(10, 0)
        );

        appointment.setReason(
                "General consultation"
        );

        appointment.setStatus(
                "SCHEDULED"
        );

        appointment.setNotes(
                "Test appointment"
        );

        return appointment;
    }

    private Patient createPatient(Long id) {

        Patient patient = mock(Patient.class);

        when(patient.getId())
                .thenReturn(id);

        return patient;
    }

    private Doctor createDoctor(Long id) {

        Doctor doctor = mock(Doctor.class);

        when(doctor.getId())
                .thenReturn(id);

        return doctor;
    }
}