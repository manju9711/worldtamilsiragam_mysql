// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const multilingualRoutes = require('./routes/multilingualRoutes');
// const visionRoutes = require('./routes/visionRoutes');
// const newsRoutes = require('./routes/newsRoutes');
// const festivalRoutes = require('./routes/festivalRoutes');
// const contactformRoutes = require('./routes/contactformRoutes');
// const structureRoutes = require('./routes/structureRoutes');
// const invitationRoutes = require('./routes/invitationRoutes');
// const publishRoutes = require('./routes/publishRoutes');
// const userRoutes = require('./routes/userRoutes');
// const membershipRoutes = require('./routes/membershipRoutes');
// const roleRoutes = require('./routes/roleRoutes');
// const tracksRoutes = require('./routes/tracksRoutes');
// const logger = require('./logger');
// const cors = require('cors');
// const { STATUS_CODES } = require('./util/constant');

// require('dotenv').config();

// const app = express();
// app.use(bodyParser.json());

// app.use(cors());

// app.use('/public', express.static(__dirname + '/public'));

// // Connect to MongoDB
// const host = process.env.HOST;
// const dbname = process.env.DBNAME;
// const user = process.env.DB_USER;
// const password = process.env.PASSWORD;

// const uri = `mongodb://${user}:${password}@${host}/${dbname}?authSource=admin`;
// mongoose.connect(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
//   .then(() => logger.info('Connected to MongoDB'))
//   .catch(err => logger.error('Failed to connect to MongoDB', { error: err.message }));

// // Use routes
// app.use('/api', multilingualRoutes);
// app.use('/api/vision', visionRoutes);
// app.use('/api/news', newsRoutes);
// app.use('/api/festival', festivalRoutes);
// app.use('/api/contact', contactformRoutes);
// app.use('/api/structure', structureRoutes);
// app.use('/api/invitation', invitationRoutes);
// app.use('/api/user', userRoutes);
// app.use('/api/role', roleRoutes);
// app.use('/api/publish', publishRoutes);
// app.use('/api/member', membershipRoutes);
// app.use('/api/tracks', tracksRoutes);

// app.get("/", (req, res) => {
//   return res.status(STATUS_CODES.SUCCESS).send(`Welcome to World Tamil siragam 🎉`);
// })
// // Start the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   logger.info(`Server is running on port ${PORT} ${host} ${dbname} ${user} ${password}`);
// });


const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const logger = require('./logger');
const { STATUS_CODES } = require('./util/constant');
require('dotenv').config();

const path = require('path');

// Import routes
const multilingualRoutes = require('./routes/multilingualRoutes');
const visionRoutes = require('./routes/visionRoutes');
const newsRoutes = require('./routes/newsRoutes');
const festivalRoutes = require('./routes/festivalRoutes');
const contactformRoutes = require('./routes/contactformRoutes');
const structureRoutes = require('./routes/structureRoutes');
const invitationRoutes = require('./routes/invitationRoutes');
const publishRoutes = require('./routes/publishRoutes');
const userRoutes = require('./routes/userRoutes');
const membershipRoutes = require('./routes/membershipRoutes');
const roleRoutes = require('./routes/roleRoutes');
const tracksRoutes = require('./routes/tracksRoutes');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Serve static files
// app.use('/public', express.static(__dirname + '/public'));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Use routes
app.use('/api', multilingualRoutes);
app.use('/api/vision', visionRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/festival', festivalRoutes);
app.use('/api/contact', contactformRoutes);
app.use('/api/structure', structureRoutes);
app.use('/api/invitation', invitationRoutes);
app.use('/api/user', userRoutes);
app.use('/api/role', roleRoutes);
app.use('/api/publish', publishRoutes);
app.use('/api/member', membershipRoutes);
app.use('/api/tracks', tracksRoutes);

app.get("/", (req, res) => {
  return res.status(STATUS_CODES.SUCCESS).send(`Welcome to World Tamil Siragam 🎉`);
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

