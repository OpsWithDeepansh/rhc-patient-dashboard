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

function createPieChart(id, dataValues) {
    
    new Chart(document.getElementById(id), {

        type: 'pie',

        data: {
            labels: pieLabels,
            datasets: [{
                data: dataValues,
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
                                ? (value / total * 100).toFixed(1)
                                : 0;

                        return percentage + "%";
                    }
                }
            }
        }
    });
}

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

                            return total
                                ? ((value / total) * 100).toFixed(1) + '%'
                                : '0%';
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

        labels: [
            'Ansha',
            'Bhuvan',
            'Mouli',
            'Murugesh',
            'Sarita',
            'Rashmi'
        ],

        datasets: [{
            label: 'Connectivity %',
            data: [51.15, 22.13, 50.90, 46.10, 50.58, 59.34],
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
                data: [27, 0, 36, 31, 22, 32],
                backgroundColor: '#4CAF50'
            },

            {
                label: 'Not Connected',
                data: [16, 0, 15, 13, 11, 12],
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
                data: [0, 0, 1, 13, 0, 12],
                backgroundColor: '#03A9F4'
            },

            {
                label: 'Pending',
                data: [1, 0, 0, 0, 0, 4],
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
                <h3>${agent}</h3>

                <div class="chart-box">
                    <canvas id="${agent}Chart"></canvas>
                </div>
            </div>

        `;

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
    Object.keys(data.trend);

trendChart.data.datasets[0].data =
    Object.values(data.trend);

trendChart.update();

dailyChart.data.labels =
    Object.keys(data.agents);

dailyChart.data.datasets[0].data =
    data.dailyPerformance.connected;

dailyChart.data.datasets[1].data =
    data.dailyPerformance.notConnected;

dailyChart.update();

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
loadMonth('Jun26');

// MONTH DROPDOWN

document
    .getElementById('monthSelector')
    .addEventListener('change', function () {

        loadMonth(this.value);

    });
