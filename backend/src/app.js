const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authroutes"));
app.use("/api/projects", require("./routes/projectroutes"));
app.use("/api/messages", require("./routes/messageRoutes"));

module.exports = app;
