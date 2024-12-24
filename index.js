const express = require("express");
const axios = require("axios");
const app = express();

const API_BASE_URL = "http://168.90.5.62:8080";

app.use(express.raw({ type: "*/*" }));

app.all("*", async (req, res) => {
  const { method, url, headers } = req;

  delete headers.host;
  delete headers["content-length"];

  const response = await axios({
    method,
    url: `${API_BASE_URL}${url}`,
    headers,
    data: req.body,
    responseType: "arraybuffer",
    validateStatus: false,
  });

  res.set("Content-Type", response.headers["content-type"]);

  Object.entries(response.headers).forEach(([key, value]) => {
    res.set(key, value);
  });

  res.status(response.status).send(response.data);
});

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
