package com.example.backend.controller;

import com.example.backend.dto.QueueStatusResponse;
import com.example.backend.service.QueueService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/queue")
@CrossOrigin(origins = "*")
public class QueueController {

    private final QueueService queueService;

    public QueueController(
            QueueService queueService
    ) {
        this.queueService =
                queueService;
    }


    /*
     * =============================
     * 대기열 참가
     * =============================
     *
     * POST /queue/join?userId=user01
     */
    @PostMapping("/join")
    public ResponseEntity<QueueStatusResponse> join(
            @RequestParam String userId
    ) {

        QueueStatusResponse response =
                queueService.join(
                        userId
                );

        return ResponseEntity.ok(
                response
        );
    }


    /*
     * =============================
     * 내 대기 상태 조회
     * =============================
     *
     * GET /queue/status?userId=user01
     */
    @GetMapping("/status")
    public ResponseEntity<QueueStatusResponse> status(
            @RequestParam String userId
    ) {

        QueueStatusResponse response =
                queueService.getStatus(
                        userId
                );

        return ResponseEntity.ok(
                response
        );
    }


    /*
     * =============================
     * Heartbeat
     * =============================
     *
     * POST /queue/heartbeat?userId=user01
     */
    @PostMapping("/heartbeat")
    public ResponseEntity<QueueStatusResponse> heartbeat(
            @RequestParam String userId
    ) {

        QueueStatusResponse response =
                queueService.heartbeat(
                        userId
                );

        return ResponseEntity.ok(
                response
        );
    }


    /*
     * =============================
     * 대기열 / 예매 화면 퇴장
     * =============================
     *
     * DELETE /queue/leave?userId=user01
     */
    @DeleteMapping("/leave")
    public ResponseEntity<String> leave(
            @RequestParam String userId
    ) {

        queueService.leave(
                userId
        );

        return ResponseEntity.ok(
                "대기열에서 제거되었습니다."
        );
    }


    /*
     * =============================
     * Queue 상태 확인
     * =============================
     *
     * GET /queue/stats
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> stats() {

        Map<String, Long> result =
                new HashMap<>();


        result.put(
                "waiting",
                queueService
                        .getWaitingCount()
        );


        result.put(
                "active",
                queueService
                        .getActiveCount()
        );


        return ResponseEntity.ok(
                result
        );
    }
}