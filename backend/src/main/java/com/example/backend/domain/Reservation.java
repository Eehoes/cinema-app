package com.example.backend.domain;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "reservations")
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    private String movieTitle;

    private String theater;

    private String showTime;

    private String seats;

    private Integer price;

    private LocalDateTime createdAt;


    public Reservation() {
    }


    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }


    public Long getId() {
        return id;
    }


    public void setId(Long id) {
        this.id = id;
    }


    public String getUsername() {
        return username;
    }


    public void setUsername(String username) {
        this.username = username;
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


    public String getSeats() {
        return seats;
    }


    public void setSeats(String seats) {
        this.seats = seats;
    }


    public Integer getPrice() {
        return price;
    }


    public void setPrice(Integer price) {
        this.price = price;
    }


    public LocalDateTime getCreatedAt() {
        return createdAt;
    }


    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}