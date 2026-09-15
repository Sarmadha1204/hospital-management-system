package com.hospital.management.service;

import com.hospital.management.entity.Doctor;
import com.hospital.management.exception.DoctorNotFoundException;
import com.hospital.management.exception.DuplicateDoctorCodeException;
import com.hospital.management.repository.DoctorRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;

    public DoctorService(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    public Doctor createDoctor(Doctor doctor) {

        if (doctorRepository.existsByDoctorCode(
                doctor.getDoctorCode())) {

            throw new DuplicateDoctorCodeException(
                    "Doctor code already exists: "
                            + doctor.getDoctorCode()
            );
        }

        return doctorRepository.save(doctor);
    }

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public Doctor getDoctorById(Long id) {

        return doctorRepository.findById(id)
                .orElseThrow(() ->
                        new DoctorNotFoundException(
                                "Doctor not found with id: " + id
                        )
                );
    }

    public List<Doctor> getDoctorsBySpecialization(
            String specialization) {

        return doctorRepository
                .findBySpecializationIgnoreCase(specialization);
    }

    public Doctor updateDoctor(
            Long id,
            Doctor updatedDoctor) {

        Doctor existingDoctor =
                doctorRepository.findById(id)
                        .orElseThrow(() ->
                                new DoctorNotFoundException(
                                        "Doctor not found with id: " + id
                                )
                        );

        if (doctorRepository.existsByDoctorCodeAndIdNot(
                updatedDoctor.getDoctorCode(), id)) {

            throw new DuplicateDoctorCodeException(
                    "Doctor code already exists: "
                            + updatedDoctor.getDoctorCode()
            );
        }

        existingDoctor.setDoctorCode(
                updatedDoctor.getDoctorCode()
        );

        existingDoctor.setName(
                updatedDoctor.getName()
        );

        existingDoctor.setSpecialization(
                updatedDoctor.getSpecialization()
        );

        existingDoctor.setPhone(
                updatedDoctor.getPhone()
        );

        existingDoctor.setEmail(
                updatedDoctor.getEmail()
        );

        existingDoctor.setAvailability(
                updatedDoctor.getAvailability()
        );

        return doctorRepository.save(existingDoctor);
    }

    public void deleteDoctor(Long id) {

        if (!doctorRepository.existsById(id)) {
            throw new DoctorNotFoundException(
                    "Doctor not found with id: " + id
            );
        }

        doctorRepository.deleteById(id);
    }
}