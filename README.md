# Fin-SLA-Dashboard

# FIN Commercial SLA Compliance Dashboard

## Complete ReactJS Frontend Development Prompt

You are a **Senior Frontend Engineer, ReactJS Architect, and Enterprise UI/UX Designer with 10+ years of experience**.

Build a complete, production-quality, responsive frontend application from scratch called:

**FIN Commercial SLA Compliance Dashboard**

This is an enterprise operations dashboard used by **Finance and Commercial teams** to monitor:

* SLA compliance
* Execution performance
* Missed SLA reasons
* Operational exceptions
* Root-cause analysis
* Resolution status
* Historical performance
* Daily execution performance
* Reporting and operational insights

The application must feel like a **real internal enterprise business intelligence product**, not a generic website or demo.

---

# 1. Technology Requirements

Use:

* ReactJS
* Modern functional components
* React Hooks
* Component-based architecture
* Tailwind CSS
* Lucide React icons
* Recharts or Apache ECharts for charts
* Local mock JSON data
* Client-side state management
* Responsive CSS
* Accessible semantic HTML

You may use other lightweight frontend libraries when they materially improve the UX.

## Strictly Frontend Only

Do **NOT** implement:

* Backend
* REST APIs
* GraphQL
* Database
* Snowflake integration
* Oracle integration
* Azure integration
* Microsoft Entra ID
* Real authentication providers
* Server-side authentication
* External data services

Everything must work using:

**React + local mock JSON data + client-side state.**

---

# 2. Critical Data Requirement

This is extremely important.

**Do not hardcode dashboard values directly inside UI components.**

Create realistic mock JSON data and calculate all dashboard values dynamically from that data.

For example:

* Total Executions
* SLA Met
* SLA Missed
* Overall SLA Compliance
* Current Month SLA Compliance
* Oracle Planning SLA
* Monthly totals
* Daily totals
* Miss analysis
* Exception counts
* Trends
* Variance
* Charts
* Tables

must be derived from the mock records.

If the mock JSON changes, the dashboard should automatically recalculate.

Avoid code such as:

```js
const compliance = 94.7;
const totalExecutions = 1250;
```

Instead calculate these values from the dataset.

---

# 3. Design Philosophy

Create a **premium enterprise finance/operations dashboard**.

The UI should look:

* Professional
* Classy
* Modern
* Trustworthy
* Data-driven
* Operational
* Premium
* Clean
* Dense but readable
* Easy to scan
* Suitable for daily business operations

The visual language should combine:

* Enterprise BI
* Financial software
* Operations monitoring
* Modern SaaS dashboards
* Subtle 3D depth

Avoid making it look like a marketing website.

---

# 4. Color Direction

Primary palette:

* Deep Navy
* Dark Blue
* Steel Blue
* White
* Soft Gray
* Slate Gray
* Teal
* Green
* Amber
* Red

Use colors meaningfully:

### Green

Healthy / SLA Met / Resolved / On Target

### Red

SLA Missed / Critical / Failure

### Amber

Warning / Approaching Target / Pending / Unresolved

### Blue

Information / Primary actions / Active states

Do not overuse colors.

Maintain strong contrast and accessibility.

---

# 5. Border, Shadow and Shape System

Use a restrained enterprise visual system.

Prefer:

* Subtle borders
* Soft shadows
* Small elevation differences
* Compact cards
* Clean separators
* Consistent spacing

Maximum border radius should generally be around **8px**.

Do not create excessive rounded cards.

Avoid:

* Huge pill-shaped containers
* Excessive gradients
* Decorative blobs
* Random illustrations
* Excessive glassmorphism
* Overly colorful dashboards

---

# 6. 3D and Animation Requirements

The application should have **subtle, professional 3D depth and animation**, especially on the:

* Login page
* Dashboard
* KPI cards
* Navigation
* Modals
* Charts
* Interactive elements

The animation must feel premium and enterprise appropriate.

Use subtle effects such as:

* 3D card hover
* Depth transitions
* Soft perspective
* Layered shadows
* Smooth card elevation
* Chart entrance animations
* KPI number transitions
* Progress bar animations
* Sidebar transitions
* Modal transitions
* Button micro-interactions
* Page transitions
* Hover states
* Active navigation transitions

Do NOT make the interface look like a gaming website.

Animation should improve usability rather than distract users.

Respect `prefers-reduced-motion`.

---

# 7. Typography

Use a professional modern sans-serif typography system.

Prioritize:

