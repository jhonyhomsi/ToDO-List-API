const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = process.env.PORT || 2000;

// Connect to MongoDB (replace with your database URL)
mongoose
  .connect(
    "mongodb+srv://jhony-33:Serafim12@cluster0.v4dsgzx.mongodb.net/TaskApp",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB connected"));

const Task = mongoose.model("Task", {
  title: String,
  completed: Boolean,
});

app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Create a new task
app.post("/tasks", async (req, res) => {
  try {
    const { title, completed } = req.body;
    const task = new Task({ title, completed });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// DELETE a task by ID
app.delete("/tasks/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findByIdAndRemove(taskId);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
