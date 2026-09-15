package com.hospital.management.repository;

import com.hospital.management.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    boolean existsByDoctorCode(String doctorCode);

    boolean existsByDoctorCodeAndIdNot(String doctorCode, Long id);

    List<Doctor> findBySpecializationIgnoreCase(String specialization);
}

