const taskMapping = {
      "CsLevel.Lowgravity56.VT Float.RSM61S": "VT Floatshot VALORANT",
      "CsLevel.Lowgravity56.VT Angle.ROAHK9": "VT Angleshot VALORANT",
      "CsLevel.Lowgravity56.VT Adjus.RTUQMP": "VT Adjustshot VALORANT",
      "CsLevel.Lowgravity56.VT DotTS.ROCEC8": "VT DotTS VALORANT",
      "CsLevel.Lowgravity56.VT Mini .RO6WXU": "VT Miniphase VALORANT",
      "CsLevel.Lowgravity56.VT Fours.RO4LXQ": "VT Fourshot Adaptive VALORANT",
      "CsLevel.Lowgravity56.VT 1w1t .ROCDJW": "VT 1w1t VALORANT",
      "CsLevel.Lowgravity56.VT Wider.ROEHBY": "VT Widereflex VALORANT",
      "CsLevel.Lowgravity56.VT Micro.ROI47X": "VT Microshot VALORANT",
      "CsLevel.Lowgravity56.VT Angle.ROG6UF": "VT Angleshot Micro VALORANT",
      "CsLevel.Lowgravity56.VT Skycl.RONRPF": "VT Skyclick Multi VALORANT",
      "CsLevel.EmpireDeadman.VT Angel.RSOD4F": "VT Angelic Click VALORANT",
      "CsLevel.Lowgravity56.VT MiniT.RSM6Z5": "VT MiniTS VALORANT",
      "CsLevel.Lowgravity56.VT Micro.RSM7Y0": "VT Micro 2 Sphere VALORANT",
      "CsLevel.Lowgravity56.VT Peeks.ROCNDN": "VT Peekshot VALORANT",
      "CsLevel.Lowgravity56.VT Micro.RTUMO2": "VT Micropace VALORANT",
      "CsLevel.Lowgravity56.VT Micro.ROLMYC": "VT Microcluster VALORANT",
      "CsLevel.Lowgravity56.VT Contr.RU7INB": "VT Controlstrafes VALORANT",
      "CsLevel.Lowgravity56.VT Peekt.ROLVU0": "VT Peektrack VALORANT",
      "CsLevel.EmpireDeadman.VT Angle.RSOCTO": "VT Angle Track VALORANT",
      "CsLevel.Lowgravity56.VT Adjus.ROJETY": "VT Adjust Track VALORANT"
    };

const benchmarkRanges = {
  "VT Floatshot VALORANT": [300, 400, 500, 600, 700, 800, 900, 1000],
  "VT Angleshot VALORANT": [0, 100, 250, 400, 550, 700, 850, 1000],
  "VT Adjustshot VALORANT": [350, 450, 550, 650, 750, 850, 950, 1050],

  "VT DotTS VALORANT": [1350, 1550, 1750, 1950, 2150, 2350, 2550, 2750],
  "VT Miniphase VALORANT": [550, 650, 750, 850, 950, 1050, 1150, 1250],
  "VT Fourshot Adaptive VALORANT": [525, 625, 725, 825, 925, 1025, 1125, 1225],

  "VT 1w1t VALORANT": [4600, 5000, 5400, 5800, 6200, 6600, 7000, 7400],
  "VT Widereflex VALORANT": [3350, 3900, 4450, 5000, 5550, 6100, 6650, 7200],

  "VT Microshot VALORANT": [0, 100, 200, 300, 400, 600, 800, 1000],
  "VT Angleshot Micro VALORANT": [300, 450, 600, 750, 900, 1050, 1200, 1350],
  "VT Skyclick Multi VALORANT": [550, 650, 750, 850, 950, 1050, 1150, 1250],

  "VT Angelic Click VALORANT": [0, 15, 35, 55, 75, 95, 115, 135],
  "VT MiniTS VALORANT": [55, 65, 75, 85, 95, 105, 115, 125],
  "VT Micro 2 Sphere VALORANT": [550, 650, 800, 950, 1100, 1250, 1400, 1550],

  "VT Peekshot VALORANT": [2075, 2575, 3075, 3325, 3575, 4075, 4575, 5075],
  "VT Micropace VALORANT": [925, 975, 1025, 1075, 1125, 1175, 1225, 1275],
  "VT Microcluster VALORANT": [500, 600, 700, 750, 800, 900, 1000, 1100],

  "VT Controlstrafes VALORANT": [2750, 2950, 3150, 3350, 3550, 4150, 4750, 5350],
  "VT Peektrack VALORANT": [1975, 2175, 2325, 2400, 2475, 2625, 2775, 2925],

  "VT Angle Track VALORANT": [2775, 2975, 3175, 3275, 3375, 3575, 3775, 3975],
  "VT Adjust Track VALORANT": [1600, 1800, 2000, 2200, 2400, 2600, 2800, 3000]
};

