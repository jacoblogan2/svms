import dotenv from "dotenv";
import PaypackJs from "paypack-js";

dotenv.config();

const paypack = new PaypackJs.default({
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
});

export default paypack;
