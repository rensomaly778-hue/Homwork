const list = document.getElementById("list");
const form = document.getElementById("form");
const input = document.getElementById("title");
const statusEl = document.getElementById("status");

async function load() {
  statusEl.textContent = "កំពុងផ្ទុក...";
  try {
    const res = await fetch(`${API_URL}/api/tasks`);
    const tasks = await res.json();
    list.innerHTML = "";
    tasks.forEach((t) => {
      const li = document.createElement("li");
      li.textContent = t.title;
      const btn = document.createElement("button");
      btn.textContent = "លុប";
      btn.onclick = async () => {
        await fetch(`${API_URL}/api/tasks/${t.id}`, { method: "DELETE" });
        load();
      };
      li.appendChild(btn);
      list.appendChild(li);
    });
    statusEl.textContent = "";
  } catch (e) {
    statusEl.textContent = "មិនអាចភ្ជាប់ទៅ Backend បានទេ";
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  await fetch(`${API_URL}/api/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: input.value }),
  });
  input.value = "";
  load();
});

load();