* Clear hierarchy
* Readability
* Compact dashboard typography
* Strong KPI numbers
* Consistent heading scale
* Clear labels
* Readable tables

Typography should feel similar to a high-quality enterprise analytics platform.

---

# 8. Application Structure

Create a clean reusable architecture similar to:

```text
src/
├── components/
│   ├── common/
│   │   ├── Badge
│   │   ├── Modal
│   │   ├── EmptyState
│   │   ├── LoadingState
│   │   ├── ErrorState
│   │   └── StatusIndicator
│   │
│   ├── dashboard/
│   │   ├── KpiCard
│   │   ├── FilterBar
│   │   ├── ExceptionsTable
│   │   ├── StatusBanner
│   │   └── SegmentedControl
│   │
│   ├── charts/
│   │   ├── ChartCard
│   │   ├── MonthlyPerformanceChart
│   │   ├── MonthlyTrendChart
│   │   ├── DailyStatusChart
│   │   ├── LoadEndTimeChart
│   │   └── MissAnalysisCharts
│   │
│   ├── layout/
│   │   ├── AppLayout
│   │   ├── Sidebar
│   │   ├── Topbar
│   │   └── MobileNavigation
│   │
│   └── ui/
│       ├── Button
│       ├── Input
│       ├── Select
│       ├── DatePicker
│       ├── Tabs
│       ├── Tooltip
│       └── DataTable
│
├── data/
│   ├── mockDashboardData.json
│   ├── mockReports.json
│   └── mockUsers.json
│
├── pages/
│   ├── LoginPage
│   ├── DashboardPage
│   ├── SlaPerformancePage
│   ├── ExceptionsPage
│   ├── ReportsPage
│   └── SettingsPage
│
├── utils/
│   ├── formatters
│   └── slaCalculations
│
└── App
```

Keep components reusable.

Avoid putting business logic directly inside large page components.

---

# 9. Login Page

Create an extremely polished enterprise login experience.

This page should receive special design attention.

## Desktop Layout

Use a full-screen split layout.

### Left Section

Display:

**FIN**

**Commercial SLA Compliance**

Supporting message:

**Operational visibility for finance and commercial data execution**

Use a sophisticated dark navy/blue visual environment.

Include subtle:

* Grid patterns
* Geometric lines
* Data-inspired visual elements
* Depth
* Soft animated particles or lines if appropriate
* Subtle 3D perspective

Keep it professional.

### Right Section

Create the login form.

Include:

* Email / Username
* Password
* Show / Hide Password
* Remember Me
* Sign In button
* Forgot Password
* Validation messages
* Loading state
* Disabled state
* Invalid credentials state

Use excellent spacing and hierarchy.

The login card should feel premium.

---

# 10. Mock Login Behaviour

Since this is frontend-only:

Implement a mock login flow.

Example:

```text
User enters credentials
        ↓
Client-side validation
        ↓
Loading state
        ↓
Mock authentication
        ↓
Success
        ↓
Dashboard
```

Also demonstrate:

* Empty field validation
* Invalid credentials
* Loading state
* Disabled submit button
* Successful login

Do not connect to a real authentication provider.

---

# 11. Global Application Layout

After login, display an application shell.

It should contain:

* Sidebar
* Topbar
* Main content area

---

# 12. Sidebar

Include:

### Branding

**FIN**

**Commercial SLA Compliance**

### Navigation

1. Dashboard
2. SLA Performance
3. Exceptions
4. Reports
5. Settings

Each navigation item must include:

* Lucide icon
* Label
* Active state
* Hover state
* Keyboard focus state

## Desktop

Support:

* Expanded sidebar
* Collapsed sidebar

## Mobile

Support:

* Hidden sidebar
* Hamburger menu
* Slide-in sidebar
* Close button
* Overlay
* Smooth transition

At the bottom display:

* User/workspace information
* User initials/avatar
* User name

---

# 13. Topbar

Include:

* Page title
* Page subtitle
* Search field
* Notification icon
* User avatar
* User name/initials
* Last refresh timestamp
* Refresh action
* Mobile menu button

Keep the topbar clean.

It should not visually compete with the main dashboard.

---

# 14. Dashboard Page

The Dashboard is the primary application screen.

## Header

Display:

Eyebrow:

**Performance Intelligence**

Heading:

**Compliance Performance**

Supporting text describing the selected reporting scope.

Actions:

* Refresh Data
* View controls / tabs

---

# 15. Filter Pane

Place the filter section below the topbar and above the KPI cards.

