import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
// import currentVer from "./v1";
// import forTester from "./forTester";

const router = express.Router();

router.get('/socket', (req, res) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    res.sendFile(path.resolve(__dirname+'/../socket.html'));
  });
// router.use("/", currentVer);
// router.use("/test", forTester);

export default router;
