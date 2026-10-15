package com.javamaster.servlet;

import com.google.gson.Gson;
import com.javamaster.dao.IQuestionDAO;
import com.javamaster.dao.QuestionDAOImpl;
import com.javamaster.exception.DatabaseOperationException;
import com.javamaster.model.Question;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Jakarta Servlet exposing RESTful JSON endpoints for question retrieval.
 * Handled routes: GET /api/questions (with optional ?category= parameter).
 */
@WebServlet(name = "QuestionServlet", urlPatterns = {"/api/questions"})
public class QuestionServlet extends HttpServlet {

    private static final Logger LOGGER = Logger.getLogger(QuestionServlet.class.getName());
    private static final Gson GSON = new Gson();

    private IQuestionDAO questionDAO;

    @Override
    public void init() throws ServletException {
        super.init();
        this.questionDAO = new QuestionDAOImpl();
    }

    // Constructor injection for unit testing
    public QuestionServlet(IQuestionDAO questionDAO) {
        this.questionDAO = questionDAO;
    }

    public QuestionServlet() {
        // Default constructor for Servlet container
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        String category = req.getParameter("category");
        PrintWriter out = resp.getWriter();

        try {
            List<Question> questions;
            if (category != null && !category.isBlank() && !category.equalsIgnoreCase("All")) {
                questions = questionDAO.findByCategory(category.trim());
            } else {
                questions = questionDAO.findAll();
            }

            resp.setStatus(HttpServletResponse.SC_OK);
            out.print(GSON.toJson(questions));

        } catch (DatabaseOperationException e) {
            LOGGER.log(Level.SEVERE, "Failed to fetch questions from database", e);
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);

            Map<String, Object> errorPayload = new HashMap<>();
            errorPayload.put("error", "Database error occurred while retrieving questions.");
            errorPayload.put("details", e.getMessage());
            out.print(GSON.toJson(errorPayload));
        } finally {
            out.flush();
        }
    }
}
