package com.hospital.management.controller;

import com.hospital.management.entity.Appointment;
import com.hospital.management.repository.AppointmentRepository;
import com.hospital.management.repository.DoctorRepository;
import com.hospital.management.repository.PatientRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;

    public DashboardController(
            PatientRepository patientRepository,
            DoctorRepository doctorRepository,
            AppointmentRepository appointmentRepository) {

        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.appointmentRepository = appointmentRepository;
    }

    @GetMapping("/counts")
    public Map<String, Long> getCounts() {

        Map<String, Long> counts = new LinkedHashMap<>();

        counts.put("patients", patientRepository.count());
        counts.put("doctors", doctorRepository.count());
        counts.put("appointments", appointmentRepository.count());

        return counts;
    }

    @GetMapping("/upcoming-appointments")
    public List<Appointment> getUpcomingAppointments() {

        return appointmentRepository
                .findByAppointmentDateGreaterThanEqualAndStatusNotIgnoreCaseOrderByAppointmentDateAscAppointmentTimeAsc(
                        LocalDate.now(),
                        "Cancelled"
                );
    }
}