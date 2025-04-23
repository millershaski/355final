/*
    Tyler Millershaski
    CSS 355 Final Project
*/


import { createServer } from "http";
import express, {Express, Request, Response } from "express"; 
import helmet from "helmet";
import { engine } from "express-handlebars"; 
import { Get404PageString} from "./FileTemplates";
import { sequelize } from "./config/SequelizeInstance";


const cookieParser = require('cookie-parser');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const routes = require('./controllers'); 
const port = 5000;

const app: Express = express(); 


// initialize express
app.set("views", "views/server");
app.engine("handlebars", engine());
app.set("view engine", "handlebars");



// Middle-ware Section

// logging middle-ware (placing at the top so that it's always invoked)
app.use((req: Request, resp: Response, next) =>
{
    // note that duplicates are probably because of the favicon.ico request
    console.log("A request was received: " + req.method + " for " + req.url);
    next(); // without a next, this request will die here
});

// parses cookies
app.use(cookieParser());
    
app.use(helmet());
app.use(helmet.contentSecurityPolicy(
  {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://cdn.jsdelivr.net"], // this will allow js from bootstrap
      styleSrc: ["'self'", "https://cdn.jsdelivr.net", "'unsafe-inline'"], // this will allow css from bootstrap and inline (inline css should be safe?)
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  })
);

const store = new SequelizeStore({ db: sequelize });
import {SecretKey} from "./config/SecretKey"

// Setup session middleware with options
app.use(session({
  secret: SecretKey,
  store: store, // Use Sequelize store for session data
  resave: false,
  saveUninitialized: false,
  cookie: {
  secure: false, // Set to true if HTTPS is enabled
  maxAge: 1000 * 60 * 30, // 30 minutes session timeout
  }
}));
// Sync the session store to create the sessions table in SQLite
store.sync();
  

  
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // parses URL-encoded payloads (useful for form submissions).

app.use(routes); 

app.use(express.static("static")); 
app.use(express.static("node_modules/bootstrap/dist"));



// this will automatically return a 404 for any non-defined route.
// It's important that this is at the bottom, so that we only get here if the response didn't have a route
app.use((req:Request, resp: Response, next) => 
{
    console.log("Defaulting to 404");

    resp.status(404).send(Get404PageString());
    next();
});



// create and start server
const server = createServer(app);
server.listen(port, () => console.log(`HTTP Server listening on port ${port}`));



import { ResetDatabase, EnsureProject } from "./config/DatabaseReset"

// one of these must be uncommented
ResetDatabase(); // for dev, wipes the db upon every server start
// EnsureProject();