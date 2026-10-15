package com.javamaster.exception;

/**
 * Exception thrown when a persistence or JDBC operation fails.
 * Wraps underlying SQLExceptions to avoid leaking database internals to upper layers.
 */
public class DatabaseOperationException extends QuizPlatformException {

    public DatabaseOperationException(String message) {
        super(message);
    }

    public DatabaseOperationException(String message, Throwable cause) {
        super(message, cause);
    }
}
