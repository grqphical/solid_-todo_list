import { createSignal, For } from "solid-js";
import "./App.css";

/**
 * * @typedef {Object} Task
 * @property {string} name
 * @property {boolean} complete
 */

/**
 * @template T
 * @typedef {ReturnType<typeof createSignal<T>>} Signal
 */

function App() {
  /**@type {Signal<Task[]>}*/
  const [tasks, setTasks] = createSignal([]);

  if (localStorage.getItem("tasks")) {
    setTasks(JSON.parse(localStorage.getItem("tasks")));
  }

  /**@type {Signal<string>}*/
  const [taskName, setTaskName] = createSignal("");

  const toggleComplete = (index) => {
    setTasks((prevTasks) => {
      const updatedTasks = [...prevTasks];
      updatedTasks[index].complete = !updatedTasks[index].complete;
      if (localStorage.getItem("tasks")) {
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
      }
      return updatedTasks;
    });
  };

  const deleteTask = (index) => {
    setTasks(tasks().filter((_, i) => i !== index));
    localStorage.setItem("tasks", JSON.stringify(tasks()));
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setTasks([...tasks(), { name: taskName(), complete: false }]);
    setTaskName("");

    localStorage.setItem("tasks", JSON.stringify(tasks()));
  };

  return (
    <>
      <h1>To Do List</h1>
      <form onSubmit={onSubmit}>
        <label htmlFor="name">New Task: </label>
        <input
          type="text"
          name="name"
          value={taskName()}
          onInput={(e) => setTaskName(e.target.value)}
        />
        <input type="submit" value="Submit" />
      </form>
      <ul className="tasks">
        <For each={tasks()} fallback={<p>No Tasks</p>}>
          {(item, index) => (
            <div className="task">
              <input
                type="checkbox"
                name="complete"
                checked={item.complete}
                onChange={() => toggleComplete(index())}
              />
              <p>{item.name}</p>
              <input
                type="button"
                value="Delete"
                className="delete"
                onClick={() => deleteTask(index())}
              />
            </div>
          )}
        </For>
      </ul>
    </>
  );
}

export default App;
