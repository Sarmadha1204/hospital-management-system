package com.hospital.management.controller;

import com.hospital.management.entity.Doctor;
import com.hospital.management.service.DoctorService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/doctors")
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @PostMapping
    public ResponseEntity<Doctor> createDoctor(
            @Valid @RequestBody Doctor doctor) {

        Doctor savedDoctor = doctorService.createDoctor(doctor);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedDoctor);
    }

    @GetMapping
    public ResponseEntity<List<Doctor>> getAllDoctors(
            @RequestParam(required = false) String specialization) {

        List<Doctor> doctors;

        if (specialization != null && !specialization.isBlank()) {
            doctors = doctorService.getDoctorsBySpecialization(
                    specialization
            );
        } else {
            doctors = doctorService.getAllDoctors();
        }

        return ResponseEntity.ok(doctors);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Doctor> getDoctorById(
            @PathVariable Long id) {

        Doctor doctor = doctorService.getDoctorById(id);

        return ResponseEntity.ok(doctor);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Doctor> updateDoctor(
            @PathVariable Long id,
            @Valid @RequestBody Doctor doctor) {

        Doctor updatedDoctor =
                doctorService.updateDoctor(id, doctor);

        return ResponseEntity.ok(updatedDoctor);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDoctor(
            @PathVariable Long id) {

        doctorService.deleteDoctor(id);

        return ResponseEntity.noContent().build();
    }
}