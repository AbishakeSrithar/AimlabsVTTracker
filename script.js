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

      const dailyScores = {};
      filtered.forEach(d => {
        const date = d.create_date.split('T')[0];
        if (!dailyScores[date]) dailyScores[date] = [];
        dailyScores[date].push(d.score);
      });

      const startDate = start ? new Date(start) : new Date(Math.min(...filtered.map(d => new Date(d.create_date))));
      const endDate = end ? new Date(end) : new Date(Math.max(...filtered.map(d => new Date(d.create_date))));

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
          const top = vals.sort((a, b) => b - a).slice(0, 3);
          scores.push((top.reduce((sum, v) => sum + v, 0) / top.length).toFixed(2));
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
              text: 'Score Over Time',
              color: 'white',
              font: { size: 18 }
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