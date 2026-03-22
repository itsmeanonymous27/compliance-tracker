import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/clients")
      .then(res => setClients(res.data));
  }, []);

  const fetchTasks = (id) => {
    setSelectedClient(id);
    axios.get(`http://localhost:5000/clients/${id}/tasks`)
      .then(res => setTasks(res.data));
  };

  const toggleStatus = (task) => {
    axios.patch(`http://localhost:5000/tasks/${task.id}`, {
      status: task.status === "Pending" ? "Completed" : "Pending"
    }).then(() => fetchTasks(selectedClient));
  };

  const addTask = () => {
    if (!title) return;

    axios.post("http://localhost:5000/tasks", {
      client_id: selectedClient,
      title,
      category: "General",
      due_date: "2026-03-25",
      status: "Pending",
      priority: "Low"
    }).then(() => {
      setTitle("");
      fetchTasks(selectedClient);
    });
  };

  const isOverdue = (task) => {
    return task.status === "Pending" && new Date(task.due_date) < new Date();
  };

  return (
    <div style={{ display: "flex", padding: "20px" }}>
      
      {/* CLIENT LIST */}
      <div style={{ width: "200px" }}>
        <h3>Clients</h3>
        {clients.map(c => (
          <div
            key={c.id}
            onClick={() => fetchTasks(c.id)}
            style={{ cursor: "pointer", marginBottom: "10px" }}
          >
            {c.company_name}
          </div>
        ))}
      </div>

      {/* TASK SECTION */}
      <div style={{ marginLeft: "20px", flex: 1 }}>
        <h3>Tasks</h3>

        {/* ADD TASK */}
        {selectedClient && (
          <div style={{ marginBottom: "15px" }}>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="New Task"
            />
            <button onClick={addTask} style={{ marginLeft: "10px" }}>
              Add Task
            </button>
          </div>
        )}

        {/* TASK LIST */}
        {tasks.map(t => (
          <div
            key={t.id}
            style={{
              border: "1px solid",
              margin: "10px",
              padding: "10px",
              background: isOverdue(t) ? "#ffcccc" : "white"
            }}
          >
            <p><b>{t.title}</b></p>
            <p>Status: {t.status}</p>
            <button onClick={() => toggleStatus(t)}>
              Toggle Status
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;