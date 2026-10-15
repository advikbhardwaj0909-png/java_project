package com.javamaster.model;

import java.io.Serializable;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

/**
 * Encapsulates the quantitative performance evaluation of a quiz submission.
 */
public class EvaluationResult implements Serializable {
    private static final long serialVersionUID = 1L;

    private double score;
    private int maxScore;
    private double accuracyPercentage;
    private int correctCount;
    private int totalQuestions;
    private boolean passed;
    private Map<String, CategoryStat> categoryBreakdown;

    public static class CategoryStat implements Serializable {
        private static final long serialVersionUID = 1L;
        private int correct;
        private int total;

        public CategoryStat() {
            this.correct = 0;
            this.total = 0;
        }

        public CategoryStat(int correct, int total) {
            this.correct = correct;
            this.total = total;
        }

        public int getCorrect() {
            return correct;
        }

        public void incrementCorrect() {
            this.correct++;
        }

        public int getTotal() {
            return total;
        }

        public void incrementTotal() {
            this.total++;
        }

        public double getAccuracy() {
            return total > 0 ? (double) correct / total * 100.0 : 0.0;
        }
    }

    public EvaluationResult() {
        this.categoryBreakdown = new HashMap<>();
    }

    public EvaluationResult(double score, int maxScore, int correctCount, int totalQuestions, boolean passed) {
        this.score = score;
        this.maxScore = maxScore;
        this.correctCount = correctCount;
        this.totalQuestions = totalQuestions;
        this.passed = passed;
        this.accuracyPercentage = totalQuestions > 0 ? ((double) correctCount / totalQuestions) * 100.0 : 0.0;
        this.categoryBreakdown = new HashMap<>();
    }

    public double getScore() {
        return score;
    }

    public void setScore(double score) {
        this.score = score;
    }

    public int getMaxScore() {
        return maxScore;
    }

    public void setMaxScore(int maxScore) {
        this.maxScore = maxScore;
    }

    public double getAccuracyPercentage() {
        return accuracyPercentage;
    }

    public void setAccuracyPercentage(double accuracyPercentage) {
        this.accuracyPercentage = accuracyPercentage;
    }

    public int getCorrectCount() {
        return correctCount;
    }

    public void setCorrectCount(int correctCount) {
        this.correctCount = correctCount;
    }

    public int getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(int totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public boolean isPassed() {
        return passed;
    }

    public void setPassed(boolean passed) {
        this.passed = passed;
    }

    public Map<String, CategoryStat> getCategoryBreakdown() {
        return Collections.unmodifiableMap(categoryBreakdown);
    }

    public void addCategoryResult(String category, boolean isCorrect) {
        categoryBreakdown.putIfAbsent(category, new CategoryStat());
        CategoryStat stat = categoryBreakdown.get(category);
        stat.incrementTotal();
        if (isCorrect) {
            stat.incrementCorrect();
        }
    }

    @Override
    public String toString() {
        return "EvaluationResult{" +
                "score=" + score +
                "/" + maxScore +
                ", accuracyPercentage=" + accuracyPercentage +
                "%, correctCount=" + correctCount +
                "/" + totalQuestions +
                ", passed=" + passed +
                '}';
    }
}
