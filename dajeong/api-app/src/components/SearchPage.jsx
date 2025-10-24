import { useState } from "react";
import { useShopping } from "../context/ShoppingProvider";

function SearchForm() {
  const [startDate, setStartDate] = useState("2025-01-01");
  const [endDate, setEndDate] = useState("2025-09-30");
  const [timeUnit, setTimeUnit] = useState("month");
  const [keyword, setKeyword] = useState("아이폰");

  const { fetchShoppingData } = useShopping();

  const handleSubmit = (e) => {
    e.preventDefault();

    const ages = ["10", "20", "30", "40", "50", "60"];
    const category = "50000000";

    const requestBody = {
      startDate,
      endDate,
      timeUnit,
      keyword,
      category,
      ages,
    };

    fetchShoppingData(requestBody);
  };

  return (
    <form onSubmit={handleSubmit} className="card search-form">
      <h2>조회 조건 설정</h2>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="startDate">시작일</label>
          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="endDate">종료일</label>
          <input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="timeUnit">분석 단위</label>
          <select
            id="timeUnit"
            value={timeUnit}
            onChange={(e) => setTimeUnit(e.target.value)}
          >
            <option value="date">일간</option>
            <option value="week">주간</option>
            <option value="month">월간</option>
          </select>
        </div>

        <div className="form-group keywords-group">
          <label htmlFor="keywords">키워드</label>
          <input
            id="keyword"
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="예: 아이폰"
          />
        </div>
        <div className="form-group button-group">
          <button type="submit" className="submit-button">
            분석하기
          </button>
        </div>
      </div>
    </form>
  );
}

export default SearchForm;
