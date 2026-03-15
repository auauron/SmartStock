# SmartStock Project Context

Use these instructions as the default context for all work in this repository.

## Project Summary

SmartStock is a second-year Software Engineering college project. It is a responsive inventory and restock management system for small businesses. The app is built with React 19, TypeScript, Vite, Tailwind CSS v4, React Router v7, and Supabase.

Current product areas in the app:

- Landing page
- Login and signup with Supabase authentication
- Dashboard
- Inventory management
- Restock management
- Settings

Current implementation notes:

- Some pages, especially Dashboard, Inventory, and Restock, still rely on mock or local state data
- Supabase auth is implemented
- Profile caching is implemented in local storage
- Server-side report generation and low-stock email alerts are planned but not implemented yet

## Always Apply These Constraints

- Treat this repository as an academic final project with requirements from multiple subjects
- When suggesting architecture or implementation steps, prefer choices that help satisfy both functional requirements and course requirements
- Do not assume testing infrastructure or design patterns are already fully implemented unless the code confirms it
- When making changes, preserve the existing stack unless there is a strong reason to change it
- Prefer solutions that are realistic for a student project: clear structure, maintainable code, and demonstrable requirements
- Reuse existing UI components before introducing new markup or duplicate component logic
- If a needed UI element does not exist yet, prefer creating it as a reusable component instead of building it inline in a page
- Favor component-based frontend changes that can later be covered in Storybook and component-focused tests
- Keep page-level files focused on layout, data flow, and page composition; extract substantial or reusable UI into components

## Course Requirements To Keep In View

Future work in this repository should support these required deliverables.

### Testing Subject Requirements

Plan and future implementation should include:

- Unit testing
- API testing
- Frontend component coverage with Storybook
- End-to-end testing with Playwright

Preferred tools for this project:

- Vitest for unit testing
- Vitest with MSW for API testing
- Storybook for component documentation and isolated UI testing
- Playwright for end-to-end browser flows

When asked to plan or implement testing, align proposals with these tools unless the user explicitly changes direction.

### Components Subject Requirements

The project must demonstrate these design patterns:

- Decorator Pattern
- Singleton Pattern
- Factory Method Pattern

Preferred mapping in this codebase:

- Singleton Pattern: the shared Supabase client in `src/lib/supabaseClient.ts`
- Factory Method Pattern: typed creation functions for products, restock entries, and related domain objects
- Decorator Pattern: reusable UI field wrappers or behavior-enhancing component composition around base inputs

When asked to add or explain patterns, favor these implementations unless code changes make a better fit necessary.

## Guidance For Future Prompts

When responding to prompts in this repository:

- Ground proposals in the current SmartStock scope and README
- If the user asks for planning, include how the work supports course requirements where relevant
- If the user asks for implementation, prefer incremental changes that move the project toward the testing and pattern requirements
- If documenting features, distinguish clearly between implemented, in-progress, and planned work
- If adding tests in the future, prioritize critical user flows: authentication, inventory CRUD, and restock logging
- If adding Storybook in the future, start with shared UI components such as buttons, inputs, modals, cards, toggles, and selectors
- Before creating new frontend UI, check whether an existing component in `src/components` or `src/components/ui` can be reused or extended
- When new frontend UI is necessary, extract it into a reusable component with clear props so it can be documented and tested independently later

## Documentation Expectations

Keep README and related explanations consistent with the real state of the codebase.

- Do not describe planned features as already implemented
- Call out mock-data areas honestly
- Keep explanations clear enough for academic review and project defense

## Response Format Preference

- End each implementation-oriented final response with a suggested Git commit message
