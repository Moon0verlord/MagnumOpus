import { Chart } from 'chart.js';

var data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [{
        label: "Dataset #1",
        backgroundColor: "rgba(255,99,132,0.2)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 2,
        hoverBackgroundColor: "rgba(255,99,132,0.4)",
        hoverBorderColor: "rgba(255,99,132,1)",
        data: [65, 59, 20, 81, 56, 55, 40],
    }]
};

var options = {
    maintainAspectRatio: false,
    scales: {
        y: {
            beginAtZero: true,
            grid: {
                display: true,
                color: "rgba(255,99,132,0.2)"
            }
        },
        x: {
            grid: {
                display: false
            }
        }
    }
};

new Chart('chart', {
    type: 'bar',
    options: options,
    data: data
});