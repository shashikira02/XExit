require("dotenv").config();
const connectDB = require("./config/db");
const app = require("./app");

const User = require("./models/User");
const bcrypt = require("bcryptjs");

const server = app;
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    const ifAdminExists = await User.findOne({ username: "admin" });
    if (!ifAdminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("admin", salt);

      await User.create({
        username: "admin",
        password: hashedPassword,
        role: "admin",
      });
      console.log("Admin created with username: 'admin' and password: 'admin'");
    } else {
      console.log("Admin user already exists");
    }
    server.listen(PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

startServer();
