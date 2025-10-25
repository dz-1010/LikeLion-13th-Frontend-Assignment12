import { useMemo } from "react";
import { useShopping } from "../context/ShoppingProvider";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AGE_LABELS = {
  10: "10대",
  20: "20대",
  30: "30대",
  40: "40대",
  50: "50대",
  60: "60대 이상",
};

const AGE_ORDER = ["10", "20", "30", "40", "50", "60"];

const CHART_COLORS = [
  "#3B82F6",
  "#10B981",
  "#F97316",
  "#EC4899",
  "#8B5CF6",
  "#06B6D4",
];

function ShoppingChart() {
  const { chartData, loading, error } = useShopping();

  if (loading || error || !Array.isArray(chartData) || chartData.length === 0) {
    return (
      <div className="card chart-container chart-placeholder">
        <p>
          {loading
            ? "데이터를 불러오는 중입니다..."
            : error
            ? `오류가 발생했습니다: ${error}`
            : '분석할 키워드를 입력하고 "분석하기"를 눌러주세요.'}
        </p>
      </div>
    );
  }

  const { labels, datasets } = useMemo(() => {
    const rows = Array.isArray(chartData?.[0]?.data) ? chartData[0].data : [];

    const periodSet = new Set(rows.map((r) => r.period));
    const periods = Array.from(periodSet).sort();

    const map = {};
    for (const r of rows) {
      const period = r.period;
      const age = String(r.group ?? "");
      const ratio = Number(r.ratio);
      if (!period || !age || Number.isNaN(ratio)) continue;
      if (!map[period]) map[period] = {};
      map[period][age] = ratio;
    }

    const lines = AGE_ORDER.map((age, idx) => {
      const color = CHART_COLORS[idx % CHART_COLORS.length];
      const series = periods.map((p) => map[p]?.[age] ?? null);
      return {
        label: AGE_LABELS[age] ?? age,
        data: series,
        borderColor: color,
        backgroundColor: `${color}33`,
        fill: false,
        tension: 0.3,
        pointRadius: 3,
        pointHoverRadius: 6,
        borderWidth: 2,
        spanGaps: true,
      };
    }).filter((ds) => ds.data.some((v) => v !== null));

    return { labels: periods, datasets: lines };
  }, [chartData]);

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: { usePointStyle: true, padding: 20 },
        },
        title: {
          display: true,
          text: `연령대별 상대적 검색량 추이`,
          font: { size: 16, weight: "600" },
          padding: { bottom: 20 },
        },
        tooltip: {
          mode: "index",
          intersect: false,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          titleFont: { size: 13, weight: "bold" },
          bodyFont: { size: 12 },
          padding: 10,
          cornerRadius: 4,
          usePointStyle: true,
          callbacks: {
            label: (ctx) => {
              const label = ctx.dataset.label ?? "";
              const val = ctx.parsed?.y;

              return `${label}: ${val == null ? "-" : val.toFixed(2)}`;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "상대적 검색량",
            font: { size: 12, weight: "500" },
          },
          grid: { color: "#e2e8f0" },
        },
        x: {
          title: {
            display: true,
            text: "기간",
            font: { size: 12, weight: "500" },
          },
          grid: { display: false },
        },
      },
    }),
    []
  );

  if (!labels || labels.length === 0 || !datasets || datasets.length === 0) {
    return (
      <div className="card chart-container chart-placeholder">
        <p>표시할 데이터가 없습니다. 기간/연령대/키워드를 확인해 주세요.</p>
      </div>
    );
  }

  return (
    <div className="card chart-container">
      <div style={{ height: "450px" }}>
        <Line options={options} data={{ labels, datasets }} />
      </div>
    </div>
  );
}

export default ShoppingChart;
