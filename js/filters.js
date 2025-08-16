export function applyFilters(expenses, filters) {
    let filteredExpenses = [...expenses];

    // Date Range
    if (filters.dateStart) {
        filteredExpenses = filteredExpenses.filter(e => e.date >= filters.dateStart);
    }
    if (filters.dateEnd) {
        filteredExpenses = filteredExpenses.filter(e => e.date <= filters.dateEnd);
    }

    // Category
    if (filters.category) {
        const lowerCaseFilter = filters.category.toLowerCase();
        filteredExpenses = filteredExpenses.filter(e => e.category.toLowerCase().includes(lowerCaseFilter));
    }

    // Merchant
    if (filters.merchant) {
        const lowerCaseFilter = filters.merchant.toLowerCase();
        filteredExpenses = filteredExpenses.filter(e => e.merchant.toLowerCase().includes(lowerCaseFilter));
    }

    // Amount Range
    if (filters.amountMin !== null && filters.amountMin !== undefined) {
        filteredExpenses = filteredExpenses.filter(e => e.amount >= filters.amountMin);
    }
    if (filters.amountMax !== null && filters.amountMax !== undefined) {
        filteredExpenses = filteredExpenses.filter(e => e.amount <= filters.amountMax);
    }

    return filteredExpenses;
}
