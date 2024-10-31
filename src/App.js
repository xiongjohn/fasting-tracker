import Timer from "./Timer";
import "./App.css";

function App() {
  return (
    <div className="App">
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h1>Intermittent Fasting Timer</h1>
        <Timer />
      </div>
    </div>
  );
}

export default App;
