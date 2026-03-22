const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let clients = [
  { id: 1, company_name: "ABC Pvt Ltd", country: "India", entity_type: "Private Ltd" },
  { id: 2, company_name: "XYZ Inc", country: "USA", entity_type: "Corporation" }
];

let tasks = [
  {
    id: 1,
    client_id: 1,
    title: "GST Filing",
    category: "Tax",
    due_date: "2026-03-20",
    status: "Pending",
    priority: "High"
  }
];

// APIs
app.get("/clients", (req, res) => {
  res.json(clients);
});

app.get("/clients/:id/tasks", (req, res) => {
  const clientTasks = tasks.filter(t => t.client_id == req.params.id);
  res.json(clientTasks);
});

app.post("/tasks", (req, res) => {
  const newTask = { id: Date.now(), ...req.body };
  tasks.push(newTask);
  res.json(newTask);
});

app.patch("/tasks/:id", (req, res) => {
  tasks = tasks.map(t =>
    t.id == req.params.id ? { ...t, ...req.body } : t
  );
  res.json({ success: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port", PORT));