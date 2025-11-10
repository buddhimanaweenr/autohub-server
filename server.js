const http = require("http");
const https = require("https");
const fs = require("fs");

const app = require("./app");
const mongoConnect = require("./util/database").mongoConnect;

const port = process.env.PORT || 8001;
let server = null;

if (process.env.ENV === "DEV") {
  server = http.createServer(app);
} else {
  // You can add HTTPS logic here if needed in production
  // Example (just for future setup):
  // const options = {
  //   key: fs.readFileSync('path/to/key.pem'),
  //   cert: fs.readFileSync('path/to/cert.pem')
  // };
  // server = https.createServer(options, app);
}

mongoConnect(() => {
  if (server) {
    server.listen(port, "0.0.0.0", () => {
      console.log(`${process.env.ENV} Server running at: http://localhost:${port}`);
    });
    server.timeout = 600001;
  } else {
    console.error("Server not initialized!");
  }
});