Filters:

### Date Range

* Start Date
* End Date

### Year

* Year selector

### Subdomain

* All
* Available mock subdomains

### SLA Status

* All
* Met
* Missed

### Source

* All
* Commercial Insights
* Oracle Planning

Include:

**Clear Filters**

Requirements:

* Visible labels
* Compact controls
* Clear active filter state
* Keyboard accessibility
* Responsive design
* Preserve selected values
* Update KPI cards
* Update charts
* Update tables

On mobile, stack filters into one or two columns.

---

# 16. KPI Cards

Create four primary KPI cards.

Each KPI card must contain:

* Icon
* KPI label
* Main value
* Supporting information
* Status badge
* Progress bar
* Optional trend
* Target marker when relevant

Keep all KPI cards equal in height.

---

## KPI 1 — Total Executions

Display:

**Total Executions**

Calculate:

* Total execution count
* SLA Met
* SLA Missed

Example supporting structure:

```text
1,245
1,180 Met
65 Missed
```

Use a blue scope/status indicator.

The value must come from the dataset.

---

## KPI 2 — Overall SLA Compliance

Display:

**Overall SLA Compliance**

Calculate:

```text
SLA Met / Total Eligible Executions × 100
```

Target:

**95%**

Display:

* Percentage
* Gap from target
* Status badge
* Progress bar
* Target marker
* Optional trend

If >= 95%:

**On Target**

If < 95%:

**Below Target**

Use green for healthy performance and red when below target.

---

# 17. KPI 3 — Current Month SLA Compliance

Display:

**Current Month SLA Compliance**

Calculate the current month's compliance from the mock records.

Display:

* Current month percentage
* Month-to-date
* Target comparison
* Progress bar
* Target marker

Use:

* Green when meeting target
* Amber when approaching target
* Red when significantly below target

Do not hardcode the percentage.

---

# 18. KPI 4 — Oracle Planning Data SLA

Display:

**Oracle Planning Data SLA**

Supporting text:

**Day 1 and WD1–WD3 rules**

Calculate from relevant Oracle Planning records.

Display:

* Percentage
* Progress bar
* Target
* Status badge

Critical when below target.

---

# 19. Dashboard Segmented Navigation

Create a premium segmented navigation control containing:

* SLA Details
* SLA Miss Analysis
* SLA Miss Reason

Use Lucide icons.

Active state:

* Blue background
* White text
* Strong contrast
* Clear pressed state

Implement:

```html
aria-pressed
```

for accessibility.

Also include a:

**Refresh Data**

button with refresh icon and loading animation.

---

# 20. Chart System

Use:

* Recharts
  OR
* Apache ECharts

Every chart must use a reusable `ChartCard`.

Each chart card should contain:

* Title
* Subtitle
* Chart
* Consistent padding
* Stable height
* Tooltip
* Responsive resizing
* Loading state
* Empty state
* Accessible labels

Charts must be data-driven.

---

# 21. Chart 1 — Monthly SLA Performance

Title:

**Monthly SLA Performance**

Subtitle:

**Execution volume by outcome**

Chart:

**Stacked Bar Chart**

Display months:

**March 2026 → August 2026**

Series:

* SLA Met
* SLA Missed

Use:

* Green = SLA Met
* Red = SLA Missed

Requirements:

* Legend
* Monthly totals
* Tooltip
* Compliance percentage in tooltip
* Responsive layout
* Click on missed section
* Open record detail modal
* Empty state

All values must be calculated from JSON.

---

# 22. Chart 2 — Monthly SLA Trend

Title:

**Monthly SLA Trend**

Subtitle:

**Target threshold: 95%**

Chart:

**Smooth Line Chart**

Requirements:

* Monthly compliance percentage
* Blue compliance line
* Circular data points
* Dashed 95% target line
* Green points when >= target
* Red points when < target
* Tooltip with target gap
* Missing month handling

If a month has no eligible executions:

Display:

**No eligible executions**

Do not show misleading zero values.

---

# 23. Chart 3 — Daily SLA Trend

Title:

**Daily SLA Trend**

Subtitle:

**Each bar represents an evaluated execution**

Use a daily status bar chart.

Requirements:

* Execution date
* Green = Met
* Red = Missed
* Tooltip with date/status
* Clickable bar
* Open execution detail modal
* Responsive x-axis
* Prevent overcrowded labels
* Intelligent label intervals

---

# 24. Chart 4 — Daily Load End Time

Title:

**Daily Load End Time**

Subtitle:

