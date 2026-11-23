package com.example.backend.service;

import com.example.backend.domain.Reservation;
import com.example.backend.domain.ReservationSeat;
import com.example.backend.repository.ReservationRepository;
import com.example.backend.repository.ReservationSeatRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final ReservationSeatRepository reservationSeatRepository;

    public ReservationService(
            ReservationRepository reservationRepository,
            ReservationSeatRepository reservationSeatRepository
    ) {
        this.reservationRepository = reservationRepository;
        this.reservationSeatRepository = reservationSeatRepository;
    }

    @Transactional
    public Reservation createReservation(
            Reservation reservation
    ) {

        if (reservation.getSeats() == null
                || reservation.getSeats().isBlank()) {

            throw new IllegalArgumentException(
                    "좌석을 선택해주세요."
            );
        }

        List<String> seatNumbers =
                Arrays.stream(
                                reservation
                                        .getSeats()
                                        .split(",")
                        )
                        .map(String::trim)
                        .filter(seat -> !seat.isBlank())
                        .distinct()
                        .toList();

        if (seatNumbers.isEmpty()) {
            throw new IllegalArgumentException(
                    "좌석을 선택해주세요."
            );
        }

        Reservation savedReservation =
                reservationRepository.save(
                        reservation
                );

        List<ReservationSeat> reservationSeats =
                seatNumbers.stream()
                        .map(seatNumber ->
                                new ReservationSeat(
                                        savedReservation,
                                        reservation.getMovieTitle(),
                                        reservation.getTheater(),
                                        reservation.getShowTime(),
                                        seatNumber
                                )
                        )
                        .toList();

        reservationSeatRepository
                .saveAllAndFlush(
                        reservationSeats
                );

        return savedReservation;
    }

    @Transactional(readOnly = true)
    public List<Reservation> getReservations(
            String username
    ) {

        return reservationRepository
                .findByUsernameOrderByIdDesc(
                        username
                );
    }

    @Transactional(readOnly = true)
    public List<String> getOccupiedSeats(
            String movieTitle,
            String theater,
            String showTime
    ) {

        return reservationSeatRepository
                .findOccupiedSeats(
                        movieTitle,
                        theater,
                        showTime
                );
    }
}