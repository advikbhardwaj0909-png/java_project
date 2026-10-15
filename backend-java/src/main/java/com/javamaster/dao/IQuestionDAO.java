package com.javamaster.dao;

import com.javamaster.exception.DatabaseOperationException;
import com.javamaster.model.Question;

import java.util.List;
import java.util.Optional;

/**
 * Data Access Object (DAO) interface defining CRUD operations for Question entities.
 */
public interface IQuestionDAO {

    /**
     * Retrieves all questions from the database.
     *
     * @return List of questions, empty list if none found.
     * @throws DatabaseOperationException if query execution fails.
     */
    List<Question> findAll() throws DatabaseOperationException;

    /**
     * Retrieves questions filtered by their category tag.
     *
     * @param category The category name (e.g., 'Core OOP', 'JDBC & Database').
     * @return List of matching questions.
     * @throws DatabaseOperationException if query execution fails.
     */
    List<Question> findByCategory(String category) throws DatabaseOperationException;

    /**
     * Finds a single question by its unique identifier.
     *
     * @param id The question ID.
     * @return Optional containing the question if found, empty otherwise.
     * @throws DatabaseOperationException if query execution fails.
     */
    Optional<Question> findById(String id) throws DatabaseOperationException;

    /**
     * Inserts or updates a question in the database.
     *
     * @param question The Question instance to persist.
     * @throws DatabaseOperationException if insert/update fails.
     */
    void save(Question question) throws DatabaseOperationException;

    /**
     * Deletes a question by its unique identifier.
     *
     * @param id The question ID.
     * @return true if a record was deleted, false otherwise.
     * @throws DatabaseOperationException if delete fails.
     */
    boolean deleteById(String id) throws DatabaseOperationException;
}