**Display time zone: configured EST**

Use a scatter chart.

Requirements:

* Daily completion times
* Green = SLA Met
* Red = SLA Missed
* Dashed SLA cutoff line
* SLA cutoff = 8:00 AM

Tooltip must display:

* Actual completion time
* SLA cutoff
* Variance in minutes
* Source
* SLA rule
* Execution ID

Use a readable time-based y-axis.

---

# 25. SLA Miss Analysis

When the user selects:

**SLA Miss Analysis**

show a diagnostic analysis workspace.

Display:

* Total missed executions
* Diagnostic heading
* Summary information
* Analysis grid

Desktop:

**Three-column layout**

Mobile:

**Single-column layout**

Recommended visualizations:

1. Misses by Issue Category
2. Misses by Execution Layer
3. Misses by Responsible Team
4. RCA Status
5. Solution Status
6. Monthly Missed Execution Trend

Use:

* Red = Critical
* Amber = Unresolved/Pending
* Blue = Informational
* Green = Resolved/Permanently Fixed

Charts should support interaction.

Clicking a chart category should allow users to inspect relevant records.

---

# 26. SLA Miss Reason View

Create a review-oriented workspace for investigating missed SLAs.

Include:

* Introductory status message
* Search
* Sort
* Filters
* Exceptions table
* Hover states
* Clickable rows
* Empty state
* Record detail modal

Table columns:

1. Execution ID
2. Date
3. Source
4. SLA Rule
5. Status
6. Variance
7. Issue Category
8. Execution Layer
9. Responsible Team
10. Solution Status
11. RCA Status

Use badges for:

* Status
* Categories
* Severity
* RCA status
* Solution status

Missed records should be visually prominent without overwhelming the user.

---

# 27. Execution Record Detail Modal

When a user clicks:

* Missed chart segment
* Daily execution
* Exception row
* SLA miss record

open a reusable detail modal.

Display:

* Execution ID
* Date
* Source
* Subdomain
* Load Type
* SLA Rule
* Expected cutoff
* Actual end time
* Variance
* Status
* Issue category
* Execution layer
* Responsible team
* RCA status
* Solution status

Add:

* Close button
* Escape-key support
* Accessible focus handling
* Smooth open/close animation

---

# 28. SLA Performance Page

Create a dedicated historical performance page.

Include:

* Page title: **SLA Performance**
* Date filters
* Scope filters
* KPI summary row
* Monthly performance chart
* Monthly trend chart
* Daily completion-time chart
* Performance comparison sections
* Export/report action

Keep this page focused on:

**Historical performance + trends**

Provide:

* Loading state
* Empty state
* Responsive design

---

# 29. Exceptions Page

Create a dedicated operational exceptions workflow.

Include:

* Page title: **Exceptions**
* Exception count
* Status filters
* Source filters
* Search
* Sort
* Exceptions table
* Severity badges
* Detail modal
* Empty state

Users should be able to inspect a complete execution record without leaving the page.

Provide strong row hover and selected states.

---

# 30. Reports Page

Create a report-oriented page.

Include:

### Header

**Reports**

### Controls

* Reporting period
* Report type
* Generate/Preview action

### Summary Preview

Include:

* Compliance summary
* Missed SLA summary
* Total executions
* SLA target
* Performance overview

### Recent Reports

Display:

* Report name
* Reporting period
* Generated date
* Status
* Action

Use static mock report data.

Implement frontend-only interactions.

---

# 31. Settings Page

Create:

**Settings**

Organize settings into logical sections rather than placing every setting into a separate floating card.

Include:

### User Preferences

* User display preferences

### Dashboard Preferences

* Default date range
* Default SLA target
* Dashboard display preferences

### Notifications

* Notification preferences

### Appearance

* Theme preference

Actions:

* Save Settings
* Reset Settings

After saving, show clear success feedback.

Example:

**Settings saved successfully**

---

# 32. Mock Data Model

Create realistic local JSON data.

Example structure:

```json
{
  "id": "SLA-001",
  "date": "2026-08-03",
  "status": "Met",
  "endTimeMinutes": 442,
  "slaCutoff": 480,
  "slaRule": "Day 1",
  "source": "Commercial Insights",
  "subdomain": "COMMERCIAL",
  "loadType": "Full",
  "issueCategory": null,
  "executionLayer": null,
  "responsibleTeam": null,
  "solutionStatus": null,
  "rcaStatus": null,
  "varianceMinutes": -38
}
```

Create sufficient mock data from:

