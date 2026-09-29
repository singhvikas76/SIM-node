const express = require("express");
const app = express();

require("./config/database");

app.use(express.json());

const testRoutes = require("./routes/testRoutes");
const userRoutes = require("./routes/userRoutes");

app.use("/api/users", userRoutes);
app.use("/", testRoutes);

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});