// This is a sample test file using Vitest/Jest syntax.
// It cannot be run in this environment but demonstrates testing practices.

import { describe, it, expect } from 'vitest'; // Assuming Vitest is used
import { getInsights } from '../js/aiAdapter.js';

// Helper to get a date from days ago
const daysAgo = (days) => new Date(new Date().setDate(new Date().getDate() - days)).toISOString().slice(0, 10);

describe('getInsights', () => {
    it('should return "Not enough data" for no expenses', () => {
        const insights = getInsights([], {});
        expect(insights.title).toBe('Not enough data');
    });

    it('should return "Still learning..." for too few recent expenses', () => {
        const expenses = [{ date: daysAgo(10), amount: 50, category: 'A' }];
        const insights = getInsights(expenses, {});
        expect(insights.title).toBe('Still learning...');
    });

    it('should generate a basic summary', () => {
        const expenses = [
            { date: daysAgo(5), amount: 100, category: 'Groceries' },
            { date: daysAgo(10), amount: 50, category: 'Transport' },
            { date: daysAgo(15), amount: 200, category: 'Shopping' },
        ];
        const insights = getInsights(expenses, {});
        expect(insights.title).toBe('Your Monthly AI Insights');
        expect(insights.message).toContain('you\'ve spent a total of <strong>$350.00</strong>');
        expect(insights.message).toContain('top spending category was <strong>Shopping</strong>');
    });

    it('should generate a budget warning', () => {
        const expenses = [
            { date: daysAgo(5), amount: 150, category: 'Groceries' },
            { date: daysAgo(10), amount: 50, category: 'Transport' },
            { date: daysAgo(15), amount: 100, category: 'Shopping' },
        ];
        const budgets = { 'Groceries': 100 };
        const insights = getInsights(expenses, budgets);
        expect(insights.message).toContain('You\'re over budget in <strong>Groceries</strong>');
    });

    it('should generate a high spending category suggestion', () => {
        const expenses = [
            { date: daysAgo(5), amount: 200, category: 'Dining Out' }, // > 40% of total
            { date: daysAgo(10), amount: 50, category: 'Transport' },
            { date: daysAgo(15), amount: 100, category: 'Shopping' },
        ];
        const insights = getInsights(expenses, {});
        expect(insights.message).toContain('A large portion of your spending is on <strong>Dining Out</strong>');
    });

    it('should generate a frequent merchant suggestion', () => {
        const expenses = [
            { date: daysAgo(2), amount: 5, category: 'Coffee', merchant: 'Coffee Shop' },
            { date: daysAgo(4), amount: 5, category: 'Coffee', merchant: 'Coffee Shop' },
            { date: days ago(6), amount: 5, category: 'Coffee', merchant: 'Coffee Shop' },
            { date: days ago(8), amount: 5, category: 'Coffee', merchant: 'Coffee Shop' },
            { date: days ago(10), amount: 5, category: 'Coffee', merchant: 'Coffee Shop' },
            { date: days ago(12), amount: 5, category: 'Coffee', merchant: 'Coffee Shop' },
        ];
        const insights = getInsights(expenses, {});
        expect(insights.message).toContain('You\'ve visited <strong>Coffee Shop</strong> 6 times recently');
    });
});