**March 2026 through August 2026**

Include:

* Successful executions
* Missed executions
* Multiple sources
* Multiple SLA rules
* Multiple subdomains
* Different issue categories
* Different execution layers
* Different responsible teams
* Different RCA statuses
* Different solution statuses
* Different load types
* Different completion times
* Different variances

Make the dataset realistic enough to demonstrate all dashboard states.

---

# 33. Data Calculation Layer

Create reusable utility functions such as:

```text
calculateTotalExecutions()
calculateMetExecutions()
calculateMissedExecutions()
calculateCompliancePercentage()
calculateCurrentMonthCompliance()
calculateOraclePlanningCompliance()
calculateMonthlyPerformance()
calculateDailyPerformance()
calculateMissReasons()
calculateTeamPerformance()
calculateVariance()
```

Do not duplicate calculation logic across pages.

Create a reusable calculation/data transformation layer.

---

# 34. Filtering Architecture

Filters must affect the entire dashboard dynamically.

For example:

```text
User selects:
August 1 → August 20
        ↓
Filter mock records
        ↓
Recalculate KPI values
        ↓
Recalculate charts
        ↓
Update tables
        ↓
Update exception count
```

All relevant components should respond to filter changes.

---

# 35. Interaction Requirements

Implement:

* Mock login
* Login validation
* Sidebar collapse
* Mobile sidebar
* Page navigation
* Date filtering
* Select filtering
* Clear filters
* Search
* Table filtering
* Table sorting
* Chart tooltips
* Chart interactions
* Record detail modal
* Refresh state
* Loading states
* Empty states
* Error states
* Form validation
* Settings save feedback
* Responsive transitions

---

# 36. Refresh Behaviour

The Refresh button should behave like a real enterprise dashboard.

On click:

```text
Refresh clicked
      ↓
Button enters loading state
      ↓
Subtle spinner animation
      ↓
Mock data refresh/recalculation
      ↓
Dashboard updates
      ↓
Updated timestamp
```

Do not actually call an API.

Use local mock data.

---

# 37. Responsive Requirements

## Desktop

Use:

* Fixed sidebar
* Four-column KPI grid
* Two-column chart grid
* Spacious content area
* Full filter pane

---

## Tablet

Use:

* Collapsible sidebar
* Two-column KPI grid
* Two-column chart layout where space permits
* Wrapping filter controls

---

## Mobile

Use:

* Hidden sidebar
* Menu button
* Slide-in navigation
* Single-column charts
* Two-column KPIs when readable
* Single-column KPI layout on very narrow screens
* Stacked filters
* Horizontally scrollable tables
* Full-width buttons

Important:

**No clipped text.**

**No overlapping controls.**

**No broken charts.**

**No horizontal page overflow.**

All:

* Buttons
* Labels
* Badges
* Inputs
* Tables
* Chart labels
* Icons

must fit correctly.

---

# 38. Accessibility

Implement proper accessibility.

Requirements:

* Semantic HTML
* Proper form labels
* Keyboard navigation
* Visible focus states
* Accessible buttons
* `aria-label` for icon-only buttons
* `aria-pressed` for segmented controls
* Accessible modals
* Escape-key modal closing
* Focus management
* Sufficient color contrast
* Meaningful empty states
* Loading status
* Refresh status
* Accessible error messages

Do not rely on color alone to communicate status.

---

# 39. Loading States

Every major data-driven section should have an appropriate loading state.

Examples:

* Skeleton KPI cards
* Skeleton chart
* Table skeleton
* Button spinner
* Page loading indicator

Keep loading states visually consistent.

---

# 40. Empty States

Create reusable empty-state components.

Examples:

**No executions found**

**No SLA misses found**

**No exceptions match your filters**

**No eligible executions for this period**

Include:

* Helpful message
* Optional icon
* Clear next action where appropriate

---

# 41. Error States

Create professional error states.

Example:

**Unable to load dashboard data**

Supporting text:

**Something went wrong while preparing the dashboard. Please try refreshing the data.**

Provide:

**Retry**

button.

Since this is frontend-only, simulate error states where useful.

---

# 42. Tables

Tables must be enterprise-grade.

Support:

* Sorting
* Search
* Filtering
* Hover
* Selected row
* Clickable rows
* Status badges
* Responsive scrolling
* Empty state
* Loading state

Avoid excessive visual noise.

---

# 43. Micro-interactions

Add polished interactions to:

* Buttons
* Cards
* Sidebar
* Tabs
* Filters
* Table rows
* Modals
* Charts
* Progress bars

