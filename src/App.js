import Timer from "./components/Timer";
import Goals from "./components/Goals";
import "./App.css";

function App() {
  return (
    <div className="App">
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h1>Intermittent Fasting Timer</h1>
        <Timer />
        <Goals />
      </div>
    </div>
  );
}

export default App;
