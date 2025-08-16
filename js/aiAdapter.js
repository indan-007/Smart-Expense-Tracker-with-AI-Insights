// Mock AI Adapter using rule-based heuristics

export function getInsights(expenses, budgets) {
    if (expenses.length === 0) {
        return { title: "Not enough data", message: "Start adding expenses to get your first AI summary." };
    }

    // --- Data Processing ---
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const recentExpenses = expenses.filter(e => new Date(e.date) > oneMonthAgo);

    if (recentExpenses.length < 3) {
        return { title: "Still learning...", message: "Keep adding expenses. More data from the last 30 days will provide better insights." };
    }

    const totalSpending = recentExpenses.reduce((sum, e) => sum + e.amount, 0);

    const categorySpending = recentExpenses.reduce((acc, e) => {
        acc[e.category] = (acc[e.category] || 0) + e.amount;
        return acc;
    }, {});

    const topCategory = Object.keys(categorySpending).reduce((a, b) => categorySpending[a] > categorySpending[b] ? a : b);

    // --- Generate Insights ---
    let summary = `In the last 30 days, you've spent a total of <strong>$${totalSpending.toFixed(2)}</strong>. `;
    summary += `Your top spending category was <strong>${topCategory}</strong>, with a total of $${categorySpending[topCategory].toFixed(2)}.`;

    let suggestions = [];

    // Suggestion 1: Check budgets
    for (const category in budgets) {
        if (categorySpending[category] && categorySpending[category] > budgets[category]) {
            suggestions.push(`You're over budget in <strong>${category}</strong>. Consider reducing spending here.`);
        }
    }

    // Suggestion 2: High spending category
    if (categorySpending[topCategory] > totalSpending * 0.4) { // If top category is > 40% of total
        suggestions.push(`A large portion of your spending is on <strong>${topCategory}</strong>. Look for ways to find cheaper alternatives or cut back.`);
    }

    // Suggestion 3: Frequent small purchases (e.g., coffee, snacks)
    const frequentMerchants = recentExpenses.reduce((acc, e) => {
        acc[e.merchant] = (acc[e.merchant] || 0) + 1;
        return acc;
    }, {});

    const mostFrequentMerchant = Object.keys(frequentMerchants).reduce((a, b) => frequentMerchants[a] > frequentMerchants[b] ? a : b);

    if (frequentMerchants[mostFrequentMerchant] > 5) { // If more than 5 visits to the same merchant
         suggestions.push(`You've visited <strong>${mostFrequentMerchant}</strong> ${frequentMerchants[mostFrequentMerchant]} times recently. Small, frequent purchases can add up!`);
    }

    if (suggestions.length === 0) {
        suggestions.push("You're doing great with your spending. Keep it up!");
    }

    const message = `
        <p class="mb-4">${summary}</p>
        <h4 class="font-semibold mb-2">Savings Suggestions:</h4>
        <ul class="list-disc list-inside space-y-2">
            ${suggestions.map(s => `<li>${s}</li>`).join('')}
        </ul>
    `;

    return { title: "Your Monthly AI Insights", message };
}
