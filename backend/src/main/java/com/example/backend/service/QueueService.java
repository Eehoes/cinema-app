package com.example.backend.service;

import com.example.backend.dto.QueueStatusResponse;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Set;

@Service
public class QueueService {

    private static final String WAITING_QUEUE =
            "cinema:queue:waiting";

    private static final String ACTIVE_QUEUE =
            "cinema:queue:active";

    /*
     * 동시에 예매 화면에 입장시킬 사용자 수.
     *
     * 처음 테스트할 때는 5명으로 두면
     * 대기열 움직임을 확인하기 편하다.
     *
     * 이후 10, 20 등으로 조정 가능.
     */
    private static final long MAX_ACTIVE_USERS = 5;

    /*
     * 입장 후 일정 시간 동안 아무 동작이 없으면
     * 자동으로 Active Queue에서 제거.
     *
     * 현재 2분.
     */
    private static final long ACTIVE_TIMEOUT_MS =
            Duration.ofMinutes(2).toMillis();

    private final StringRedisTemplate redisTemplate;

    public QueueService(
            StringRedisTemplate redisTemplate
    ) {
        this.redisTemplate =
                redisTemplate;
    }


    /*
     * =============================
     * 대기열 등록
     * =============================
     */
    public synchronized QueueStatusResponse join(
            String userId
    ) {

        validateUserId(userId);

        removeExpiredActiveUsers();


        /*
         * 이미 입장한 사용자
         */
        Double activeScore =
                redisTemplate
                        .opsForZSet()
                        .score(
                                ACTIVE_QUEUE,
                                userId
                        );

        if (activeScore != null) {

            refreshActiveUser(
                    userId
            );

            return createActiveResponse(
                    userId
            );
        }


        /*
         * 이미 대기 중인 사용자
         */
        Double waitingScore =
                redisTemplate
                        .opsForZSet()
                        .score(
                                WAITING_QUEUE,
                                userId
                        );

        if (waitingScore == null) {

            redisTemplate
                    .opsForZSet()
                    .add(
                            WAITING_QUEUE,
                            userId,
                            System.currentTimeMillis()
                    );
        }


        /*
         * 자리가 있으면 대기자를 입장시킨다.
         */
        promoteUsers();


        return getStatus(
                userId
        );
    }


    /*
     * =============================
     * 내 대기 상태 조회
     * =============================
     */
    public synchronized QueueStatusResponse getStatus(
            String userId
    ) {

        validateUserId(userId);

        removeExpiredActiveUsers();

        promoteUsers();


        /*
         * 현재 입장 허용 상태
         */
        Double activeScore =
                redisTemplate
                        .opsForZSet()
                        .score(
                                ACTIVE_QUEUE,
                                userId
                        );

        if (activeScore != null) {

            return createActiveResponse(
                    userId
            );
        }


        /*
         * Waiting Queue에서 내 순번 검색
         */
        Long rank =
                redisTemplate
                        .opsForZSet()
                        .rank(
                                WAITING_QUEUE,
                                userId
                        );


        Long waitingCount =
                redisTemplate
                        .opsForZSet()
                        .zCard(
                                WAITING_QUEUE
                        );


        if (rank == null) {

            return new QueueStatusResponse(
                    userId,
                    "NOT_JOINED",
                    null,
                    waitingCount,
                    false
            );
        }


        /*
         * Redis rank는 0부터 시작하기 때문에
         * 사용자에게 보여줄 때 +1
         */
        long position =
                rank + 1;


        return new QueueStatusResponse(
                userId,
                "WAITING",
                position,
                waitingCount,
                false
        );
    }


    /*
     * =============================
     * 입장 사용자 Heartbeat
     * =============================
     *
     * 예매 화면에 들어간 사용자가
     * 일정 주기로 호출한다.
     *
     * 이 요청이 들어오는 동안에는
     * Active 상태가 유지된다.
     */
    public synchronized QueueStatusResponse heartbeat(
            String userId
    ) {

        validateUserId(userId);

        removeExpiredActiveUsers();


        Double activeScore =
                redisTemplate
                        .opsForZSet()
                        .score(
                                ACTIVE_QUEUE,
                                userId
                        );


        if (activeScore == null) {

            return getStatus(
                    userId
            );
        }


        refreshActiveUser(
                userId
        );


        return createActiveResponse(
                userId
        );
    }


