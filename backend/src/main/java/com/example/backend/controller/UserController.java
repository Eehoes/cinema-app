package com.example.backend.controller;

import com.example.backend.domain.User;
import com.example.backend.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository userRepository;


    public UserController(
            UserRepository userRepository
    ) {
        this.userRepository = userRepository;
    }


    /* =========================
       회원가입
    ========================= */

    @PostMapping
    public ResponseEntity<String> signup(
            @RequestBody User user
    ) {

        if (
                userRepository.existsByUsername(
                        user.getUsername()
                )
        ) {

            return ResponseEntity
                    .status(409)
                    .body(
                            "이미 사용 중인 아이디입니다."
                    );
        }


        userRepository.save(user);


        return ResponseEntity.ok(
                "회원가입이 완료되었습니다."
        );
    }


    /* =========================
       로그인
    ========================= */

    @PostMapping("/login")
    public ResponseEntity<String> login(
            @RequestBody User loginUser
    ) {

        Optional<User> user =
                userRepository
                        .findByUsernameAndPassword(
                                loginUser.getUsername(),
                                loginUser.getPassword()
                        );


        if (user.isPresent()) {

            return ResponseEntity.ok(
                    "로그인 성공"
            );
        }


        return ResponseEntity
                .status(401)
                .body(
                        "아이디 또는 비밀번호가 틀렸습니다."
                );
    }
}