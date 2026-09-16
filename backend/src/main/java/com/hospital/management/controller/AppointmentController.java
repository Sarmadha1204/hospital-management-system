package com.hospital.management.controller;

import com.hospital.management.entity.Appointment;
import com.hospital.management.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(
            AppointmentService appointmentService) {

        this.appointmentService = appointmentService;
    }

    @PostMapping
    public ResponseEntity<Appointment> createAppointment(
            @Valid @RequestBody Appointment appointment) {

        Appointment savedAppointment =
                appointmentService.createAppointment(appointment);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedAppointment);
    }

    @GetMapping
    public ResponseEntity<List<Appointment>> getAppointments(
            @RequestParam(required = false) Long patientId,
            @RequestParam(required = false) Long doctorId,
            @RequestParam(
                    name = "date",
                    required = false
            ) LocalDate appointmentDate,
            @RequestParam(required = false) String status) {

        if (patientId != null
                || doctorId != null
                || appointmentDate != null
                || (status != null && !status.isBlank())) {

            List<Appointment> appointments =
                    appointmentService.getAppointmentsWithFilters(
                            patientId,
                            doctorId,
                            appointmentDate,
                            status
                    );

            return ResponseEntity.ok(appointments);
        }

        List<Appointment> appointments =
                appointmentService.getAllAppointments();

        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Appointment>> getAppointmentsByDoctorId(
            @PathVariable Long doctorId) {

        List<Appointment> appointments =
                appointmentService.getAppointmentsByDoctorId(doctorId);

        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointmentById(
            @PathVariable Long id) {

        Appointment appointment =
                appointmentService.getAppointmentById(id);

        return ResponseEntity.ok(appointment);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Appointment> updateAppointment(
            @PathVariable Long id,
            @Valid @RequestBody Appointment appointment) {

        Appointment updatedAppointment =
                appointmentService.updateAppointment(
                        id,
                        appointment
                );

        return ResponseEntity.ok(updatedAppointment);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(
            @PathVariable Long id) {

        appointmentService.deleteAppointment(id);

        return ResponseEntity.noContent().build();
    }
}