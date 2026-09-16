package com.hospital.management.service;

import com.hospital.management.entity.Appointment;
import com.hospital.management.entity.Patient;
import com.hospital.management.entity.Doctor;
import com.hospital.management.exception.AppointmentConflictException;
import com.hospital.management.exception.DuplicateAppointmentCodeException;
import com.hospital.management.exception.PatientNotFoundException;
import com.hospital.management.exception.DoctorNotFoundException;
import com.hospital.management.exception.AppointmentNotFoundException;
import com.hospital.management.repository.AppointmentRepository;
import com.hospital.management.repository.DoctorRepository;
import com.hospital.management.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public AppointmentService(
            AppointmentRepository appointmentRepository,
            PatientRepository patientRepository,
            DoctorRepository doctorRepository) {

        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
    }

    public Appointment createAppointment(Appointment appointment) {

        if (appointmentRepository.existsByAppointmentCode(
                appointment.getAppointmentCode())) {

            throw new DuplicateAppointmentCodeException(
                    "Appointment code already exists: "
                            + appointment.getAppointmentCode()
            );
        }

        Patient patient = patientRepository.findById(
                appointment.getPatient().getId()
        ).orElseThrow(() ->
                new PatientNotFoundException(
                        "Patient not found with id: "
                                + appointment.getPatient().getId()
                )
        );

        Doctor doctor = doctorRepository.findById(
                appointment.getDoctor().getId()
        ).orElseThrow(() ->
                new DoctorNotFoundException(
                        "Doctor not found with id: "
                                + appointment.getDoctor().getId()
                )
        );

        boolean conflict =
                appointmentRepository
                        .existsByDoctorIdAndAppointmentDateAndAppointmentTime(
                                doctor.getId(),
                                appointment.getAppointmentDate(),
                                appointment.getAppointmentTime()
                        );

        if (conflict) {
            throw new AppointmentConflictException(
                    "Doctor already has an appointment at "
                            + appointment.getAppointmentDate()
                            + " "
                            + appointment.getAppointmentTime()
            );
        }

        appointment.setPatient(patient);
        appointment.setDoctor(doctor);

        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public List<Appointment> getAppointmentsWithFilters(
            Long patientId,
            Long doctorId,
            LocalDate appointmentDate,
            String status) {

        return appointmentRepository.findAppointmentsWithFilters(
                patientId,
                doctorId,
                appointmentDate,
                status
        );
    }

    public List<Appointment> getAppointmentsByPatientId(Long patientId) {

        if (!patientRepository.existsById(patientId)) {
                throw new PatientNotFoundException(
                        "Patient not found with id: " + patientId
                );
        }

        return appointmentRepository
            .findByPatientIdOrderByAppointmentDateDescAppointmentTimeDesc(
                    patientId
            );
        }

        public List<Appointment> getAppointmentsByDoctorId(Long doctorId) {

            if (!doctorRepository.existsById(doctorId)) {
                throw new DoctorNotFoundException(
                        "Doctor not found with id: " + doctorId
                );
            }

            return appointmentRepository.findByDoctorIdOrderByAppointmentDateAscAppointmentTimeAsc(
                    doctorId
            );
        }

    public Appointment getAppointmentById(Long id) {

        return appointmentRepository.findById(id)
                .orElseThrow(() ->
                        new AppointmentNotFoundException(
                                "Appointment not found with id: " + id
                        )
                );
    }

    public Appointment updateAppointment(
            Long id,
            Appointment updatedAppointment) {

        Appointment existingAppointment =
                appointmentRepository.findById(id)
                        .orElseThrow(() ->
                                new AppointmentNotFoundException(
                                        "Appointment not found with id: " + id
                                )
                        );

        if (appointmentRepository.existsByAppointmentCodeAndIdNot(
                updatedAppointment.getAppointmentCode(), id)) {

            throw new DuplicateAppointmentCodeException(
                    "Appointment code already exists: "
                            + updatedAppointment.getAppointmentCode()
            );
        }

        Patient patient = patientRepository.findById(
                updatedAppointment.getPatient().getId()
        ).orElseThrow(() ->
                new PatientNotFoundException(
                        "Patient not found with id: "
                                + updatedAppointment.getPatient().getId()
                )
        );

        Doctor doctor = doctorRepository.findById(
                updatedAppointment.getDoctor().getId()
        ).orElseThrow(() ->
                new DoctorNotFoundException(
                        "Doctor not found with id: "
                                + updatedAppointment.getDoctor().getId()
                )
        );

        boolean conflict =
                appointmentRepository
                        .existsByDoctorIdAndAppointmentDateAndAppointmentTimeAndIdNot(
                                doctor.getId(),
                                updatedAppointment.getAppointmentDate(),
                                updatedAppointment.getAppointmentTime(),
                                id
                        );

        if (conflict) {
            throw new AppointmentConflictException(
                    "Doctor already has an appointment at "
                            + updatedAppointment.getAppointmentDate()
                            + " "
                            + updatedAppointment.getAppointmentTime()
            );
        }

        existingAppointment.setAppointmentCode(
                updatedAppointment.getAppointmentCode()
        );

        existingAppointment.setPatient(patient);

        existingAppointment.setDoctor(doctor);

        existingAppointment.setAppointmentDate(
                updatedAppointment.getAppointmentDate()
        );

        existingAppointment.setAppointmentTime(
                updatedAppointment.getAppointmentTime()
        );

        existingAppointment.setReason(
                updatedAppointment.getReason()
        );

        existingAppointment.setStatus(
                updatedAppointment.getStatus()
        );

        existingAppointment.setNotes(
                updatedAppointment.getNotes()
        );

        return appointmentRepository.save(existingAppointment);
    }

    public void deleteAppointment(Long id) {

        if (!appointmentRepository.existsById(id)) {
            throw new AppointmentNotFoundException(
                    "Appointment not found with id: " + id
            );
        }

        appointmentRepository.deleteById(id);
    }
}