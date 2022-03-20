import express from "express"
import initEnv from "./config/env/index.js"
import path from 'path';
import http from "http";

initEnv().then(async () =>{

    const { APP_PORT } = process.env;
    const app = express();

    app.get('/', (req, res) => {
        res.json({
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


