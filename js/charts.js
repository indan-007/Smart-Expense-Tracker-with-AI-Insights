let categoryChart = null;
let trendsChart = null;

export function renderCharts(expenses) {
    renderCategoryChart(expenses);
    renderTrendsChart(expenses);
}

function renderCategoryChart(expenses) {
    const ctx = document.getElementById('category-chart').getContext('2d');

    const categories = {};
    expenses.forEach(expense => {
        if (categories[expense.category]) {
            categories[expense.category] += expense.amount;
        } else {
            categories[expense.category] = expense.amount;
        }
    });

    const labels = Object.keys(categories);
    const data = Object.values(categories);

    // Dynamic colors
    const backgroundColor = labels.map(() => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.7)`);

    if (categoryChart) {
        categoryChart.destroy();
    }

    categoryChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                label: 'Expenses by Category',
                data: data,
                backgroundColor: backgroundColor,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function renderTrendsChart(expenses) {
    const ctx = document.getElementById('trends-chart').getContext('2d');

    const trends = {};
    expenses.forEach(expense => {
        const month = new Date(expense.date).toISOString().slice(0, 7); // YYYY-MM
        if (trends[month]) {
            trends[month] += expense.amount;
        } else {
            trends[month] = expense.amount;
        }
    });

    const sortedMonths = Object.keys(trends).sort();
    const labels = sortedMonths;
    const data = sortedMonths.map(month => trends[month]);

    if (trendsChart) {
        trendsChart.destroy();
    }

    trendsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Monthly Expense Trends',
                data: data,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
