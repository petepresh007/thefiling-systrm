require("express-async-errors");
require("dotenv").config()
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const { join } = require("path");
const cors = require("cors");
const errorHandler = require("./middleware/errorhandler");
const notFoundPage = require("./middleware/pageNotFound");
const adminRouter = require("./routes/admin")
const connectDB = require("./db/db")
const fileRouter = require("./routes/file")
const homeRouter = require("./routes/hompage")

app.use(cors());
app.use(express.json());
app.use("/", express.static(join(__dirname, "public")));
app.use("/login", express.static(join(__dirname, "public", "login.html")));
app.use("/upload", express.static(join(__dirname, "public", "uploadFile.html")));
app.use("/admin", express.static(join(__dirname, "public", "admin.html")));
app.use("/update", express.static(join(__dirname, "public", "update.html")));
app.use("/submitted", express.static(join(__dirname, "public", "submitted.html")));
app.use("/gallery", express.static(join(__dirname, "public", "gallery.html")));

app.use("/api/admin", adminRouter);
app.use("/api/file", fileRouter);
app.use("/api/home", homeRouter);


app.use(notFoundPage);
app.use(errorHandler)

async function startApplication() {
    try {
        const db = await connectDB();
        if (db) {
            console.log(`connected to database successfully...`)
        }
        app.listen(port, () => console.log(`server listening on port: ${port}`));
    } catch (error) {
        console.log(error)
    }
}

startApplication()