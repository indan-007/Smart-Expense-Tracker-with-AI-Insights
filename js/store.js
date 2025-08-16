let db;
const DB_NAME = 'ExpenseTrackerDB';
const DB_VERSION = 2; // Incremented version
const EXPENSE_STORE_NAME = 'expenses';
const BUDGET_STORE_NAME = 'budgets';

export function initStore() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = (event) => {
            console.error('Database error:', event.target.errorCode);
            reject('Database error');
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            console.log('Database opened successfully');
            resolve();
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(EXPENSE_STORE_NAME)) {
                const expenseStore = db.createObjectStore(EXPENSE_STORE_NAME, { keyPath: 'id', autoIncrement: true });
                expenseStore.createIndex('date', 'date', { unique: false });
                expenseStore.createIndex('category', 'category', { unique: false });
                expenseStore.createIndex('merchant', 'merchant', { unique: false });
            }
            if (!db.objectStoreNames.contains(BUDGET_STORE_NAME)) {
                const budgetStore = db.createObjectStore(BUDGET_STORE_NAME, { keyPath: 'category' });
            }
        };
    });
}

// ... (existing expense functions: add, get, update, delete) ...

export function addExpense(expense) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([EXPENSE_STORE_NAME], 'readwrite');
        const store = transaction.objectStore(EXPENSE_STORE_NAME);
        const request = store.add(expense);

        request.onsuccess = () => resolve(request.result);
        request.onerror = (event) => reject('Error adding expense: ' + event.target.errorCode);
    });
}

export function getExpenses() {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([EXPENSE_STORE_NAME], 'readonly');
        const store = transaction.objectStore(EXPENSE_STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = (event) => reject('Error getting expenses: ' + event.target.errorCode);
    });
}

export function updateExpense(expense) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([EXPENSE_STORE_NAME], 'readwrite');
        const store = transaction.objectStore(EXPENSE_STORE_NAME);
        const request = store.put(expense);

        request.onsuccess = () => resolve(request.result);
        request.onerror = (event) => reject('Error updating expense: ' + event.target.errorCode);
    });
}

export function deleteExpense(id) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([EXPENSE_STORE_NAME], 'readwrite');
        const store = transaction.objectStore(EXPENSE_STORE_NAME);
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = (event) => reject('Error deleting expense: ' + event.target.errorCode);
    });
}

// New budget functions
export function saveBudget(budget) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([BUDGET_STORE_NAME], 'readwrite');
        const store = transaction.objectStore(BUDGET_STORE_NAME);
        const request = store.put(budget); // put will add or update

        request.onsuccess = () => resolve(request.result);
        request.onerror = (event) => reject('Error saving budget: ' + event.target.errorCode);
    });
}

export function getBudgets() {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([BUDGET_STORE_NAME], 'readonly');
        const store = transaction.objectStore(BUDGET_STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => {
            // Convert array of budgets to an object keyed by category for easier lookup
            const budgets = request.result.reduce((acc, budget) => {
                acc[budget.category] = budget.amount;
                return acc;
            }, {});
            resolve(budgets);
        };
        request.onerror = (event) => reject('Error getting budgets: ' + event.target.errorCode);
    });
}
