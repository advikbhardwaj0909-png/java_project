package com.javamaster.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

/**
 * Encapsulated domain model representing a Java assessment question.
 */
public class Question implements Serializable {
    private static final long serialVersionUID = 1L;

    private String id;
    private String title;
    private String questionText;
    private String codeSnippet;
    private String category;
    private String difficulty;
    private List<String> options;
    private int correctOptionIndex;
    private String explanation;
    private int points;
    private List<String> tags;

    public Question() {
        this.options = new ArrayList<>();
        this.tags = new ArrayList<>();
        this.points = 10;
        this.difficulty = "Intermediate";
    }

    public Question(String id, String title, String questionText, String codeSnippet, 
                    String category, String difficulty, List<String> options, 
                    int correctOptionIndex, String explanation, int points, List<String> tags) {
        this.id = id;
        this.title = title;
        this.questionText = questionText;
        this.codeSnippet = codeSnippet;
        this.category = category;
        this.difficulty = (difficulty != null && !difficulty.isBlank()) ? difficulty : "Intermediate";
        this.options = (options != null) ? new ArrayList<>(options) : new ArrayList<>();
        this.correctOptionIndex = correctOptionIndex;
        this.explanation = explanation;
        this.points = points > 0 ? points : 10;
        this.tags = (tags != null) ? new ArrayList<>(tags) : new ArrayList<>();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public String getCodeSnippet() {
        return codeSnippet;
    }

    public void setCodeSnippet(String codeSnippet) {
        this.codeSnippet = codeSnippet;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public List<String> getOptions() {
        return Collections.unmodifiableList(options);
    }

    public void setOptions(List<String> options) {
        this.options = (options != null) ? new ArrayList<>(options) : new ArrayList<>();
    }

    public int getCorrectOptionIndex() {
        return correctOptionIndex;
    }

    public void setCorrectOptionIndex(int correctOptionIndex) {
        this.correctOptionIndex = correctOptionIndex;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    public int getPoints() {
        return points;
    }

    public void setPoints(int points) {
        this.points = points;
    }

    public List<String> getTags() {
        return Collections.unmodifiableList(tags);
    }

    public void setTags(List<String> tags) {
        this.tags = (tags != null) ? new ArrayList<>(tags) : new ArrayList<>();
    }

    public boolean isOptionValid(int index) {
        return index >= 0 && index < options.size();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Question question = (Question) o;
        return Objects.equals(id, question.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "Question{" +
                "id='" + id + '\'' +
                ", title='" + title + '\'' +
                ", category='" + category + '\'' +
                ", difficulty='" + difficulty + '\'' +
                ", points=" + points +
                '}';
    }
}
