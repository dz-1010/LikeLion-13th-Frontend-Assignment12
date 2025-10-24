import { useMemo } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useShopping } from "../context/ShoppingProvider";

ChartJS.register(ArcElement, Tooltip, Legend);

const AGE_LABELS = {
  10: "10대",
  20: "20대",
  30: "30대",
  40: "40대",
  50: "50대",
  60: "60대 이상",
};
const AGE_ORDER = ["10", "20", "30", "40", "50", "60"];

const BG_COLORS = [
  "rgba(255, 99, 132, 0.2)",
  "rgba(54, 162, 235, 0.2)",
  "rgba(255, 206, 86, 0.2)",
  "rgba(75, 192, 192, 0.2)",
  "rgba(153, 102, 255, 0.2)",
  "rgba(255, 159, 64, 0.2)",
];
const BORDER_COLORS = [
  "rgba(255, 99, 132, 1)",
  "rgba(54, 162, 235, 1)",
  "rgba(255, 206, 86, 1)",
  "rgba(75, 192, 192, 1)",
  "rgba(153, 102, 255, 1)",
  "rgba(255, 159, 64, 1)",
];

export default function ShoppingChart() {
  const { chartData, loading, error } = useShopping();

  const { labels, values } = useMemo(() => {
    const rows = Array.isArray(chartData?.[0]?.data) ? chartData[0].data : [];
    if (rows.length === 0) return { labels: [], values: [] };

    // 1) 연령대별 합계 구하기
    const sumByAge = {};
    for (const r of rows) {
      const age = String(r.group ?? "");
      const ratio = Number(r.ratio);
      if (!age || Number.isNaN(ratio)) continue;
      sumByAge[age] = (sumByAge[age] ?? 0) + ratio;
    }

    // 2) 존재하는 연령대만 고정 순서대로 정렬
    const present = AGE_ORDER.filter((a) => sumByAge[a] != null);

    // 3) 전체 합으로 나눠 정규화(합계 = 100%)
    const total = present.reduce((acc, a) => acc + sumByAge[a], 0) || 1;
    const percentages = present.map((a) => (sumByAge[a] / total) * 100);

    return {
      labels: present.map((a) => AGE_LABELS[a] ?? a),
      values: percentages,
    };
  }, [chartData]);

  // 기본 예제 스타일의 data 객체
  const data = useMemo(() => {
    if (labels.length === 0) return null;

    const need = labels.length;
    const bg = BG_COLORS.slice(0, need);
    const bd = BORDER_COLORS.slice(0, need);
    while (bg.length < need) {
      const i = bg.length;
      const hue = Math.round((i * 57) % 360);
      bg.push(`hsla(${hue}, 70%, 60%, 0.25)`);
      bd.push(`hsl(${hue}, 70%, 40%)`);
    }

    return {
      labels,
      datasets: [
        {
          label: "연령대별 비중(%)",
          data: values.map((v) => (Number.isFinite(v) ? v : 0)),
          backgroundColor: bg,
          borderColor: bd,
          borderWidth: 1,
        },
      ],
    };
  }, [labels, values]);

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      cutout: "60%",
      plugins: {
        legend: { position: "right" },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const label = ctx.label ?? "";
              const val = Number(ctx.parsed) || 0;
              return `${label}: ${val.toFixed(1)}%`;
            },
          },
        },
      },
    }),
    []
  );

  return (
    <div className="card" style={{ padding: "1rem" }}>
      <h2 style={{ marginBottom: "1rem" }}>검색어별 연령대 분포</h2>

      {loading && <p>데이터를 불러오는 중입니다…</p>}
      {error && (
        <div style={{ color: "crimson" }}>
          <p>⚠️ 오류 발생:</p>
          <pre>{error}</pre>
        </div>
      )}
      {!loading && !error && !chartData && (
        <p>검색어를 입력하고 “분석하기”를 눌러주세요.</p>
      )}
      {!loading && !error && data && (
        <div style={{ width: "100%", height: 380 }}>
          <Doughnut data={data} options={options} />
        </div>
      )}
      {!loading && !error && chartData && !data && (
        <p>표시할 데이터가 없습니다. 기간/연령대 선택을 확인해주세요.</p>
      )}
    </div>
  );
}
