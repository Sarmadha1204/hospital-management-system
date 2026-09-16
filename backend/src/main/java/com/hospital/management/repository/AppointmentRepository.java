package com.hospital.management.repository;

import com.hospital.management.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    boolean existsByAppointmentCode(String appointmentCode);

    boolean existsByAppointmentCodeAndIdNot(
            String appointmentCode,
            Long id
    );

    boolean existsByDoctorIdAndAppointmentDateAndAppointmentTime(
            Long doctorId,
            LocalDate appointmentDate,
            LocalTime appointmentTime
    );

    boolean existsByDoctorIdAndAppointmentDateAndAppointmentTimeAndIdNot(
            Long doctorId,
            LocalDate appointmentDate,
            LocalTime appointmentTime,
            Long id
    );

    @Query("""
            SELECT a
            FROM Appointment a
            WHERE (:patientId IS NULL OR a.patient.id = :patientId)
              AND (:doctorId IS NULL OR a.doctor.id = :doctorId)
              AND (:appointmentDate IS NULL OR a.appointmentDate = :appointmentDate)
              AND (:status IS NULL OR LOWER(a.status) = LOWER(:status))
            """)
    List<Appointment> findAppointmentsWithFilters(
            @Param("patientId") Long patientId,
            @Param("doctorId") Long doctorId,
            @Param("appointmentDate") LocalDate appointmentDate,
            @Param("status") String status
    );

    List<Appointment> findByPatientIdOrderByAppointmentDateDescAppointmentTimeDesc(
        Long patientId
);
}
