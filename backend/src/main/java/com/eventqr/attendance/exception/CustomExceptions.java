package com.eventqr.attendance.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

public class CustomExceptions {

    @ResponseStatus(HttpStatus.NOT_FOUND)
    public static class ResourceNotFoundException extends RuntimeException {
        public ResourceNotFoundException(String message) {
            super(message);
        }
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public static class EventExpiredException extends RuntimeException {
        public EventExpiredException(String message) {
            super(message);
        }
    }

    @ResponseStatus(HttpStatus.CONFLICT)
    public static class DuplicateAttendanceException extends RuntimeException {
        public DuplicateAttendanceException(String message) {
            super(message);
        }
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public static class ParticipantNotRegisteredException extends RuntimeException {
        public ParticipantNotRegisteredException(String message) {
            super(message);
        }
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public static class ExcelProcessingException extends RuntimeException {
        public ExcelProcessingException(String message) {
            super(message);
        }
    }
}
