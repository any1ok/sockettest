import express from "express"
import initEnv from "./config/env/index.js"
import path from 'path';
import http from "http";
import morgan from "morgan";
import chalk from "chalk";
import moment from "moment"
import helmet from "helmet"

initEnv().then(async () =>{

    const { APP_PORT } = process.env;
    const app = express();
    const { default: router } = await import("./route/index.js");

    

    morgan.token("customDate", () => moment().format("YYYY-MM-DD HH:mm:ss"));
    
    
    const morganChalk = morgan(
      (tokens, req, res) => {
        
        const methodColor = (() => {
          switch (req.method) {
            case "GET":
              return "bgGreen";
            case "POST":
              return "bgYellow";
            case "DELETE":
              return "bgRed";
            case "PATCH":
              return "bgCyan";
            case "PUT":
              return "bgWhite";
            default:
              return "bgWhite";
          }
        })();
        const statusColor = (() => {
          const status = Math.floor(parseInt(tokens.status(req, res)) / 100);
          switch (status) {
            case 2:
              return "green";
            case 3:
              return "blue";
            case 4:
              return "yellow";
            case 5:
              return "red";
            default:
              return "white";
          }
        })();
        return [
          tokens.customDate(), // date
          chalk[methodColor].black(tokens.method(req)), // http method
          tokens.url(req, res), // uri
          chalk[statusColor](tokens.status(req, res)), // response status
        ].join(" ");
      } /* 
    {
      skip: (req, res) => {
        return req.method === 'OPTIONS';
      },
    } */
    );
     app.use(morganChalk);


    app.use(helmet.hidePoweredBy());
    app.use(helmet.noSniff());
    
    app.get('/p', (req, res) => {
        res.status(404).json({
            success: true,
          });
    });
    const server = http.createServer(app);
    server.listen(APP_PORT, "0.0.0.0", () => {
      console.log(`[Server] running on ${APP_PORT}`);
    });
}).catch((err) => {
    console.log("[ENV] FAILURE");
    console.log(err);
  });