    /*
     * =============================
     * 대기열 / 예매 화면 퇴장
     * =============================
     */
    public synchronized void leave(
            String userId
    ) {

        validateUserId(userId);


        redisTemplate
                .opsForZSet()
                .remove(
                        WAITING_QUEUE,
                        userId
                );


        redisTemplate
                .opsForZSet()
                .remove(
                        ACTIVE_QUEUE,
                        userId
                );


        /*
         * 한 명이 나갔으므로
         * 다음 대기자 입장
         */
        promoteUsers();
    }


    /*
     * =============================
     * 대기 인원 수
     * =============================
     */
    public Long getWaitingCount() {

        removeExpiredActiveUsers();

        promoteUsers();

        Long count =
                redisTemplate
                        .opsForZSet()
                        .zCard(
                                WAITING_QUEUE
                        );

        return count == null
                ? 0L
                : count;
    }


    /*
     * =============================
     * 현재 입장 사용자 수
     * =============================
     */
    public Long getActiveCount() {

        removeExpiredActiveUsers();

        Long count =
                redisTemplate
                        .opsForZSet()
                        .zCard(
                                ACTIVE_QUEUE
                        );

        return count == null
                ? 0L
                : count;
    }


    /*
     * =============================
     * 대기자 자동 입장 처리
     * =============================
     */
    private void promoteUsers() {

        Long activeCount =
                redisTemplate
                        .opsForZSet()
                        .zCard(
                                ACTIVE_QUEUE
                        );


        if (activeCount == null) {
            activeCount = 0L;
        }


        long availableSlots =
                MAX_ACTIVE_USERS
                        - activeCount;


        if (availableSlots <= 0) {
            return;
        }


        Set<ZSetOperations.TypedTuple<String>>
                waitingUsers =
                redisTemplate
                        .opsForZSet()
                        .rangeWithScores(
                                WAITING_QUEUE,
                                0,
                                availableSlots - 1
                        );


        if (
                waitingUsers == null ||
                        waitingUsers.isEmpty()
        ) {
            return;
        }


        long now =
                System.currentTimeMillis();


        for (
                ZSetOperations.TypedTuple<String>
                        waitingUser
                : waitingUsers
        ) {

            String userId =
                    waitingUser.getValue();


            if (userId == null) {
                continue;
            }


            /*
             * Waiting Queue에서 제거
             */
            redisTemplate
                    .opsForZSet()
                    .remove(
                            WAITING_QUEUE,
                            userId
                    );


            /*
             * Active Queue에 등록
             *
             * Score에는 만료 시간을 저장한다.
             */
            redisTemplate
                    .opsForZSet()
                    .add(
                            ACTIVE_QUEUE,
                            userId,
                            now + ACTIVE_TIMEOUT_MS
                    );
        }
    }


    /*
     * =============================
     * 만료된 Active 사용자 제거
     * =============================
     */
    private void removeExpiredActiveUsers() {

        long now =
                System.currentTimeMillis();


        redisTemplate
                .opsForZSet()
                .removeRangeByScore(
                        ACTIVE_QUEUE,
                        0,
                        now
                );
    }


    /*
     * =============================
     * Active TTL 갱신
     * =============================
     */
    private void refreshActiveUser(
            String userId
    ) {

        redisTemplate
                .opsForZSet()
                .add(
                        ACTIVE_QUEUE,
                        userId,
                        System.currentTimeMillis()
                                + ACTIVE_TIMEOUT_MS
                );
    }


    /*
     * =============================
     * Active 상태 Response
     * =============================
     */
    private QueueStatusResponse
    createActiveResponse(
            String userId
    ) {

        Long waitingCount =
                redisTemplate
                        .opsForZSet()
                        .zCard(
                                WAITING_QUEUE
                        );


        return new QueueStatusResponse(
                userId,
                "ACTIVE",
                0L,
                waitingCount == null
                        ? 0L
                        : waitingCount,
                true
        );
    }


    /*
     * =============================
     * 사용자 ID 검증
     * =============================
     */
    private void validateUserId(
            String userId
    ) {

        if (
                userId == null ||
                        userId.isBlank()
        ) {

            throw new IllegalArgumentException(
                    "userId가 필요합니다."
            );
        }
    }
}