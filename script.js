function capitalizeName(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
}
// // ===== REGISTER PLUGIN =====
Chart.register(ChartDataLabels);

// ===== COMMON SETTINGS =====

const pieLabels = [
    'Connected',
    'Not Connected',
    'Inactive',
    'Denied',
    'Pending'
];

const pieColors = [
    '#4CAF50',
    '#9C27B0',
    '#2196F3',
    '#FF9800',
    '#9E9E9E'
];

// ===== PIE CHART FUNCTION =====

function loadAgentChart(chartId, agentData) {

    const chartData = [
        agentData.connected,
        agentData.notConnected,
        agentData.inactive,
        agentData.denied,
        agentData.pending
    ];

    if (agentCharts[chartId]) {
        agentCharts[chartId].destroy();
    }

    agentCharts[chartId] = new Chart(
        document.getElementById(chartId),
        {
            type: 'pie',
            data: {
                labels: pieLabels,
                datasets: [{
                    data: chartData,
                    backgroundColor: pieColors
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,

                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    datalabels: {
                        color: '#fff',
                        font: {
                            weight: 'bold',
                            size: 12
                        },
                        formatter: (value, context) => {

                            const data =
                                context.chart.data.datasets[0].data;

                            const total =
                                data.reduce((a, b) => a + b, 0);

                            const percentage =
    total
        ? (value / total) * 100
        : 0;

return percentage >= 5
    ? percentage.toFixed(1) + '%'
    : '';
                        }
                    }
                }
            }
        }
    );
}
// ===== PIE CHARTS =====

let agentCharts = {};

// ===== CONNECTIVITY TREND =====

let trendChart = new Chart(     
    document.getElementById('trendChart'),     
    {

    type: 'line',

    data: {

        labels: [],

        datasets: [{
            label: 'Connectivity %',
            data: [],
            borderColor: '#E91E63',
            backgroundColor: '#E91E63',
            tension: 0.3,
            fill: false,
            pointRadius: 5
        }]
    },

    options: {

        responsive: true,
        maintainAspectRatio: false,

        plugins: {

            legend: {
                position: 'top'
            },

            datalabels: {

                align: 'top',

                color: '#000',

                font: {
                    weight: 'bold'
                },

                formatter: (value) => value + '%'
            }
        },

        scales: {

            y: {
                beginAtZero: true
            }
        }
    }
    });

// ===== DAILY PERFORMANCE =====

let dailyChart = new Chart(
    document.getElementById('dailyChart'), 
    {

    type: 'bar',

    data: {

        labels: [],

        datasets: [

            {
                label: 'Connected',
                data: [],
                backgroundColor: '#4CAF50'
            },

            {
                label: 'Not Connected',
                data: [],
                backgroundColor: '#F44336'
            }
        ]
    },

    options: {

        responsive: true,
        maintainAspectRatio: false,

        plugins: {

            legend: {
                position: 'top'
            },

            datalabels: {

                anchor: 'end',
                align: 'top',

                color: '#000',

                font: {
                    weight: 'bold'
                }
            }
        }
    }
});

// ===== ITP =====

let itpChart = new Chart(
    document.getElementById('itpChart'),
    {

    type: 'bar',

    data: {

        labels: [],

        datasets: [

            {
                label: 'Connected',
                data: [],
                backgroundColor: '#03A9F4'
            },

            {
                label: 'Pending',
                data: [],
                backgroundColor: '#FF9800'
            }
        ]
    },

    options: {

        responsive: true,
        maintainAspectRatio: false,

        plugins: {

            legend: {
                position: 'top'
            },

            datalabels: {

                anchor: 'end',
                align: 'top',

                color: '#000',

                font: {
                    weight: 'bold'
                }
            }
        }
    }
});
// LOAD DASHBOARD DATA

function createAgentCards(agents) {

    const agentGrid =
        document.getElementById('agentGrid');

    agentGrid.innerHTML = '';

    Object.keys(agents).forEach(agent => {

        agentGrid.innerHTML += `

            <div class="card">

    <h3>${capitalizeName(agent)}</h3>

    <div class="agent-metrics">

        <div>
            <strong>${agents[agent].connectivity}%</strong>
            <span>Connectivity</span>
        </div>

        <div>
            <strong>${agents[agent].callableLeads}</strong>
            <span>Callable Leads</span>
        </div>

    </div>

    <div class="chart-box">
        <canvas id="${agent}Chart"></canvas>
    </div>

</div>

        `;

    });

}
function loadMonths() {

    fetch('data/months.json')
        .then(response => response.json())
        .then(months => {

            const selector =
                document.getElementById('monthSelector');

            selector.innerHTML = '';

            months.forEach(month => {

                selector.innerHTML += `
                    <option value="${month}">
                        ${month}
                    </option>
                `;

            });

            loadMonth(months[0]);

        });

}

function loadMonth(monthFile){

    fetch(`data/${monthFile}.json`)
        .then(response => response.json())
        .then(data => {

            createAgentCards(data.agents);

            document.getElementById('totalPatients').textContent =
                data.totalPatients;

            document.getElementById('connected').textContent =
                data.connected;

            document.getElementById('notConnected').textContent =
                data.notConnected;

            document.getElementById('inactive').textContent =
                data.inactive;

            document.getElementById('denied').textContent =
                data.denied;

            document.getElementById('pending').textContent =
                data.pending;

            document.getElementById('callableLeads').textContent =
                data.callableLeads;

            document.getElementById('connectivity').textContent =
                data.connectivity + '%';

Object.keys(data.agents).forEach(agent => {

    loadAgentChart(
        `${agent}Chart`,
        data.agents[agent]
    );

});

trendChart.data.labels =
    Object.keys(data.trend).map(capitalizeName);

trendChart.data.datasets[0].data =
    Object.values(data.trend);

trendChart.update();

dailyChart.data.labels =
    Object.keys(data.agents).map(capitalizeName);

dailyChart.data.datasets[0].data =
    data.dailyPerformance.connected;

dailyChart.data.datasets[1].data =
    data.dailyPerformance.notConnected;

dailyChart.update();

itpChart.data.labels =
    Object.keys(data.agents).map(capitalizeName);

itpChart.data.datasets[0].data =
    data.itp.connected;

itpChart.data.datasets[1].data =
    data.itp.pending;

itpChart.update();

        })
        .catch(error => {
            console.error('Error loading JSON:', error);
        });

}

// Load latest month when dashboard opens
loadMonths();

// MONTH DROPDOWN

document
    .getElementById('monthSelector')
    .addEventListener('change', function () {

        loadMonth(this.value);

    });
