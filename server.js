const path = require(`path`)
const express = require(`express`);
const session = require(`express-session`);
const app = express();
const dateTimeFormatters = require(`./utils/formatDateTime`)
const isEqual = require(`./utils/isEqual`)
const exphbs = require('express-handlebars');
const PORT = process.env.PORT || 3001;
const routes = require(`./controllers`);
const logger = require("morgan");

const helpers = {
  ...dateTimeFormatters,
  isEqual,
}


// Database connection
const sequelize = require(`./config/connection`);
// allows express-session to store session values in the database session temporary table
const SequelizeStore = require(`connect-session-sequelize`)(session.Store);

// Options object to pass to the middleware in the app.use(session()) call.
const sess = {
  // This is the secret used to sign the session ID cookie.
  // secret: 'Super secret secret',
  secret: process.env.SESSION_SECRET,

  // Settings object for the session ID cookie. The default value is { path: '/', httpOnly: true, secure: false, maxAge: null }.
  cookie: {
    maxAge: 900000, //Session will expire after 15 minutes of inactivity.
  },

  // Forces the session to be saved back to the session store, even if the session was never modified during the request.
  resave: true,

  // Forces a session that is "uninitialized" to be saved to the store. A session is uninitialized when it is new but not modified. 
  saveUninitialized: true,

  // Resets the expiration date to "maxAge" value on every response. Allows the session to continue past maxAge from session initialization as long as the user continues to interact with the website while the session is valid.
  rolling: true,

  // The session store instance, defaults to a new MemoryStore instance, but we are manually setting it to the express-session-sequelize so that it will save session data in a temporary SQL Table.
  store: new SequelizeStore({
    db: sequelize
  })
};


// Tell express to use the express-session middleware, which will save only the sessionID to the HTTP req/res. The actual session data is saved on the server side in the SQL database as defined above in the "store" option of the "sess" options object. 
app.use(session(sess));



// Set Handlebars as View Engine
const hbs = exphbs.create({ helpers });
app.set('view engine', 'handlebars')
app.engine('handlebars', hbs.engine);


// Tell Express to use the public folder to server up static files (mainly client-side scripts and CSS because we are using handlebars view engine)
app.use(express.static(path.join(__dirname, 'public')));

// Tell Express to parse incoming JSON data and URL-encoded data in a way that can be accessed in the routes via req.body.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log all incoming requests to the server.
app.use(logger("dev"));

// Tell Express to use the router setup in the controllers folder
app.use(routes);

// Tell Express server to begin accepting http requests
sequelize.sync({ force: false }).then(
  () => {
    app.listen(PORT, () => {
      console.log(`App is listening at http://localhost:${PORT}`)
    });
  });