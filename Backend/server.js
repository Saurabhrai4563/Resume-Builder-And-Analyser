require("dotenv").config(); // because of this we can access the variable in .env file
const app = require("./src/app");
const connectToDb = require("./src/config/database")
const generateInterviewReport = require("./src/services/ai.service");
const { resume, selfDescription, jobDescription } = require("./src/services/temp")


console.log("Calling Gemini...");
generateInterviewReport({ resume, selfDescription, jobDescription });
connectToDb();
app.listen(3000, () => {
    console.log("Server is running on port 3000");
})