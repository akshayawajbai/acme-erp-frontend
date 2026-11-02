# ACME Finance Management – Project Overview

## 1. Project Purpose

Build a modern, secure, scalable Finance Management SaaS application for accounting and financial operations.

## 2. Technology Stack

### Frontend
- React
- Vite
- JavaScript (JSX only)
- Redux Toolkit / RTK Query
- React Router
- Tailwind CSS
- Reusable component architecture

### Backend
- .NET 10 Web API
- Clean Architecture
- Entity Framework Core

### Database
- Relational database (final provider to be confirmed).

## 3. Project Development Standards

- Follow all rules in `.cursor/rules/project-rules.mdc`.
- The master rules file is the single source of truth.
- Never use TypeScript or TSX.
- Inspect existing code before making changes.
- Reuse existing components and functionality.
- Avoid unnecessary dependencies and duplicate code.
- Follow secure coding and financial data integrity practices.
- Test changes before marking tasks complete.

## 4. Development Roadmap

Follow the 13-phase roadmap defined in `.cursor/rules/project-rules.mdc`.

Never skip phases or assume approval.

## 5. Progress Tracking

Maintain `DEVELOPMENT_PROGRESS.md` in the project root.

Update it after each approved phase or meaningful development milestone.

Never mark a phase as approved without explicit user confirmation.

## 6. Important Approval Rule

Complete one phase at a time.

After completing a phase:
- Run applicable tests.
- Report modified and created files.
- Explain completed and pending tasks.
- Report bugs and blockers.
- Provide manual testing instructions.
- Stop and wait for explicit user approval before starting the next phase.