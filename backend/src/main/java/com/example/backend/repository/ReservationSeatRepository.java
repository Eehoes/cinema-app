package com.example.backend.repository;

import com.example.backend.domain.ReservationSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReservationSeatRepository
        extends JpaRepository<ReservationSeat, Long> {

    @Query("""
            select rs.seatNumber
            from ReservationSeat rs
            where rs.movieTitle = :movieTitle
              and rs.theater = :theater
              and rs.showTime = :showTime
            order by rs.seatNumber
            """)
    List<String> findOccupiedSeats(
            @Param("movieTitle") String movieTitle,
            @Param("theater") String theater,
            @Param("showTime") String showTime
    );
}