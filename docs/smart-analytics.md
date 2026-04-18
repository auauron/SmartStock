# Smart Analytics & Restock Intelligence

> Data-driven recommendations to prevent stockouts, optimize inventory forecasting, and visually analyze storage distribution.

## Overview
The Smart Analytics suite is the central nervous system of the Smart Stock application. It automatically monitors inventory levels against historical consumption data to build predictive stockouts and generate actionable intelligence.

## Features

- **Restock Intelligence Panel**: An expandable, paginated data grid that scores inventory health and outputs calculated restock targets.
- **Category Analytics**: A dynamic horizontal chart providing immediate visual insight into volume distribution across active categories.
- **Low Stock Alerts**: A dashboard brief showcasing up to 4 critical items, complete with a tactical "View All" modal for rapid audits.
- **Urgency Classification**: Items are sorted into `Critical`, `Warning`, and `Healthy` cohorts based on their safety buffers.

---

## Restock Algorithm (How it works)

The Restock Intelligence component (`RestockIntelligence.tsx`) utilizes historical restocking records and current stock levels to predict consumption. 

### 1. Consumption Rate
The system calculates daily consumption dynamically:
1. It looks at the **total quantity restocked** over the lifespan of the item.
2. It divides this by the **days elapsed** since the first restock. 
3. *Fallback:* If an item has no restock history, it assumes a default consumption of the `minStock` depleted over a 30-day period.

### 2. Days Left
Once the daily consumption rate is known, the engine determines how many days remain until the item hits 0 (**Days Left**):

`Days Until Stockout = (Current Quantity - Minimum Stock) / Daily Consumption Rate`

*(If the item is currently below its minimum stock, the runway is `0`, labeled as "Now").*

### 3. Suggested Restock Quantity
The engine prevents understocking by automatically suggesting a quantity that pushes the inventory to a highly secure **2× buffer zone**.

`Target Level = Minimum Stock × 2`
`Suggested Quantity = Target Level - Current Quantity`

---

## Component Architecture

- `RestockIntelligence.tsx`: The primary logic handler for algorithms and the rendering of the predictive table. Uses a responsive Fractional Grid for optimal screen use and `<Pagination />` for clean UX.
- `CategoryDistribution.tsx`: Renders the high-density category analytical chart. Integrated with a horizontal overflow container to support limitless categories.
- `LowStockModal.tsx`: The overlay application handling the complete view of critical inventory, built with a Tactical Glass UI.

## Integrations
- **Routing**: Tightly integrated with the `/restock` portal. Clicking "Restock" directly from the Intelligence dashboard routes you immediately into action.
- **State Updates**: Calculates live updates strictly from the globally passed `inventory` and `history` dependencies using a highly optimized React `useMemo` block.
