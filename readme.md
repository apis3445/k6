# K6 Performance Testing

This repository contains k6 performance tests for load testing, stress testing, and other performance scenarios.

## Prerequisites

- Node.js (v14 or higher)
- k6 installed locally

## Installation

### Install k6

**macOS (using Homebrew):**

```bash
brew install k6
```

**Windows (using Chocolatey):**

```bash
choco install k6
```

### Install Project Dependencies

```bash
npm install
```

## Running Tests Locally

### Basic Test Execution

Run any test file directly with k6:

```bash
# Run a specific test
k6 run load.test.ts
k6 run stress.test.ts
k6 run spike.test.ts
k6 run soak.testing.ts
```

### Available Test Types

- **Load Testing**: `k6 run load.test.ts` - Tests normal expected load
- **Stress Testing**: `k6 run stress.test.ts` - Tests beyond normal capacity
- **Spike Testing**: `k6 run spike.test.ts` - Tests sudden load increases
- **Soak Testing**: `k6 run soak.testing.ts` - Tests extended periods
- **Threshold Testing**: `k6 run threshold.test.ts` - Tests with performance thresholds
- **Browser Testing**: `k6 run svelte-browser.test.ts` - Browser-based testing
- **Group Testing**: `k6 run group.ts` - Organized test scenarios
- **Tags Testing**: `k6 run tags.test.ts` - Tagged test scenarios

### Running with Options

```bash
# Run with custom virtual users and duration
k6 run --vus 10 --duration 30s load.test.ts

# Run with specific stages
k6 run --stage 5s:10,10s:20,5s:0 stress.test.ts

# Generate HTML report
k6 run --out html=report.html load.test.ts

# Generate JSON summary
k6 run --summary-export=summary.json load.test.ts
```

### TypeScript Support

Since the tests are written in TypeScript, k6 will automatically handle the compilation. Make sure you have the TypeScript configuration file (`.tsconfig`) in place.

## Run in k6 Cloud

### Login to k6 Cloud (first time only)

```bash
k6 cloud login --token $token
```

### Run test in cloud

```bash
k6 cloud threshold.test.ts
```

## Project Structure

- `*.test.ts` - Individual test files for different testing scenarios
- `group.ts` - Grouped test scenarios
- `package.json` - Project dependencies and scripts
- `report.html` - Generated HTML test reports
- `summary.json` - Generated JSON test summaries

## Development

To create new tests, follow the existing patterns in the test files and refer to the [k6 documentation](https://k6.io/docs/) for available APIs and best practices.
