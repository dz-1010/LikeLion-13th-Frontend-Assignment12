import "./App.css";
import SearchForm from "./components/SearchPage.jsx";
import ShoppingChart from "./components/ShoppingChart.jsx";

function App() {
  return (
    <div className="App">
      <h1>네이버쇼핑 키워드 연령별 트렌드 조회</h1>
      <SearchForm />
      <ShoppingChart />
    </div>
  );
}

export default App;
