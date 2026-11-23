package com.example.backend.domain;

import jakarta.persistence.*;

@Entity
@Table(
        name = "reservation_seats",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_reservation_seat",
                        columnNames = {
                                "movie_title",
                                "theater",
                                "show_time",
                                "seat_number"
                        }
                )
        }
)
public class ReservationSeat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "reservation_id", nullable = false)
    private Reservation reservation;

    @Column(name = "movie_title", nullable = false, length = 150)
    private String movieTitle;

    @Column(name = "theater", nullable = false, length = 100)
    private String theater;

    @Column(name = "show_time", nullable = false, length = 30)
    private String showTime;

    @Column(name = "seat_number", nullable = false, length = 20)
    private String seatNumber;

    public ReservationSeat() {
    }

    public ReservationSeat(
            Reservation reservation,
            String movieTitle,
            String theater,
            String showTime,
            String seatNumber
    ) {
        this.reservation = reservation;
        this.movieTitle = movieTitle;
        this.theater = theater;
        this.showTime = showTime;
        this.seatNumber = seatNumber;
    }

    public Long getId() {
        return id;
    }

    public Reservation getReservation() {
        return reservation;
    }

    public void setReservation(Reservation reservation) {
        this.reservation = reservation;
    }

    public String getMovieTitle() {
        return movieTitle;
    }

    public void setMovieTitle(String movieTitle) {
        this.movieTitle = movieTitle;
    }

    public String getTheater() {
        return theater;
    }

    public void setTheater(String theater) {
        this.theater = theater;
    }

    public String getShowTime() {
        return showTime;
    }

    public void setShowTime(String showTime) {
        this.showTime = showTime;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    public void setSeatNumber(String seatNumber) {
        this.seatNumber = seatNumber;
    }
}