declare function require(moduleName: string): any;

if (process.env.NODE_ENV !== "production") {
  const dotenv: any = require("dotenv");
  dotenv.config();
}

import "./App";
