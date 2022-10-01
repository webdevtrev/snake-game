import "./App.scss";
import Gameboard from "./Components/Gameboard";
import Header from "./Components/Header";

function App() {
  return (
    <div className="App">
      <Header />
      <Gameboard size={10} />
    </div>
  );
}

export default App;