Chart.register(window['chartjs-plugin-annotation']);

function getBenchmarkAnnotations(taskName) {
  const label = taskMapping[taskName];
  const ranges = benchmarkRanges[label];
  if (!ranges) return [];
  const colors = [
    '#a0a0a033', '#c0c0ff33', '#d4af3733', '#ffd70033',
    '#00b8d933', '#9b5fe033', '#17c96433', '#ff465533'
  ];
  return ranges.map((val, idx) => ({
    type: 'box',
    yMin: val,
    yMax: ranges[idx + 1] || val * 1.1,
    backgroundColor: colors[idx],
    borderWidth: 0
  })).slice(0, 8);
}

function renderTaskProgressBars(containerId, data) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.style.margin = '2rem auto';
  wrapper.style.display = 'flex';
  wrapper.style.flexDirection = 'column';
  wrapper.style.gap = '0.5rem';
  wrapper.style.width = '100%';
  wrapper.style.maxWidth = '800px';

  Object.values(taskMapping).forEach(task => {
    const benchmarks = benchmarkRanges[task];
    if (!benchmarks) return;

    const scores = data.filter(d => taskMapping[d.taskName] === task).map(d => d.score);
    const maxScore = scores.length ? Math.max(...scores) : 0;
    const maxBenchmark = benchmarks[benchmarks.length - 1];
    const progress = Math.max(0, ((maxScore) / (maxBenchmark)) * 100);
    const level = benchmarks.findIndex((val, idx) => maxScore < (benchmarks[idx + 1] || Infinity));
    const levelColors = ['#a0a0a0', '#c0c0ff', '#d4af37', '#ffd700', '#00b8d9', '#9b5fe0', '#17c964', '#ff4655'];

    const line = document.createElement('div');
    line.style.display = 'flex';
    line.style.alignItems = 'center';
    line.style.gap = '1rem';

    const label = document.createElement('div');
    label.textContent = task;
    label.style.width = '220px';
    label.style.fontSize = '0.9rem';
    label.style.flexShrink = '0';

    const barContainer = document.createElement('div');
    barContainer.style.flexGrow = '1';
    barContainer.style.height = '16px';
    barContainer.style.background = '#333';
    barContainer.style.borderRadius = '4px';
    barContainer.style.overflow = 'hidden';

    const fill = document.createElement('div');
    fill.style.height = '100%';
    fill.style.width = `${progress}%`;
    fill.style.backgroundColor = levelColors[Math.max(0, level)];
    fill.style.transition = 'width 0.3s';

    barContainer.appendChild(fill);
    line.appendChild(label);
    line.appendChild(barContainer);

    wrapper.appendChild(line);
  });

  container.appendChild(wrapper);
}

    let rawData = [];
    let chart;

    function loadDataAndInit(data) {
      rawData = data;
      console.log(`📊 Loaded ${rawData.length} entries from JSON`);
      populateDropdown();
      drawChart();
    }

    function populateDropdown() {
      const taskSelect = document.getElementById('taskSelect');
      taskSelect.innerHTML = '';

      Object.entries(taskMapping).forEach(([raw, name]) => {
        const option = document.createElement('option');
        option.value = raw;
        option.textContent = name;
        taskSelect.appendChild(option);
      });
    }

    function drawChart() {
      const selectedTask = document.getElementById('taskSelect').value;
      const start = document.getElementById('startDate').value;
      const end = document.getElementById('endDate').value;

      let filtered = rawData.filter(d => d.taskName === selectedTask);
      if (start) filtered = filtered.filter(d => d.create_date >= start);
      if (end) filtered = filtered.filter(d => d.create_date <= end);

      const filteredAllTasks = rawData.filter(d => {
      return (!start || d.create_date >= start) && (!end || d.create_date <= end);
    });

    renderTaskProgressBars('progressContainer', filteredAllTasks);

      const dailyScores = {};
      filtered.forEach(d => {
      const date = d.create_date.split('T')[0];
      if (!dailyScores[date]) dailyScores[date] = [];
      dailyScores[date].push(Number(d.score));
    });

      const startDate = start
        ? new Date(start)
        : new Date(Math.min(...filtered.map(d => new Date(d.create_date).getTime())));

      const endDate = end
        ? new Date(end)
        : new Date(Math.max(...filtered.map(d => new Date(d.create_date).getTime())));

      endDate.setHours(23, 59, 59, 999);

      const labels = [];
      const scores = [];
      let currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        const dateStr = currentDate.toISOString().split('T')[0];
        labels.push(`${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`);

        const vals = dailyScores[dateStr];
        if (!vals || vals.length === 0) {
          scores.push(null);
        } else {
          scores.push(Math.max(...vals));
        }


        currentDate.setDate(currentDate.getDate() + 1);
      }

      const ctx = document.getElementById('scoreChart').getContext('2d');
      if (chart) chart.destroy();

      chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: taskMapping[selectedTask],
            data: scores,
            borderColor: 'cyan',
            backgroundColor: 'rgba(0,255,255,0.1)',
            tension: 0.2,
            pointRadius: 3,
            pointHoverRadius: 5,
            spanGaps: true
          }]
        },
        options: {
          animation: {
            duration: 800,
            easing: 'easeOutQuart'
          },
          responsive: true,
          plugins: {
            legend: { labels: { color: 'white' } },
            title: {
              display: true,
              text: 'VT Valorant Benchmarks',
              color: 'white',
              font: { size: 18 }
            },
            annotation: {
              annotations: getBenchmarkAnnotations(selectedTask)
            }
          },
          scales: {
            x: { ticks: { color: 'white' } },
            y: { ticks: { color: 'white' } }
          }
        }
      });
    }

    document.getElementById('updateBtn').addEventListener('click', drawChart);
    document.getElementById('taskSelect').addEventListener('change', drawChart);
    document.getElementById('startDate').addEventListener('change', drawChart);
    document.getElementById('endDate').addEventListener('change', drawChart);

    document.getElementById('startDate').addEventListener('change', drawChart);
    document.getElementById('endDate').addEventListener('change', drawChart);

    document.getElementById('fileInput').addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target.result);
          console.log("📂 Loaded uploaded file", parsed.length);
          loadDataAndInit(parsed);
        } catch (err) {
          console.error("❌ Failed to parse uploaded JSON:", err);
        }
      };
      reader.readAsText(file);
    });

window.addEventListener('DOMContentLoaded', () => {
  // Load default data as fallback
  fetch('taskData.json')
    .then(res => res.json())
    .then(defaultData => {
      console.log("📦 Loaded default task data");
      loadDataAndInit(defaultData);
      renderTaskProgressBars('progressContainer', defaultData);
    })
    .catch(err => console.error("❌ Failed to load default taskData.json:", err));
});