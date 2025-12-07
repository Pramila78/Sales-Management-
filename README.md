# EliteSales Dashboard

## Overview
EliteSales is a comprehensive Retail Sales Management System designed to handle complex sales data with precision. It features a minimalist, high-end UI (Beige/Black aesthetic) and demonstrates advanced frontend engineering capabilities including real-time data processing, responsiveness, and state management without relying on external UI libraries for core logic.

## Tech Stack
- Frontend Framework: React 18 (TypeScript)
- Styling: Tailwind CSS
- Icons: Lucide React
- Visualization: Recharts
- Build Tool: Vite

## Search Implementation Summary
Search is implemented using a custom `useDebounce` hook (400ms delay) to optimize performance. It performs a case-insensitive text match against `Customer Name` and `Phone Number` fields within the dataset, working concurrently with active filters.

## Filter Implementation Summary
The filtering engine supports complex, multi-criteria logic:
- Multi-Select: Array intersection logic for Regions, Categories, and Payment Methods.
- Range-Based: Numeric comparison for Age and ISO Date string comparison for Date Ranges.
- State: Filters are managed via a centralized `FilterState` object to ensuring clean data flow.

## Sorting Implementation Summary
Sorting is handled by a dynamic comparator function in the service layer. It correctly parses and compares:
- Dates (Time value)
- Strings (Locale compare)
- Numbers (Arithmetic difference)
It maintains the sort order (ASC/DESC) while preserving the filtered dataset state.

## Pagination Implementation Summary
Pagination is simulated to mimic server-side logic. The system calculates `totalPages` based on the filtered record count and uses slice operations (calculated via `page` and `pageSize`) to return only the specific subset of data required for the current view.

## Setup Instructions
1. Install Dependencies:
   ```bash
   npm install
   ```
2. Run Development Server:
   ```bash
   npm run dev
   ```
3. Build for Production:
   ```bash
   npm run build
   ```

