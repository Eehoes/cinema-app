package com.example.backend.dto;

public class QueueStatusResponse {

    private String userId;
    private String status;
    private Long position;
    private Long waitingCount;
    private boolean allowed;

    public QueueStatusResponse() {
    }

    public QueueStatusResponse(
            String userId,
            String status,
            Long position,
            Long waitingCount,
            boolean allowed
    ) {
        this.userId = userId;
        this.status = status;
        this.position = position;
        this.waitingCount = waitingCount;
        this.allowed = allowed;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getPosition() {
        return position;
    }

    public void setPosition(Long position) {
        this.position = position;
    }

    public Long getWaitingCount() {
        return waitingCount;
    }

    public void setWaitingCount(Long waitingCount) {
        this.waitingCount = waitingCount;
    }

    public boolean isAllowed() {
        return allowed;
    }

    public void setAllowed(boolean allowed) {
        this.allowed = allowed;
    }
}