const express = require("express");
const axios = require("axios");
const app = express();

const API_BASE_URL = "http://sleeve-api.surfvalley.com.br:4096/v1";

app.use(express.raw({ type: "*/*" }));

app.all("*", async (req, res) => {
  const { method, url, headers } = req;

  // Remove headers that might cause issues
  delete headers.host;
  delete headers["content-length"];

  const response = await axios({
    method,
    url: `${API_BASE_URL}${url}`,
    headers,
    data: req.body,
    responseType: "arraybuffer",
    validateStatus: false, // This allows axios to not throw an error for non-2xx status codes
  });

  // Set the content type of the response
  res.set("Content-Type", response.headers["content-type"]);

  // Set other headers from the original response
  Object.entries(response.headers).forEach(([key, value]) => {
    res.set(key, value);
  });

  // Send the status and body
  res.status(response.status).send(response.data);
});

// Vercel serverless function handler
module.exports = app;

// For local development
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
