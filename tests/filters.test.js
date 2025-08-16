// This is a sample test file using Vitest/Jest syntax.
// It cannot be run in this environment but demonstrates testing practices.

import { describe, it, expect } from 'vitest'; // Assuming Vitest is used
import { applyFilters } from '../js/filters.js';

const mockExpenses = [
    { id: 1, date: '2024-07-15', category: 'Groceries', merchant: 'Supermarket', amount: 50 },
    { id: 2, date: '2024-07-20', category: 'Transport', merchant: 'Gas Station', amount: 40 },
    { id: 3, date: '2024-08-01', category: 'Dining Out', merchant: 'Pizza Place', amount: 25 },
    { id: 4, date: '2024-08-05', category: 'Groceries', merchant: 'Corner Store', amount: 15 },
    { id: 5, date: '2024-08-10', category: 'Entertainment', merchant: 'Cinema', amount: 100 },
];

describe('applyFilters', () => {
    it('should return all expenses when filters are empty', () => {
        const filters = {};
        const result = applyFilters(mockExpenses, filters);
        expect(result.length).toBe(5);
    });

    it('should filter by date range', () => {
        const filters = { dateStart: '2024-08-01', dateEnd: '2024-08-31' };
        const result = applyFilters(mockExpenses, filters);
        expect(result.length).toBe(3);
        expect(result.map(e => e.id)).toEqual([3, 4, 5]);
    });

    it('should filter by category (case-insensitive)', () => {
        const filters = { category: 'groceries' };
        const result = applyFilters(mockExpenses, filters);
        expect(result.length).toBe(2);
        expect(result.map(e => e.id)).toEqual([1, 4]);
    });

    it('should filter by amount range', () => {
        const filters = { amountMin: 30, amountMax: 60 };
        const result = applyFilters(mockExpenses, filters);
        expect(result.length).toBe(2);
        expect(result.map(e => e.id)).toEqual([1, 2]);
    });

    it('should filter by merchant', () => {
        const filters = { merchant: 'Supermarket' };
        const result = applyFilters(mockExpenses, filters);
        expect(result.length).toBe(1);
        expect(result[0].id).toBe(1);
    });

    it('should combine multiple filters correctly', () => {
        const filters = { dateStart: '2024-07-01', category: 'Groceries', amountMax: 20 };
        const result = applyFilters(mockExpenses, filters);
        expect(result.length).toBe(1);
        expect(result[0].id).toBe(4);
    });
});
