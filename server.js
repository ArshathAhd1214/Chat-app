import express from "express";
import mongoose from "mongoose";
import UserRoutes from "./routes/UserRoutes.js";
import dotenv from "dotenv";
import path from "path";

dotenv.config(); 

const app = express();
app.use(express.json()); 
app.use("/uploads", express.static(path.join(process.cwd(), "backend", "uploads")));


// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected!"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

// Define a simple route
app.get('/', (req, res) => {
  res.send("Hello World from the backend!");
});

// Start the server
app.use("/api/user",UserRoutes);
app.listen(5000, () => {
  console.log("Server running on port 5000");
}); 