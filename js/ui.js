export function renderUI() {
    console.log('UI Initialized.');
    // This function can be used to initialize other UI components if needed.
}

export function renderExpenseTable(expenses, budgets = {}, sortState = {}) {
    const tableBody = document.getElementById('expense-table-body');
    tableBody.innerHTML = '';

    // Update aria-sort attributes on headers
    const headers = document.querySelectorAll('#expense-table-header th[data-sort-by]');
    headers.forEach(th => {
        if (th.dataset.sortBy === sortState.column) {
            th.setAttribute('aria-sort', sortState.direction);
        } else {
            th.setAttribute('aria-sort', 'none');
        }
    });

    if (expenses.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" class="text-center py-4">No expenses found.</td></tr>`;
        return;
    }

    const categorySpending = expenses.reduce((acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
        return acc;
    }, {});

    expenses.forEach(expense => {
        const row = document.createElement('tr');
        row.dataset.id = expense.id;

        const budget = budgets[expense.category];
        const spending = categorySpending[expense.category];
        let budgetClass = '';
        if (budget) {
            if (spending > budget) {
                budgetClass = 'bg-red-200'; // Over budget
            } else if (spending / budget >= 0.9) {
                budgetClass = 'bg-yellow-200'; // Nearing budget
            }
        }

        row.className = budgetClass;
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">${expense.date}</td>
            <td class="px-6 py-4 whitespace-nowrap">${expense.category}</td>
            <td class="px-6 py-4 whitespace-nowrap">${expense.merchant}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right">${expense.amount.toFixed(2)}</td>
            <td class="px-6 py-4 whitespace-nowrap">${expense.notes}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button class="text-indigo-600 hover:text-indigo-900" data-id="${expense.id}">Edit</button>
                <button class="text-red-600 hover:text-red-900 ml-2" data-id="${expense.id}">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

export function renderBudgets(budgets) {
    const budgetList = document.getElementById('budgets-list');
    budgetList.innerHTML = '';

    if (Object.keys(budgets).length === 0) {
        budgetList.innerHTML = `<li class="text-gray-500">No budgets set.</li>`;
        return;
    }

    for (const category in budgets) {
        const li = document.createElement('li');
        li.className = 'flex justify-between items-center';
        li.innerHTML = `
            <span>${category}</span>
            <span class="font-semibold">$${budgets[category].toFixed(2)}</span>
        `;
        budgetList.appendChild(li);
    }
}

export function getFormData() {
    const id = document.getElementById('expense-id').value;
    const expenseData = {
        date: document.getElementById('date').value,
        category: document.getElementById('category').value,
        merchant: document.getElementById('merchant').value,
        amount: parseFloat(document.getElementById('amount').value),
        notes: document.getElementById('notes').value,
    };
    return { id, expenseData };
}

export function populateForm(expense) {
    document.getElementById('expense-id').value = expense.id;
    document.getElementById('date').value = expense.date;
    document.getElementById('category').value = expense.category;
    document.getElementById('merchant').value = expense.merchant;
    document.getElementById('amount').value = expense.amount;
    document.getElementById('notes').value = expense.notes;

    document.querySelector('#expense-form button[type="submit"]').textContent = 'Update Expense';
    document.getElementById('cancel-edit-btn').classList.remove('hidden');
}

export function clearForm() {
    const form = document.getElementById('expense-form');
    form.reset();
    document.getElementById('expense-id').value = '';
    document.querySelector('#expense-form button[type="submit"]').textContent = 'Save Expense';
    document.getElementById('cancel-edit-btn').classList.add('hidden');
}

export function renderInsights({ title, message }) {
    const outputContainer = document.getElementById('insights-output');
    const titleEl = document.getElementById('insights-title');
    const messageEl = document.getElementById('insights-message');

    titleEl.textContent = title;
    messageEl.innerHTML = message;
    outputContainer.classList.remove('hidden');
}
