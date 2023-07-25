import express from "express";

import cors from "cors";

const PORT = process.env.PORT || 8000;
const app = express();

app.use(
  cors({
    credentials: true,
  })
);

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}⚡`);
});
