package com.javamaster.exception;

/**
 * Base checked exception for domain-level errors within the JavaMaster quiz platform.
 */
public class QuizPlatformException extends Exception {

    public QuizPlatformException(String message) {
        super(message);
    }

    public QuizPlatformException(String message, Throwable cause) {
        super(message, cause);
    }
}
