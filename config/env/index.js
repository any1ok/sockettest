import path from "path";
import dotenv from "dotenv";
import fs from "fs";
import { fileURLToPath } from 'url';
//import { decrypt } from "config/aws";

const encryptedKey = {
  local: [],
  develop: [],
  production: [
    "MYSQL_HOST",
    "MYSQL_PORT",
    "MYSQL_DB",
    "MYSQL_USER",
    "MYSQL_PW",
    "MYSQL_POOLSIZE",
    "S3_BUCKET",
    "S3_URL",
    "SEND_EMAIL",
    "APP_LAUNCH",
    "APP_POLICY_PRIVACY",
    "APP_POLICY_SERVICE",
    "ADMIN_URL",
    "SECRET",
    "APP_HOST",
    "APP_PORT",
    "API_VERSION",
    "CERT_SITE_CODE",
    "CERT_SITE_PW",
    "CERT_MODULE_PATH",
  ],
};

// const optionalDecrypt = async (text) => {
//   try {
//     return await decrypt(text);
//   } catch (err) {
//     throw text;
//   }
// };

export default async () => {
  const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
  switch (process.env.NODE_ENV) {
    case "local":
    case "develop":
    case "production":
      /* dotenv.config({
        path: path.join(__dirname, `./.env.${process.env.NODE_ENV}`),
      }); */
      const envConfig = dotenv.parse(
        fs.readFileSync(path.join(__dirname, `./.env.${process.env.NODE_ENV}`))
      );

      for (const key of Object.keys(envConfig)) {
        if (encryptedKey[process.env.NODE_ENV].includes(key)) {
          //process.env[key] = await optionalDecrypt(envConfig[key]);
          process.env[key] = envConfig[key];
        } else {
          process.env[key] = envConfig[key];
        }
      }

      console.log("[ENV] SET");
      break;
    default:
      throw new Error("process.env.NODE_ENV를 설정하지 않았습니다!");
  }
};
