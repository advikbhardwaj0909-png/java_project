package com.javamaster.dao;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.javamaster.exception.DatabaseOperationException;
import com.javamaster.model.Question;
import com.javamaster.util.DBConnectionManager;

import java.lang.reflect.Type;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * JDBC implementation of IQuestionDAO using parameterized PreparedStatements and connection pooling.
 */
public class QuestionDAOImpl implements IQuestionDAO {

    private static final Gson GSON = new Gson();
    private static final Type STRING_LIST_TYPE = new TypeToken<List<String>>() {}.getType();

    private final DBConnectionManager connectionManager;

    public QuestionDAOImpl() {
        this(DBConnectionManager.getInstance());
    }

    public QuestionDAOImpl(DBConnectionManager connectionManager) {
        this.connectionManager = connectionManager;
    }

    @Override
    public List<Question> findAll() throws DatabaseOperationException {
        String sql = "SELECT question_id, title, question_text, code_snippet, category, " +
                     "difficulty, options_json, correct_option_index, explanation, points, tags_json " +
                     "FROM questions ORDER BY question_id ASC";

        List<Question> list = new ArrayList<>();

        try (Connection conn = connectionManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                list.add(mapRowToQuestion(rs));
            }
            return list;

        } catch (SQLException e) {
            throw new DatabaseOperationException("Error retrieving all questions from database", e);
        }
    }

    @Override
    public List<Question> findByCategory(String category) throws DatabaseOperationException {
        String sql = "SELECT question_id, title, question_text, code_snippet, category, " +
                     "difficulty, options_json, correct_option_index, explanation, points, tags_json " +
                     "FROM questions WHERE category = ? ORDER BY question_id ASC";

        List<Question> list = new ArrayList<>();

        try (Connection conn = connectionManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, category);

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(mapRowToQuestion(rs));
                }
            }
            return list;

        } catch (SQLException e) {
            throw new DatabaseOperationException("Error querying questions by category: " + category, e);
        }
    }

    @Override
    public Optional<Question> findById(String id) throws DatabaseOperationException {
        String sql = "SELECT question_id, title, question_text, code_snippet, category, " +
                     "difficulty, options_json, correct_option_index, explanation, points, tags_json " +
                     "FROM questions WHERE question_id = ?";

        try (Connection conn = connectionManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, id);

            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapRowToQuestion(rs));
                }
            }
            return Optional.empty();

        } catch (SQLException e) {
            throw new DatabaseOperationException("Error querying question with ID: " + id, e);
        }
    }

    @Override
    public void save(Question question) throws DatabaseOperationException {
        String sql = "INSERT INTO questions (question_id, title, question_text, code_snippet, category, " +
                     "difficulty, options_json, correct_option_index, explanation, points, tags_json) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) " +
                     "ON DUPLICATE KEY UPDATE " +
                     "title=VALUES(title), question_text=VALUES(question_text), code_snippet=VALUES(code_snippet), " +
                     "category=VALUES(category), difficulty=VALUES(difficulty), options_json=VALUES(options_json), " +
                     "correct_option_index=VALUES(correct_option_index), explanation=VALUES(explanation), " +
                     "points=VALUES(points), tags_json=VALUES(tags_json)";

        try (Connection conn = connectionManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, question.getId());
            ps.setString(2, question.getTitle());
            ps.setString(3, question.getQuestionText());
            ps.setString(4, question.getCodeSnippet());
            ps.setString(5, question.getCategory());
            ps.setString(6, question.getDifficulty());
            ps.setString(7, GSON.toJson(question.getOptions()));
            ps.setInt(8, question.getCorrectOptionIndex());
            ps.setString(9, question.getExplanation());
            ps.setInt(10, question.getPoints());
            ps.setString(11, GSON.toJson(question.getTags()));

            ps.executeUpdate();

        } catch (SQLException e) {
            throw new DatabaseOperationException("Error saving question: " + question.getId(), e);
        }
    }

    @Override
    public boolean deleteById(String id) throws DatabaseOperationException {
        String sql = "DELETE FROM questions WHERE question_id = ?";

        try (Connection conn = connectionManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, id);
            int rowsAffected = ps.executeUpdate();
            return rowsAffected > 0;

        } catch (SQLException e) {
            throw new DatabaseOperationException("Error deleting question with ID: " + id, e);
        }
    }

    private Question mapRowToQuestion(ResultSet rs) throws SQLException {
        String id = rs.getString("question_id");
        String title = rs.getString("title");
        String questionText = rs.getString("question_text");
        String codeSnippet = rs.getString("code_snippet");
        String category = rs.getString("category");
        String difficulty = rs.getString("difficulty");
        String optionsJson = rs.getString("options_json");
        int correctOptionIndex = rs.getInt("correct_option_index");
        String explanation = rs.getString("explanation");
        int points = rs.getInt("points");
        String tagsJson = rs.getString("tags_json");

        List<String> options = new ArrayList<>();
        if (optionsJson != null && !optionsJson.isBlank()) {
            List<String> parsed = GSON.fromJson(optionsJson, STRING_LIST_TYPE);
            if (parsed != null) options = parsed;
        }

        List<String> tags = new ArrayList<>();
        if (tagsJson != null && !tagsJson.isBlank()) {
            List<String> parsed = GSON.fromJson(tagsJson, STRING_LIST_TYPE);
            if (parsed != null) tags = parsed;
        }

        return new Question(id, title, questionText, codeSnippet, category, 
                            difficulty, options, correctOptionIndex, explanation, points, tags);
    }
}
