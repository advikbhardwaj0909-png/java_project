package com.javamaster.service;

import com.javamaster.model.EvaluationResult;
import com.javamaster.model.Question;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("StandardScoringEngine Unit Tests")
class StandardScoringEngineTest {

    private StandardScoringEngine scoringEngine;
    private List<Question> testQuestions;

    @BeforeEach
    void setUp() {
        scoringEngine = new StandardScoringEngine(70.0);
        testQuestions = new ArrayList<>();

        Question q1 = new Question();
        q1.setId("q-1");
        q1.setTitle("OOP Question 1");
        q1.setCategory("Core OOP");
        q1.setPoints(10);
        q1.setCorrectOptionIndex(1); // Option B

        Question q2 = new Question();
        q2.setId("q-2");
        q2.setTitle("Collections Question 2");
        q2.setCategory("Collections & Generics");
        q2.setPoints(10);
        q2.setCorrectOptionIndex(2); // Option C

        testQuestions.add(q1);
        testQuestions.add(q2);
    }

    @Test
    @DisplayName("Should award 100% score and mark as passed when all answers are correct")
    void testEvaluateAllCorrect() {
        Map<String, Integer> answers = new HashMap<>();
        answers.put("q-1", 1);
        answers.put("q-2", 2);

        EvaluationResult result = scoringEngine.evaluate(testQuestions, answers);

        assertEquals(20.0, result.getScore());
        assertEquals(20, result.getMaxScore());
        assertEquals(2, result.getCorrectCount());
        assertEquals(2, result.getTotalQuestions());
        assertEquals(100.0, result.getAccuracyPercentage());
        assertTrue(result.isPassed());

        // Verify category breakdown
        assertNotNull(result.getCategoryBreakdown().get("Core OOP"));
        assertEquals(1, result.getCategoryBreakdown().get("Core OOP").getCorrect());
        assertEquals(1, result.getCategoryBreakdown().get("Core OOP").getTotal());
    }

    @Test
    @DisplayName("Should award partial score (50%) and mark as failed when below 70% threshold")
    void testEvaluatePartialScoreFailsThreshold() {
        Map<String, Integer> answers = new HashMap<>();
        answers.put("q-1", 1); // Correct
        answers.put("q-2", 0); // Incorrect (expected 2)

        EvaluationResult result = scoringEngine.evaluate(testQuestions, answers);

        assertEquals(10.0, result.getScore());
        assertEquals(20, result.getMaxScore());
        assertEquals(1, result.getCorrectCount());
        assertEquals(50.0, result.getAccuracyPercentage());
        assertFalse(result.isPassed(), "50% should fail under a 70% threshold");
    }

    @Test
    @DisplayName("Should handle empty or unanswered questions gracefully")
    void testEvaluateEmptyAnswers() {
        Map<String, Integer> emptyAnswers = new HashMap<>();

        EvaluationResult result = scoringEngine.evaluate(testQuestions, emptyAnswers);

        assertEquals(0.0, result.getScore());
        assertEquals(20, result.getMaxScore());
        assertEquals(0, result.getCorrectCount());
        assertEquals(0.0, result.getAccuracyPercentage());
        assertFalse(result.isPassed());
    }

    @Test
    @DisplayName("Should throw IllegalArgumentException when pass threshold is out of range")
    void testInvalidThreshold() {
        assertThrows(IllegalArgumentException.class, () -> new StandardScoringEngine(-5.0));
        assertThrows(IllegalArgumentException.class, () -> new StandardScoringEngine(105.0));
    }
}
