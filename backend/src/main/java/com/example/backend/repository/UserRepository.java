package com.example.backend.repository;

import com.example.backend.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // 아이디 중복 확인
    boolean existsByUsername(String username);

    // 로그인 확인
    Optional<User> findByUsernameAndPassword(
            String username,
            String password
    );
}