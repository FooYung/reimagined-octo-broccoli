# E-Commerce Portfolio Project (PC Hardware Store)

## Theme

Build the application as a **PC hardware retailer**. The storefront
should sell realistic computer hardware such as:

-   CPUs
-   Graphics Cards (GPUs)
-   Motherboards
-   RAM
-   SSDs
-   Hard Drives
-   PC Cases
-   Power Supplies (PSUs)
-   CPU Coolers
-   Case Fans
-   Monitors
-   Keyboards
-   Mice
-   Headsets

The branding should look like a believable online computer retailer
rather than a generic demo shop.

------------------------------------------------------------------------

# Project Goals

I want to build a simple but realistic e-commerce website specifically
so I can create a professional Playwright automation portfolio project
around it.

The purpose of this project is **not** to build the world's best online
shop. The purpose is to demonstrate that I understand software
engineering, quality assurance, automation architecture, risk-based
testing, test strategy, and modern development practices.

Everything should be designed with maintainability, readability and
testability in mind.

The finished project should demonstrate my ability to:

-   Build a modern web application
-   Design software that is easy to automate
-   Write professional Playwright automation
-   Build API and UI tests
-   Apply Page Object Model
-   Apply risk-based testing
-   Produce QA documentation
-   Build CI/CD automation
-   Explain engineering decisions during interviews

This project should be something I can confidently place on my CV and
discuss during technical interviews.

------------------------------------------------------------------------

# Code Quality Expectations

Although this is a portfolio project, **the code should be written to a
senior engineer standard.**

Treat this as though it were being developed for a real company.

Do **not** take shortcuts simply because the application is fictional.

The project should demonstrate professional software engineering
practices.

Please ensure:

-   Clean architecture where appropriate
-   Clear separation of concerns
-   Small, maintainable components
-   Strong TypeScript usage
-   No unnecessary use of `any`
-   Consistent naming conventions
-   Reusable code where appropriate
-   Proper validation
-   Proper error handling
-   Meaningful logging
-   Good folder structure
-   SOLID principles where practical
-   Readable code over clever code
-   Minimal duplication
-   Well-structured API design
-   Good state management
-   Secure authentication suitable for a demo application
-   Protected customer and admin routes
-   Seeded demo data
-   Stable automation selectors (`data-testid`)
-   Comments only where they genuinely add value
-   No "cowboy coding"

Where multiple implementation approaches exist, explain why one was
chosen.

------------------------------------------------------------------------

# Recommended Tech Stack

## Frontend

-   React
-   TypeScript
-   Vite
-   React Router
-   TanStack Query
-   React Hook Form
-   Zod
-   Tailwind CSS or Material UI

## Backend

-   Node.js
-   Express
-   TypeScript
-   SQLite
-   Prisma ORM

## Testing

-   Playwright (UI + API)

## CI

-   GitHub Actions

------------------------------------------------------------------------

# Customer Features

-   Homepage
-   Authentication (Register/Login/Logout)
-   Product catalogue
-   Product search
-   Category filtering
-   Sorting
-   Product details
-   Basket
-   Checkout
-   Customer account
-   Order history

------------------------------------------------------------------------

# Admin CMS

The admin area is a major focus because it provides high-value
automation scenarios.

Features:

-   Secure admin login
-   Protected routes
-   Product CRUD
-   Stock management
-   Price management
-   Category management
-   Product activation/deactivation
-   Order management
-   Order status updates

Validation:

-   Required fields
-   Valid prices
-   Numeric stock
-   No negative stock

------------------------------------------------------------------------

# Error Handling

Include realistic behaviour for:

-   Validation failures
-   404 page
-   API failures
-   Invalid login
-   Empty basket
-   Out-of-stock products
-   Unauthorized access
-   Forbidden admin routes

------------------------------------------------------------------------

# Playwright Requirements

Design the application to be automation-friendly.

Use:

-   `data-testid`
-   Stable selectors
-   Deterministic seed data

Automation should cover:

-   Smoke tests
-   Authentication
-   Product browsing
-   Basket
-   Checkout
-   Customer account
-   Admin CMS
-   API testing
-   Positive and negative scenarios

------------------------------------------------------------------------

# QA Documentation

Produce professional QA artefacts including:

## Risk Assessment

For each feature identify:

-   Business Risk
-   User Impact
-   Likelihood
-   Severity
-   Priority
-   Suggested Mitigation
-   Automated?
-   Manual?
-   Why?

## Automation Coverage Matrix

Include:

-   Feature
-   Scenario
-   Automation Type
-   Priority
-   Risk Covered
-   Automation Status

## Test Strategy

Cover:

-   Smoke testing
-   Regression testing
-   API testing
-   UI testing
-   Integration testing
-   Test data management
-   CI strategy
-   Reporting strategy

## Test Plan

Include:

-   Scope
-   Objectives
-   Risks
-   Dependencies
-   Entry/Exit criteria

## README

Document:

-   Architecture
-   Tech stack
-   Folder structure
-   Running locally
-   Running Playwright
-   CI pipeline
-   Test architecture
-   Risk-based testing approach
-   Future improvements

------------------------------------------------------------------------

# Development Process

Act as a senior software architect and technical lead.

Do **not** generate the entire application at once.

Break the project into small milestones.

For each milestone:

1.  Explain what is being built.
2.  Explain why it comes next.
3.  Implement it to a professional standard.
4.  Ensure the application remains runnable.
5.  Review the implementation before moving on.
6.  Wait for my approval before continuing.

Always prioritise maintainability, readability, scalability and
testability over speed.
