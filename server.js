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
let corsOptions = {
  origin: 'localhost:3000',
  credentials: true
}


initEnv().then(async () =>{

    const { APP_PORT } = process.env;
    const app = express();
    const { default: router } = await import("./route/index.js");
    const { default: socket } = await import("./socket.js");
    app.use(router);
    
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
    app.use(morganChalk); //로그 띄우기 색ㅏ별로


    app.use(cors(corsOptions)); // cors
    app.use(helmet.hidePoweredBy()); // 헤더에서 X-Powered-By를 제거한다.
    app.use(helmet.noSniff());// 리소스를 내려받을 때 MIME 타입을 보고 동작하기에 정확한 설정이 중요하다.
    app.use(bearerToken());  //토큰 자동으로 찾아줌
    app.use(express.json()); //json으로 이루어진 Request Body를 받았을 경우, 요청값을 제대로 받아오지 못하는 문제가 발생한다.
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
        //console.log("위도,",geo.ll[0]);
        //console.log("경도,",geo.ll[1]);
        res.status(200).json({
            success: true,clientIp , kk : req.clientIp2 , //latitude : geo.ll[0] , longitude : geo.ll[1]
          });
    });
    app.post('/p2', (req, res) => {
      res.status(200).json({
          success: true,
        });
        
    app.use((err, req, res, next) => {
      // 컨트롤러에서 에러 발생시 처리
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


