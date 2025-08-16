# Smart Expense Tracker with AI Insights

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

A modern, privacy-focused, and installable Progressive Web App (PWA) for tracking personal expenses. Built with vanilla JavaScript, Tailwind CSS, and Chart.js, this application runs entirely in your browser, ensuring your financial data remains private.

### Tech Stack
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Tailwind CSS](https://img.shields.io/badge/tailwind_css-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Chart.js](https://img.shields.io/badge/chart.js-F5788D.svg?style=for-the-badge&logo=chart.js&logoColor=white)

## ✨ Features

- **Full CRUD Operations**: Easily create, read, update, and delete expenses.
- **Advanced Filtering**: Filter your expenses by date range, category, merchant, or amount to quickly find what you're looking for.
- **Data Portability**: Bulk import and export your data at any time using the standard RFC4180 CSV format.
- **Insightful Visualizations**:
    - **Category Breakdown**: A doughnut chart to see where your money is going.
    - **Monthly Trends**: A line chart to track your spending habits over time.
- **Budgets & Alerts**: Set monthly budgets for different categories and get visual alerts in the expense list when you're approaching or have exceeded your limit.
- **Mock AI Insights**: Click a button to get a heuristic-based summary of your spending habits and actionable savings suggestions.
- **Installable PWA**: Install the app on your desktop or mobile device for a native-like experience with offline access to your data.
- **Accessible**: Table columns are sortable using `aria-sort` for improved screen reader support.

## CSV Format

The CSV file for import/export should have the following columns: `date,category,merchant,amount,notes`.

```csv
date,category,merchant,amount,notes
2024-07-28,Groceries,Supermarket,55.25,"Weekly groceries"
2024-07-28,Transport,Gas Station,40.00,
```

## 🔒 Privacy First

All your financial data is stored locally in your browser's IndexedDB. No data is ever sent to a server. You have full control over your information and can export it for backup whenever you wish.

## 🚀 Future Enhancements

This project has a solid foundation, but there are many ways it could be extended:

- **Multi-Currency Support**: Add an editable foreign exchange (FX) table to manage expenses in different currencies.
- **OpenAI Integration**: Implement a real AI adapter to provide more sophisticated insights by connecting to the OpenAI API.
- **Saved Filter Views**: Allow users to save and quickly apply their favorite filter combinations.
- **Improved Accessibility**: Further enhancements like full keyboard navigation for all interactive elements.

## Development

This is a static web application. To run it, simply open `index.html` in a modern web browser. It uses Tailwind CSS and Chart.js from a CDN, so no build step is required.

---

If you find this project useful, please consider giving it a ⭐!

Built by Jules.