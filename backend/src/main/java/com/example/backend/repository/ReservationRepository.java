package com.example.backend.repository;

import com.example.backend.domain.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReservationRepository
        extends JpaRepository<Reservation, Long> {

    List<Reservation>
    findByUsernameOrderByIdDesc(
            String username
    );
}