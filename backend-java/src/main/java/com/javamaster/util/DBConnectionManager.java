package com.javamaster.util;

import com.javamaster.exception.DatabaseOperationException;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

import java.io.InputStream;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Thread-safe singleton connection manager providing pooled JDBC connections.
 * Configuration is loaded from db.properties with environment variable override support.
 */
public class DBConnectionManager {

    private static final Logger LOGGER = Logger.getLogger(DBConnectionManager.class.getName());
    private static volatile DBConnectionManager instance;
    private HikariDataSource dataSource;

    private DBConnectionManager() {
        initializeDataSource();
    }

    public static DBConnectionManager getInstance() {
        if (instance == null) {
            synchronized (DBConnectionManager.class) {
                if (instance == null) {
                    instance = new DBConnectionManager();
                }
            }
        }
        return instance;
    }

    private void initializeDataSource() {
        Properties props = new Properties();

        // 1. Load properties from classpath
        try (InputStream input = getClass().getClassLoader().getResourceAsStream("db.properties")) {
            if (input != null) {
                props.load(input);
            } else {
                LOGGER.warning("db.properties not found in classpath. Relying on environment variables or defaults.");
            }
        } catch (Exception e) {
            LOGGER.log(Level.WARNING, "Failed to read db.properties file", e);
        }

        // 2. Resolve parameters with environment variable override preference
        String driver = getEnvOrProp("DB_DRIVER", props.getProperty("db.driver", "com.mysql.cj.jdbc.Driver"));
        String url = getEnvOrProp("DB_URL", props.getProperty("db.url", "jdbc:mysql://localhost:3306/quiz_platform?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&characterEncoding=UTF-8"));
        String username = getEnvOrProp("DB_USERNAME", props.getProperty("db.username", "root"));
        String password = getEnvOrProp("DB_PASSWORD", props.getProperty("db.password", ""));

        try {
            Class.forName(driver);
        } catch (ClassNotFoundException e) {
            LOGGER.log(Level.SEVERE, "JDBC Driver class not found: " + driver, e);
        }

        HikariConfig config = new HikariConfig();
        config.setDriverClassName(driver);
        config.setJdbcUrl(url);
        config.setUsername(username);
        config.setPassword(password);

        // Pool tuning parameters
        config.setMaximumPoolSize(Integer.parseInt(props.getProperty("db.pool.maximumPoolSize", "10")));
        config.setMinimumIdle(Integer.parseInt(props.getProperty("db.pool.minimumIdle", "2")));
        config.setIdleTimeout(Long.parseLong(props.getProperty("db.pool.idleTimeout", "30000")));
        config.setConnectionTimeout(Long.parseLong(props.getProperty("db.pool.connectionTimeout", "20000")));
        config.setMaxLifetime(Long.parseLong(props.getProperty("db.pool.maxLifetime", "1800000")));
        config.setPoolName("JavaMaster-HikariPool");

        try {
            this.dataSource = new HikariDataSource(config);
            LOGGER.info("HikariCP Connection Pool successfully initialized for: " + url);
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Failed to initialize HikariDataSource", e);
        }
    }

    private String getEnvOrProp(String envKey, String fallback) {
        String envVal = System.getenv(envKey);
        if (envVal != null && !envVal.trim().isEmpty()) {
            return envVal.trim();
        }
        return fallback != null ? fallback.trim() : "";
    }

    /**
     * Obtains an active connection from the pool.
     * Callers MUST close the connection (preferably via try-with-resources) to return it to the pool.
     *
     * @return java.sql.Connection
     * @throws DatabaseOperationException if the pool is exhausted or database is unreachable
     */
    public Connection getConnection() throws DatabaseOperationException {
        if (dataSource == null || dataSource.isClosed()) {
            throw new DatabaseOperationException("Database connection pool is not initialized or has been closed.");
        }
        try {
            return dataSource.getConnection();
        } catch (SQLException e) {
            throw new DatabaseOperationException("Unable to acquire JDBC connection from pool: " + e.getMessage(), e);
        }
    }

    /**
     * Gracefully closes the connection pool during application shutdown.
     */
    public synchronized void shutdown() {
        if (dataSource != null && !dataSource.isClosed()) {
            dataSource.close();
            LOGGER.info("HikariCP Connection Pool closed.");
        }
    }
}
