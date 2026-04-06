# ksense-assessment

ksense-assessment


# Patient Risk Checker 🏥

Hey there! This is a simple Node.js app that helps check patient health risks. It grabs patient info from an API, looks at their blood pressure, temperature, and age, then flags anyone who might need attention.

## What it does ✨

-**Fetches patients**: Pulls in patient data from the Ksense API (handles multiple pages and retries if things go wrong)

-**Checks health stuff**: Looks at blood pressure, temperature, and age to spot risks

-**Categorizes patients**:

- High-risk folks (based on a simple scoring system)
- People with fevers
- Records with missing or weird data

-**Sends results back**: Submits the findings to the API

## Getting started 🚀

1.**Grab the code**:

```bash

   git clone https://github.com/pavan203/ksense-assessment.git

   cd ksense-assessment
```
