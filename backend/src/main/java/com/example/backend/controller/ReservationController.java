package com.example.backend.controller;

import com.example.backend.domain.Reservation;
import com.example.backend.service.ReservationService;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reservation")
@CrossOrigin(origins = "*")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(
            ReservationService reservationService
    ) {
        this.reservationService =
                reservationService;
    }

    /*
     * 예매 저장
     */
    @PostMapping
    public ResponseEntity<String> createReservation(
            @RequestBody Reservation reservation
    ) {

        try {

            reservationService
                    .createReservation(
                            reservation
                    );

            return ResponseEntity.ok(
                    "예매가 완료되었습니다."
            );

        } catch (DataIntegrityViolationException e) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(
                            "이미 예약된 좌석이 포함되어 있습니다."
                    );

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            e.getMessage()
                    );
        }
    }

    /*
     * 사용자별 예매 조회
     */
    @GetMapping("/user/{username}")
    public List<Reservation> getReservations(
            @PathVariable String username
    ) {

        return reservationService
                .getReservations(
                        username
                );
    }

    /*
     * 이미 예약된 좌석 조회
     */
    @GetMapping("/occupied")
    public List<String> getOccupiedSeats(
            @RequestParam String movieTitle,
            @RequestParam String theater,
            @RequestParam String showTime
    ) {

        return reservationService
                .getOccupiedSeats(
                        movieTitle,
                        theater,
                        showTime
                );
    }
}