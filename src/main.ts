import { GDPSimulator, EconomicIndicators } from './simulator';
// バグを回避するため、一括登録済みの auto からインポート
import Chart from 'chart.js/auto'; 

const initialEconomy: EconomicIndicators = {
  consumption: 300,
  investment: 100,
  governmentSpending: 100,
  exports: 80,
  imports: 70
};

const simulator = new GDPSimulator(initialEconomy);

const yearEl = document.getElementById('ui-year') as HTMLElement;
const gdpEl = document.getElementById('ui-gdp') as HTMLElement;
const logEl = document.getElementById('ui-log') as HTMLElement;

const btnNormal = document.getElementById('btn-normal') as HTMLButtonElement;
const btnStimulus = document.getElementById('btn-stimulus') as HTMLButtonElement;
const btnRate = document.getElementById('btn-rate') as HTMLButtonElement;
const btnCrisis = document.getElementById('btn-crisis') as HTMLButtonElement;

const ctx = (document.getElementById('gdpChart') as HTMLCanvasElement).getContext('2d')!;
const gdpChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: simulator.getHistory().map(h => `${h.year}年`),
    datasets: [{
      label: '実質GDP (兆円)',
      data: simulator.getHistory().map(h => h.gdp),
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderWidth: 3,
      tension: 0.2,
      fill: true
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: { y: { beginAtZero: false } }
  }
});

function updateUI() {
  const status = simulator.getCurrentStatus();
  const history = simulator.getHistory();
  const latestLog = history[history.length - 1];

  yearEl.innerText = status.year.toString();
  gdpEl.innerText = status.gdp.toFixed(1);

  const rateText = latestLog.growthRate === 0 ? '' : ` (${latestLog.growthRate > 0 ? '+' : ''}${latestLog.growthRate.toFixed(2)}%)`;
  logEl.innerHTML += `▶ <b>${latestLog.year}年 [${latestLog.event}]</b> GDP: ${latestLog.gdp}兆円 ${rateText}<br>&nbsp;&nbsp;&nbsp;&nbsp;${latestLog.detail}<br>`;
  logEl.scrollTop = logEl.scrollHeight;

  gdpChart.data.labels = history.map(h => `${h.year}年`);
  gdpChart.data.datasets[0].data = history.map(h => h.gdp);
  gdpChart.update();
}

btnNormal.addEventListener('click', () => {
  simulator.nextYearNormal();
  updateUI();
});

btnStimulus.addEventListener('click', () => {
  simulator.applyFiscalStimulus();
  updateUI();
});

btnRate.addEventListener('click', () => {
  simulator.raiseInterestRate();
  updateUI();
});

btnCrisis.addEventListener('click', () => {
  simulator.triggerCrisis();
  updateUI();
});

updateUI();