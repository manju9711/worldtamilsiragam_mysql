// const mysql = require('mysql2');
// const logger = require('../logger'); // Adjust path if needed
// require('dotenv').config();

// const pool = mysql.createPool({
//   host: process.env.MYSQL_HOST,
//   user: process.env.MYSQL_USER,
//   password: process.env.MYSQL_PASSWORD,
//   database: process.env.MYSQL_DATABASE,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

// // Check database connection
// pool.getConnection((err, connection) => {
//   if (err) {
//     logger.error('Failed to connect to MySQL', { error: err.message });
//     process.exit(1);
//   }
//   logger.info('Connected to MySQL Database');
//   connection.release();
// });

// module.exports = pool.promise(); // Use promise-based queries


const { Sequelize } = require('sequelize');
const logger = require('../logger'); // Adjust path if needed
require('dotenv').config();

// Set up Sequelize connection
const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE, 
  process.env.MYSQL_USER, 
  process.env.MYSQL_PASSWORD, {
    host: process.env.MYSQL_HOST,
    dialect: 'mysql',
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,  // 30s timeout for acquiring a connection
      idle: 10000      // 10s idle timeout
    }
  }
);

// Check database connection
sequelize.authenticate()
  .then(() => {
    logger.info('Connected to MySQL Database');
  })
  .catch(err => {
    logger.error('Failed to connect to MySQL', { error: err.message });
    process.exit(1);
  });

module.exports = sequelize; // Export the Sequelize instance
