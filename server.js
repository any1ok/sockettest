import express from "express"
import initEnv from "./config/env/index.js"
import path from 'path';
import http from "http";
import morgan from "morgan";
import chalk from "chalk";
import moment from "moment"
import helmet from "helmet"
import cors from "cors"
import requestIp from "request-ip";
import geoip from "geoip-lite"
import bearerToken from "express-bearer-token";
import cron from "node-cron";
import cacheControl from "express-cache-controller"
import ejs from "ejs"
let corsOptions = {
  origin: 'localhost:3000',
  credentials: true
}
const startAt = '2022-04-25'
const curDate = moment().format("YYYY-MM-DD");
const challengeStartAt = moment(startAt).format("YYYY-MM-DD");
const monday = moment(startAt).day('monday').format("YYYY-MM-DD");


let tmp2 = [0,0,0,0,0,0,0];
      for(let i =0;i<7;i++){
        const momentTmp = moment(monday).add(i,'days').format("YYYY-MM-DD");
        if(challengeStartAt>momentTmp && monday <= momentTmp){
          tmp2[i] = -1;
        }
        if(curDate< momentTmp ){
          tmp2[i] = -1;
        }

      }
console.log(tmp2);
console.log(challengeStartAt)
initEnv().then(async () =>{

    const { APP_PORT } = process.env;
    const app = express();
    const { default: router } = await import("./route/index.js");
    const { default: socket } = await import("./socket.js");
    app.use(router);
    
    morgan.token("customDate", () => moment().format("YYYY-MM-DD HH:mm:ss"));
    
    app.set('view engine', 'ejs');
    app.set('views', './views');
    
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
    app.use(morganChalk); //?????? ????????? ????????????


    app.use(cors(corsOptions)); // cors
    app.use(helmet.hidePoweredBy()); // ???????????? X-Powered-By??? ????????????.
    app.use(helmet.noSniff());// ???????????? ???????????? ??? MIME ????????? ?????? ??????????????? ????????? ????????? ????????????.
    app.use(bearerToken());  //?????? ???????????? ?????????
    app.use(express.json()); //json?????? ???????????? Request Body??? ????????? ??????, ???????????? ????????? ???????????? ????????? ????????? ????????????.
    app.use(express.urlencoded({ extended: true }));
    app.use(
      cacheControl({
        maxAge: 0,
        noCache: true,
      })
    );
    app.use(requestIp.mw())
    app.use(function(req, res, next) {
        const ip = req.clientIp;
        req.clientIp2 = ip;
        next();
    });
    
    app.get('/p', (req, res) => {
      const clientIp = requestIp.getClientIp(req); 
      let geo = geoip.lookup();
        //console.log("??????,",geo.ll[0]);
        //console.log("??????,",geo.ll[1]);
        res.status(200).json({
            success: true,clientIp , kk : req.clientIp2 , //latitude : geo.ll[0] , longitude : geo.ll[1]
          });
    });
    app.post('/p2', (req, res) => {
      res.status(200).json({
          success: true,
        });
        
    app.use((err, req, res, next) => {
      // ?????????????????? ?????? ????????? ??????
      console.log(err);
      return res.status(err.code || 500).json({
        message: err.message,
        type: err.type || "INTERNAL_SERVER_ERROR",
        reason: err.reason,
        payload: err.payload,
      });
    });
      
    
  });
  const server = http.createServer(app);
  socket.init(server);
    server.listen(APP_PORT, "0.0.0.0", () => {
      console.log(`[Server] running on ${APP_PORT}`);
    });

    
}).catch((err) => {
    console.log("[ENV] FAILURE");
    console.log(err);
  });


