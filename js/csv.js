export function exportToCSV(expenses) {
    const headers = ['date', 'category', 'merchant', 'amount', 'notes'];
    const csvRows = [headers.join(',')];

    for (const expense of expenses) {
        const values = headers.map(header => {
            // Handle cases where a value might be missing (e.g., notes)
            const value = expense[header] !== null && expense[header] !== undefined ? expense[header] : '';
            // Basic CSV escaping: wrap in quotes, escape existing quotes
            const escaped = ('' + value).replace(/"/g, '""');
            return `"${escaped}"`;
        });
        csvRows.push(values.join(','));
    }

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'expenses.csv';

    document.body.appendChild(a);
    a.click();

    // Clean up
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

export function importFromCSV(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const text = event.target.result;
                const expenses = [];
                const rows = text.trim().split('\n');
                const headers = rows[0].split(',').map(h => h.trim().replace(/"/g, ''));

                const requiredHeaders = ['date', 'category', 'merchant', 'amount'];
                if (!requiredHeaders.every(h => headers.includes(h))) {
                    throw new Error('CSV must include date, category, merchant, and amount headers.');
                }

                for (let i = 1; i < rows.length; i++) {
                    if (!rows[i]) continue;

                    // This is a simple parser, for a more robust solution a library would be better
                    const values = rows[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

                    const expense = {};
                    for (let j = 0; j < headers.length; j++) {
                        let value = values[j] ? values[j].trim() : '';
                        if (value.startsWith('"') && value.endsWith('"')) {
                            value = value.slice(1, -1).replace(/""/g, '"');
                        }
                        expense[headers[j]] = value;
                    }

                    // Basic validation and type conversion
                    if (expense.date && expense.amount) {
                         expense.amount = parseFloat(expense.amount);
                         // remove any properties that are not part of the expense object
                         delete expense.id;
                         expenses.push(expense);
                    }
                }
                resolve(expenses);
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = (event) => {
            reject('File could not be read: ' + event.target.error.code);
        };
        reader.readAsText(file);
    });
}
