import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import cron from "node-cron";
// import currentVer from "./v1";
// import forTester from "./forTester";

const router = express.Router();

router.get('/socket', (req, res) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    res.sendFile(path.resolve(__dirname+'/../socket.html'));
  });


  var task = cron.schedule('* * * * *', function () {
    console.log('매 분 마다 작업 실행');
  }, {
    scheduled: false //작동안하다 task.start() 하면 시작
  });

router.get('/cron', (req, res) => {
  task.start();
  res.end();
  });


// router.use("/", currentVer);
// router.use("/test", forTester);

export default router;
