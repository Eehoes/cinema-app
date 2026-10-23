package com.example.backend.controller;

import com.example.backend.domain.Reservation;
import com.example.backend.repository.ReservationRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reservation")
@CrossOrigin(origins = "*")
public class ReservationController {

    private final ReservationRepository
            reservationRepository;


    public ReservationController(
            ReservationRepository reservationRepository
    ) {

        this.reservationRepository =
                reservationRepository;
    }


    /* =========================
       예매 저장
    ========================= */

    @PostMapping
    public ResponseEntity<String> createReservation(
            @RequestBody Reservation reservation
    ) {

        reservationRepository.save(
                reservation
        );


        return ResponseEntity.ok(
                "예매가 완료되었습니다."
        );
    }


    /* =========================
       사용자별 예매 조회
    ========================= */

    @GetMapping("/user/{username}")
    public List<Reservation> getReservations(
            @PathVariable String username
    ) {

        return reservationRepository
                .findByUsernameOrderByIdDesc(
                        username
                );
    }
}