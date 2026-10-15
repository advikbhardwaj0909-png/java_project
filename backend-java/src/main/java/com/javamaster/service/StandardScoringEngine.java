package com.javamaster.service;

import com.javamaster.model.EvaluationResult;
import com.javamaster.model.Question;

import java.util.List;
import java.util.Map;

/**
 * Standard implementation of IScoringEngine.
 * Awards full question points for correct answers and zero points for incorrect or unanswered questions.
 */
public class StandardScoringEngine implements IScoringEngine {

    private final double passThresholdPercentage;

    public StandardScoringEngine() {
        this(70.0); // Default 70% passing threshold
    }

    public StandardScoringEngine(double passThresholdPercentage) {
        if (passThresholdPercentage < 0 || passThresholdPercentage > 100) {
            throw new IllegalArgumentException("Pass threshold percentage must be between 0.0 and 100.0");
        }
        this.passThresholdPercentage = passThresholdPercentage;
    }

    @Override
    public EvaluationResult evaluate(List<Question> questions, Map<String, Integer> userAnswers) {
        if (questions == null || questions.isEmpty()) {
            return new EvaluationResult(0.0, 0, 0, 0, false);
        }

        double totalScore = 0.0;
        int maxScore = 0;
        int correctCount = 0;
        int totalQuestions = questions.size();

        EvaluationResult result = new EvaluationResult();
        result.setTotalQuestions(totalQuestions);

        for (Question question : questions) {
            maxScore += question.getPoints();
            String qId = question.getId();
            Integer selectedOption = (userAnswers != null) ? userAnswers.get(qId) : null;

            boolean isCorrect = false;
            if (selectedOption != null && selectedOption == question.getCorrectOptionIndex()) {
                totalScore += question.getPoints();
                correctCount++;
                isCorrect = true;
            }

            result.addCategoryResult(question.getCategory(), isCorrect);
        }

        result.setScore(totalScore);
        result.setMaxScore(maxScore);
        result.setCorrectCount(correctCount);
        double accuracy = totalQuestions > 0 ? ((double) correctCount / totalQuestions) * 100.0 : 0.0;
        result.setAccuracyPercentage(Math.round(accuracy * 100.0) / 100.0);
        result.setPassed(accuracy >= passThresholdPercentage);

        return result;
    }

    @Override
    public double getPassThresholdPercentage() {
        return passThresholdPercentage;
    }
}
