package com.javamaster.service;

import com.javamaster.model.EvaluationResult;
import com.javamaster.model.Question;

import java.util.List;
import java.util.Map;

/**
 * Strategy interface defining the contract for quiz scoring algorithms.
 * Allows polymorphic scoring engines (e.g., standard linear scoring vs penalty-deduction scoring).
 */
public interface IScoringEngine {

    /**
     * Evaluates a set of user answers against the question answer key.
     *
     * @param questions   The list of questions presented in the quiz session.
     * @param userAnswers Map of question ID to the candidate's chosen option index.
     * @return EvaluationResult containing total score, accuracy, and category breakdown.
     */
    EvaluationResult evaluate(List<Question> questions, Map<String, Integer> userAnswers);

    /**
     * Retrieves the pass threshold percentage configured for this scoring engine.
     *
     * @return Minimum accuracy percentage required to pass.
     */
    double getPassThresholdPercentage();
}
