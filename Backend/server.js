require("dotenv").config(); // because of this we can access the variable in .env file
const app = require("./src/app");
const connectToDb = require("./src/config/database")
connectToDb();
app.listen(3000, () => {
    console.log("Server is running on port 3000");
})