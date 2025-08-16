import { initStore, getExpenses, addExpense, updateExpense, deleteExpense, saveBudget, getBudgets } from './store.js';
import { renderUI, renderExpenseTable, getFormData, populateForm, clearForm, renderBudgets, renderInsights } from './ui.js';
import { exportToCSV, importFromCSV } from './csv.js';
import { renderCharts } from './charts.js';
import { getInsights } from './aiAdapter.js';
import { applyFilters } from './filters.js';

let allExpenses = [];
let allBudgets = {};
let currentFilters = {
    dateStart: '',
    dateEnd: '',
    category: '',
    merchant: '',
    amountMin: null,
    amountMax: null,
};
let sortState = {
    column: 'date',
    direction: 'descending' // 'ascending', 'descending', 'none'
};

async function main() {
    await initStore();
    await loadBudgets();
    await loadExpenses();
    setupEventListeners();
    renderUI();
}

async function loadExpenses() {
    allExpenses = await getExpenses();
    rerenderFilteredView();
}

function handleSort(event) {
    const newColumn = event.target.dataset.sortBy;
    if (!newColumn) return;

    if (sortState.column === newColumn) {
        // Cycle through directions: ascending -> descending -> none
        if (sortState.direction === 'ascending') {
            sortState.direction = 'descending';
        } else if (sortState.direction === 'descending') {
            sortState.direction = 'none';
        } else {
            sortState.direction = 'ascending';
        }
    } else {
        // New column, start with ascending
        sortState.column = newColumn;
        sortState.direction = 'ascending';
    }

    rerenderFilteredView();
}

function rerenderFilteredView() {
    // 1. Apply sorting
    let processedExpenses = [...allExpenses];
    if (sortState.direction !== 'none') {
        processedExpenses.sort((a, b) => {
            const valA = a[sortState.column];
            const valB = b[sortState.column];

            if (valA < valB) return sortState.direction === 'ascending' ? -1 : 1;
            if (valA > valB) return sortState.direction === 'ascending' ? 1 : -1;
            return 0;
        });
    }

    // 2. Apply filters
    const filteredExpenses = applyFilters(processedExpenses, currentFilters);

    // 3. Render
    renderExpenseTable(filteredExpenses, allBudgets, sortState);
    renderCharts(filteredExpenses);
}

async function loadBudgets() {
    allBudgets = await getBudgets();
    renderBudgets(allBudgets);
}

function setupEventListeners() {
    const expenseForm = document.getElementById('expense-form');
    const expenseTableContainer = document.getElementById('expense-table-container');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    const exportBtn = document.getElementById('export-csv-btn');
    const importInput = document.getElementById('csv-import-input');
    const budgetForm = document.getElementById('budget-form');

    expenseForm.addEventListener('submit', handleFormSubmit);
    expenseTableContainer.addEventListener('click', handleTableClick);
    cancelEditBtn.addEventListener('click', handleCancelEdit);
    exportBtn.addEventListener('click', handleExport);
    importInput.addEventListener('change', handleImport);
    budgetForm.addEventListener('submit', handleBudgetFormSubmit);

    const generateInsightsBtn = document.getElementById('generate-insights-btn');
    generateInsightsBtn.addEventListener('click', handleInsights);

    const filterForm = document.getElementById('filter-form');
    filterForm.addEventListener('input', handleFilterChange);

    const resetFiltersBtn = document.getElementById('reset-filters-btn');
    resetFiltersBtn.addEventListener('click', () => {
        filterForm.reset();
        // Manually trigger a change event to re-apply filters
        filterForm.dispatchEvent(new Event('input'));
    });

    const tableHeader = document.getElementById('expense-table-header');
    tableHeader.addEventListener('click', handleSort);
}

async function handleFormSubmit(event) {
    event.preventDefault();
    const { id, expenseData } = getFormData();

    if (id) {
        // Update existing expense
        await updateExpense({ ...expenseData, id: parseInt(id) });
    } else {
        // Add new expense
        await addExpense(expenseData);
    }

    clearForm();
    await loadExpenses();
}

async function handleTableClick(event) {
    const target = event.target;
    const id = target.dataset.id;

    if (!id) return;

    if (target.textContent === 'Delete') {
        const confirmDelete = confirm('Are you sure you want to delete this expense?');
        if (confirmDelete) {
            await deleteExpense(parseInt(id));
            await loadExpenses();
        }
    } else if (target.textContent === 'Edit') {
        const expenseToEdit = allExpenses.find(exp => exp.id === parseInt(id));
        if (expenseToEdit) {
            populateForm(expenseToEdit);
        }
    }
}

function handleCancelEdit() {
    clearForm();
}

function handleExport() {
    exportToCSV(allExpenses);
}

async function handleImport(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
        const expensesToImport = await importFromCSV(file);

        if (confirm(`Found ${expensesToImport.length} expenses to import. Do you want to proceed?`)) {
            for (const expense of expensesToImport) {
                // Ensure no 'id' field is passed, so the DB can auto-increment
                const { id, ...expenseData } = expense;
                await addExpense(expenseData);
            }
            await loadExpenses();
            alert('Expenses imported successfully!');
        }
    } catch (error) {
        alert('Error importing CSV: ' + error.message);
    } finally {
        // Reset the input so the user can select the same file again
        event.target.value = '';
    }
}

async function handleBudgetFormSubmit(event) {
    event.preventDefault();
    const categoryInput = document.getElementById('budget-category');
    const amountInput = document.getElementById('budget-amount');

    const budget = {
        category: categoryInput.value.trim(),
        amount: parseFloat(amountInput.value)
    };

    if (!budget.category || isNaN(budget.amount) || budget.amount <= 0) {
        alert('Please enter a valid category and a positive budget amount.');
        return;
    }

    await saveBudget(budget);

    // Clear the form
    categoryInput.value = '';
    amountInput.value = '';

    // Reload data to reflect changes
    await loadBudgets();
    await loadExpenses(); // Reload expenses to apply new budget coloring

    alert(`Budget for ${budget.category} saved successfully!`);
}

function handleInsights() {
    const insights = getInsights(allExpenses, allBudgets);
    renderInsights(insights);
}

function handleFilterChange(event) {
    const formData = new FormData(event.currentTarget);
    currentFilters = {
        dateStart: formData.get('date-start') || '',
        dateEnd: formData.get('date-end') || '',
        category: formData.get('category') || '',
        merchant: formData.get('merchant') || '',
        amountMin: formData.get('amount-min') ? parseFloat(formData.get('amount-min')) : null,
        amountMax: formData.get('amount-max') ? parseFloat(formData.get('amount-max')) : null,
    };
    rerenderFilteredView();
}

// Service Worker Registration
window.addEventListener('load', () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });
    }
});

main();
