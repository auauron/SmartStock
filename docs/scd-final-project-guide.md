# SmartStock SCD Final Project Guide

Course: Software Component Design (BSSE 2, 2nd Semester, A.Y. 2025-2026)

> [!IMPORTANT]
> **Key Project Files:**
> - [Assignment Rubric & Instructions](file:///c:/projects/smart-stock/docs/REFERENCE_INSTRUCTIONS.md)
> - [DRAFT Final Documentation Paper](file:///c:/projects/smart-stock/docs/SMARTSTOCK_FINAL_PROJECT.md)

This guide converts your SCD final-project instructions and rubric into a project-specific implementation and documentation checklist for SmartStock.

## 1) Repository Reality Check (Current State)

Use this section to avoid overclaiming in the paper and presentation.

### Implemented now

- Running React + TypeScript + Vite application structure
- Supabase authentication setup and shared client instance
- Login/Signup flow with mapped auth error messages
- Inventory and Restock screens with real database-backed CRUD-style flows
- Reusable UI component set in `src/components/ui`
- Storybook scaffolding exists in `src/stories`
- Vitest suite with passing unit and integration tests

### Partial / placeholder now

- Server utility/function files for report and low-stock alert are present but empty

### Why this matters

Rubric penalties happen when documented claims do not match demonstrable code. Keep all claims tied to actual files.

## 2) Design Pattern Plan Required by SCD

Minimum requirement is 2 patterns. Recommended target is 3 patterns. SmartStock uses 3.

### Pattern A: Singleton (Creational) - Implemented

- Pattern name: Singleton Pattern
- Category: Creational
- Code location: `src/lib/supabaseClient.ts`
- Key role in system: Provides one shared Supabase client instance across modules

Problem without pattern:

- Multiple ad hoc clients would increase configuration duplication, inconsistent auth/session behavior, and maintenance overhead.

Design principles reinforced:

- SRP (connection setup in one place)
- DRY (single source for backend client configuration)

### Pattern B: Decorator (Structural) - Implemented as UI behavior composition

- Pattern name: Decorator Pattern (component composition form)
- Category: Structural
- Code location:
  - `src/components/ui/InputField.tsx`
  - `src/components/ui/SelectField.tsx`
  - `src/components/ui/TextAreaField.tsx`
  - `src/components/ui/CheckboxField.tsx`
  - `src/components/ui/ToggleSwitch.tsx`
- Key role in system: Adds optional labels, icons, wrappers, and presentational behavior around base form controls through reusable wrappers/props

Problem without pattern:

- Forms would duplicate label/icon/spacing logic, become inconsistent, and be harder to maintain.

Design principles reinforced:

- OCP (add optional behavior through props/composition without rewriting each consumer)
- SRP (field layout behavior centralized per component)

### Pattern C: Factory Method (Creational) - Implemented

- Pattern name: Factory Method Pattern
- Category: Creational
- Code location:
  - `src/factories/inventoryFactory.ts`
- Key role in system: Handles construction and normalization of database rows into strongly-typed domain entities.

Problem without pattern:

- Object creation/normalization is duplicated in pages/components, making validation/defaulting inconsistent and increasing bug risk across different database integration points.

Design principles reinforced:

- SRP (construction + normalization in one place)
- OCP (easy to add new creation rules)
- DIP (business object construction decoupled from UI handlers)

## 3) SCD Documentation Paper Checklist (11 Required Sections)

Use this list as a done/not-done tracker for your final paper.

1. Title Page
2. Member Roles
3. Problem Statement
4. Application Overview
5. Proposed Solution
6. Goals and Objectives (at least 4)
7. Design Patterns Used (deep explanation per pattern)
8. System Architecture Diagram
9. Features
10. Project Timeline (Gantt Chart)
11. References

For section 7 (Design Patterns Used), include for each pattern:

- Pattern name and category
- Exact file/class/module locations
- Problem without the pattern
- Proposed solution structure
- How components interact
- Design principles upheld
- Optional short snippet

## 4) Rubric-to-Code Action Mapping

### Rubric A: System/Application

- Design Pattern Implementation (40):
  - Singleton and Decorator are clearly demonstrable in `lib` and `ui` folders
  - Factory Method is implemented in `src/factories` and used by service layers
- System Functionality (30):
  - Ensure all declared core features run in demo without critical runtime errors
  - Pattern behavior must be triggerable in live demo, not just present in files
- Code Quality & Organization (15):
  - Keep patterns in dedicated, clearly named files/folders
  - Add concise comments only where pattern structure is not obvious
- GitHub Contribution History (15):
  - Use descriptive commits per member
  - Avoid last-minute bulk commits

### Rubric B: Documentation Paper

- Pattern Justification & Explanation (35):
  - Explain why SmartStock needed each pattern and what would break without it
  - Avoid textbook-only definitions
- Completeness of Required Sections (25):
  - Complete all 11 sections with meaningful detail
- Clarity, Writing Quality & Grammar (20):
  - Keep one consistent formal voice throughout paper
- System Architecture Diagram (10):
  - Reflect real components and data flow
  - Show pattern-related structures where applicable
- Gantt Chart/Timeline (10):
  - Show realistic phased schedule across project duration

## 5) Testing Requirements Integration (For Final Project Defense)

Although SCD grading emphasizes patterns and architecture, testing evidence supports system-functionality and code-quality credibility.

Required testing coverage plan for SmartStock:

- Unit tests (Vitest): factories, utility logic
- API integration tests (Vitest + MSW): service-layer and Supabase interaction boundaries
- Component coverage (Storybook): reusable UI components used across pages
- E2E tests (Playwright): sign in flow, inventory CRUD, and restock tracking

## 6) Demo Readiness Checklist (Before Final Presentation)

1. App runs without critical errors
2. Login and signup flow works in demo environment
3. Inventory flow (create/edit/delete/search/filter) is demonstrable
4. Restock add/history flow is demonstrable
5. Singleton usage can be pointed to quickly in code
6. Decorator usage can be shown through reusable field wrappers
7. Factory methods are implemented and used by service handlers
8. Documentation section for each pattern includes why-needed and what-breaks-without-it
9. Git history shows distributed, descriptive team commits
10. Architecture diagram and timeline are ready and consistent with code

## 7) Suggested Commit Message Style

Use descriptive pattern/test-focused messages, for example:

- `feat(inventory): implement inventoryFactory and refactor data normalization`
- `refactor(restock): update service layer to use the inventories table`
- `test(inventory): add integration tests for inventory CRUD logic`
- `docs: update design patterns rationale for the SCD project defense`