Use subtle animations.

Do not over-animate.

The dashboard should remain fast and professional.

---

# 44. Performance Requirements

Optimize the frontend.

Avoid:

* Unnecessary re-renders
* Repeated calculations
* Large duplicated components
* Excessive animation
* Unnecessary dependencies

Use reusable calculated data where appropriate.

Keep the UI responsive even with a larger mock dataset.

---

# 45. Code Quality

Use:

* Clean naming
* Reusable components
* Small focused components
* Clear folder structure
* Reusable utilities
* No duplicated UI
* No duplicated business logic
* No unnecessary inline constants
* No hardcoded dashboard metrics

Keep page-level components focused on composition.

---

# 46. Important Visual Priority

Spend the highest design effort on:

### 1. Login Page

It should immediately feel premium, modern and trustworthy.

### 2. Dashboard

It should feel like a real enterprise operations control center.

### 3. KPI Cards

They should clearly communicate health and performance.

### 4. Charts

They should be clean, readable and useful for decision-making.

### 5. Tables

They should support daily operational investigation.

---

# 47. Dashboard UX Goal

A user should be able to answer these questions within a few seconds:

1. How many executions happened?
2. How many met SLA?
3. How many missed SLA?
4. What is the current compliance percentage?
5. Are we above or below the 95% target?
6. Which month performed poorly?
7. Which executions missed SLA?
8. Why did they miss?
9. Which team/layer/source is responsible?
10. What is the current resolution status?
11. When did executions complete?
12. Are there operational exceptions requiring attention?

Design the interface around these questions.

---

# 48. Important Business Logic

Use:

**SLA Compliance = SLA Met / Eligible Executions × 100**

Use a default SLA target of:

**95%**

For time-based variance:

```text
Variance = Actual Completion Time - SLA Cutoff
```

Negative variance:

**Completed before cutoff**

Positive variance:

**Completed after cutoff**

Do not treat records with missing/invalid SLA evaluation as automatically missed.

Handle them appropriately as ineligible or unavailable.

---

# 49. Quality Expectations

The final application must feel:

* Production-ready
* Enterprise-grade
* Premium
* Consistent
* Fast
* Responsive
* Data-driven
* Professional
* Operational
* Easy to scan
* Accessible

It should resemble a sophisticated internal business intelligence application used by Finance/Commercial operations teams.

It should **not** look like:

* A generic React template
* A marketing landing page
* A student project
* A basic CRUD dashboard
* A collection of unrelated cards

---

# 50. Final Non-Negotiable Requirements

Before considering the application complete, verify:

* [ ] ReactJS is used
* [ ] Tailwind CSS is used
* [ ] Components are reusable
* [ ] Mock data is stored separately from UI components
* [ ] No hardcoded KPI values
* [ ] KPI values are calculated from mock JSON
* [ ] Charts are calculated from mock JSON
* [ ] Filters dynamically update dashboard data
* [ ] Login page is polished
* [ ] Dashboard is polished
* [ ] Sidebar works
* [ ] Mobile navigation works
* [ ] All pages are navigable
* [ ] Tables are interactive
* [ ] Modals work
* [ ] Charts are interactive
* [ ] Loading states exist
* [ ] Empty states exist
* [ ] Error states exist
* [ ] Refresh interaction works
* [ ] Settings save interaction works
* [ ] Desktop layout works
* [ ] Tablet layout works
* [ ] Mobile layout works
* [ ] Keyboard navigation works
* [ ] Accessibility requirements are implemented
* [ ] No backend is required
* [ ] No API integration is required
* [ ] No Snowflake integration is required
* [ ] No Oracle backend integration is required
* [ ] No Microsoft Entra ID integration is required
* [ ] No authentication provider is required

---

# Final Instruction to Lovable

Build the application **completely**, not as a wireframe or partial prototype.

Prioritize **functionality + visual quality + UX + responsiveness + reusable architecture**.

When a requirement can be implemented using local mock data, implement it rather than creating a placeholder.

Use realistic data and realistic states.

Make the dashboard feel like a product that could actually be presented to a **Finance/Commercial Operations Manager or Senior Data/BI Manager**.

The final result should communicate:

**“This is a professional enterprise SLA monitoring and operational intelligence platform.”**

Do not add backend services.

Do not add external authentication.

Do not add Snowflake/API integrations.

Use only:

**ReactJS + Tailwind CSS + reusable components + local mock JSON + client-side state.**
