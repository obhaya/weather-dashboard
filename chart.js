function setupCharts(temp, humidity) {
    const ctxBar = document.getElementById('barChart').getContext('2d');
    const ctxDoughnut = document.getElementById('doughnutChart').getContext('2d');
    const ctxLine = document.getElementById('lineChart').getContext('2d');

    // Bar Chart with Animation
    const barChart = new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: ['Temperature'],
            datasets: [{
                label: 'Current Temperature',
                data: [temp], // Use the fetched temperature
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            }]
        },
        options: {
            responsive: true,
            animation: {
                duration: 1000, // Animation duration
                delay: (context) => {
                    if (context.type === 'data' && context.mode === 'default' && !context.dataset.hidden) {
                        return context.dataIndex * 100; // Delay each bar's animation
                    }
                    return 0;
                },
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Doughnut Chart with Animation
    const doughnutChart = new Chart(ctxDoughnut, {
        type: 'doughnut',
        data: {
            labels: ['Humidity'],
            datasets: [{
                label: 'Current Humidity',
                data: [humidity, 100 - humidity], // Show current humidity and the remainder
                backgroundColor: [
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                ],
            }]
        },
        options: {
            responsive: true,
            animation: {
                animateScale: true, // Animate the scale of the chart
                animateRotate: true, // Animate the rotation of the chart
                duration: 1000 // Animation duration
            }
        }
    });

    // Line Chart with Drop Animation
    const lineChart = new Chart(ctxLine, {
        type: 'line',
        data: {
            labels: ['Current'], // You can update these labels based on your needs
            datasets: [{
                label: 'Temperature Over Time',
                data: [temp], // Use the fetched temperature
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false,
            }]
        },
        options: {
            responsive: true,
            animation: {
                duration: 1000, // Animation duration
                onComplete: function() {
                    const chartInstance = this.chart;
                    const ctx = chartInstance.ctx;
                    const data = chartInstance.data.datasets[0].data;
                    const chartArea = chartInstance.chartArea;
                    ctx.save();
                    ctx.fillStyle = 'rgba(75, 192, 192, 1)';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    data.forEach((value, index) => {
                        ctx.fillText(value, chartArea.left + (index * (chartArea.right - chartArea.left) / data.length) + (chartArea.right - chartArea.left) / (2 * data.length), chartArea.top);
                    });
                    ctx.restore();
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
