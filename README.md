# Branch Management Strategy

This document outlines the branching strategy used in the FinancIA project, providing guidelines for developers on how to work with different branches.

## 1. Main Branches

### 1.1 Main

- Always contains the production-ready state of the application
- Each commit to main triggers the production deployment pipeline
- Changes are only integrated through hotfixes or release branch merges

### 1.2 Develop

- Reflects the staging/continuous integration state
- All completed and reviewed features converge here
- Automatic deployment to the development (dev) environment after each push

## 2. Supporting Branches

### 2.1 Feature Branches

- Format: `feature/<ticket>`
- Created from develop for each new feature, improvement, or task (e.g., feature/onboarding-ml)
- Named with ticket identifier or brief description
- Merged back into develop when complete, after code review and approval

### 2.2 Release Branches

- Format: `release/<version>`
- Created from develop when a stable point is reached and a new version is prepared (e.g., release/v1.2.0)
- Used for final testing, minor bug fixes, and configuration adjustments (environment variables, infrastructure scripts)
- Once ready, merged into both main (for production deployment) and develop (to incorporate any changes made during release)

### 2.3 Hotfix Branches

- Format: `hotfix/<version>` or `hotfix/<issue>`
- Created from main to address critical production issues
- Changes are merged into both main and develop once complete
- Triggers immediate deployment to production when merged to main

## 3. Branch Workflow

```
main    ──────────────────────────────────────────────────────
          │                                               ↑
          │                                               │
          │                                         (Release or Hotfix)
          │                                               │
          ↓                                               │
develop  ────────────────────────────────────────────────────────
          │             ↑            │            ↑
          │             │            │            │
          ↓             │            ↓            │
feature/one ───────────             feature/two ──────
```

## 4. Guidelines

- Always create a pull request for merging changes
- Require at least one code review approval before merging
- Keep feature branches short-lived (1-2 weeks maximum)
- Regularly sync develop into feature branches to minimize merge conflicts
- Use semantic versioning for release branches (MAJOR.MINOR.PATCH)
- Write descriptive commit messages following the project's commit message format

## 5. Special Cases

### 5.1 Mobile Branch

The `Mobile` branch is a special branch containing the React Native mobile application code. When working on mobile features:

1. Always branch from the Mobile branch for mobile-specific features
2. Follow the same feature branch naming convention: `feature/mobile-<description>`
3. Create pull requests targeting the Mobile branch, not develop

### 5.2 Long-Running Experimental Branches

For experimental features or significant architectural changes that may take longer to complete:

1. Use the format `experimental/<description>`
2. Regularly merge develop into these branches to stay up-to-date
3. Consider creating checkpoints by tagging important milestones

## 6. Project Context and Architecture

### 6.1 Project Overview

FinancIA is an AI-driven mobile application designed to address the financial management challenges facing Mexican adults. According to ENIF 2021, 68% of banked adults aged 18–55 in Mexico struggle with personal finance management, leading to over-indebtedness, low savings rates, and limited investment capacity.

The application aims to improve financial health through:

- Personalized onboarding quiz prior to account creation
- AI-generated "pre-proposal" for budgeting and saving strategies
- Automated tools for budget monitoring and financial recommendations

### 6.2 Development Phases and Branch Usage

| Phase           | Primary Branches                 | Focus Areas                                  |
| --------------- | -------------------------------- | -------------------------------------------- |
| MVP Development | `Mobile`, `feature/onboarding-*` | Onboarding flow, Core UI, Basic analytics    |
| Integration     | `develop`, `feature/aws-*`       | AWS services integration, API connections    |
| Beta Release    | `release/v0.9.0`                 | Testing, Bug fixes, Performance optimization |
| Production      | `main`                           | Stability, Security, Scalability             |

### 6.3 Component Integration Strategy

The application follows a modular architecture with the following key components:

1. **Mobile Frontend (React Native)**

   - Managed in the `Mobile` branch
   - Feature branches should follow UI/UX guidelines in the design system

2. **Authentication & API Layer**

   - AWS Cognito and API Gateway integration
   - Branch naming: `feature/auth-*` for authentication features

3. **Business Logic (Lambda Functions)**

   - Microservices following serverless architecture
   - Branch naming: `feature/lambda-*` for specific function development

4. **Data Persistence (DynamoDB)**

   - Schema changes require careful branch management
   - Data migrations should be reviewed in dedicated PRs

5. **Machine Learning Pipeline**
   - SageMaker model deployment and updates
   - Branch naming: `feature/ml-*` for model improvements

### 6.4 Branching Considerations for MVP Targets

With Year 1 targets of 50,000 active users and projected growth to 2 million users by Year 3, branching strategy should prioritize:

1. **Scalability Testing**

   - Create dedicated `feature/scale-test-*` branches for load testing
   - Merge results and optimizations back to `develop` regularly

2. **Feature Prioritization**

   - Core financial features should be prioritized in the branching workflow
   - Features targeting the 30% decrease in overspending should be developed first

3. **Technical Debt Management**
   - Create periodic `tech-debt/*` branches for codebase improvements
   - Schedule regular technical debt sprints between major feature releases

### 6.5 AWS Infrastructure Integration

When developing branches that interact with AWS services:

1. Each developer should work with isolated AWS resources for testing
2. Integration tests against shared AWS resources should only occur in `develop`
3. Infrastructure as Code (IaC) changes should follow the same branching pattern
4. Secure credentials must never be committed to any branch
