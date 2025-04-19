/*
    Tyler Millershaski
    CSS 355 Midterm
*/


import { createServer } from "http";
import express, {Express, Request, Response } from "express"; 
import helmet from "helmet";
import { engine } from "express-handlebars"; 
import { Get404PageString} from "./FileTemplates";


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

    
app.use(helmet());
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



// import { ResetDatabase } from "./config/DatabaseReset"
// ResetDatabase();