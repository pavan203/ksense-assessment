const axios = require("axios");
const API_KEY = "ak_4f5e2e67ffb7a734d8a7e1079575b546a4f4381f76ed46a8";
const BASE_URL = "https://assessment.ksensetech.com/api";
const headers = { "x-api-key": API_KEY };
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchPatients(page = 1, retries = 5) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      console.log(`Fetching page ${page} (attempt ${attempt + 1})`);
      const response = await axios.get(`${BASE_URL}/patients`, {
        headers,
        params: { page, limit: 5 }
      });
      return response.data;

    } catch (error) {
      const status = error.response?.status;
      const isRateLimit = status === 429;
      const isServerError = status >= 500;

      if (attempt < retries && (isRateLimit || isServerError || !status)) {

        const delay = isRateLimit
          ? 5000                        
          : Math.min(1000 * 2 ** attempt, 16000);

        console.log(`Page ${page} failed (${status ?? "network"}). Waiting ${delay}ms...`);
        await sleep(delay);
      } else {
        console.error(`Page ${page} permanently failed after ${attempt + 1} attempts`);
        return null;
      }
    }
  }
}

async function getAllPatients() {
  let allPatients = [];
  let page = 1;
  let totalPages = null;

  while (true) {
    const data = await fetchPatients(page);

    if (!data) {
      console.log(`Skipping page ${page} after retries failed`);
      if (totalPages && page >= totalPages) break;
      page++;
      continue;
    }

    if (data.pagination?.totalPages) {
      totalPages = data.pagination.totalPages;
      console.log(`Total pages: ${totalPages}`);
    }

    const patients = data.data ?? data.patients;

    if (!patients || !Array.isArray(patients)) {
      console.log(`Invalid response on page ${page}:`, data);
      page++;
      continue;
    }

    allPatients.push(...patients);
    console.log(`Page ${page} done. Total so far: ${allPatients.length}`);

    if (totalPages && page >= totalPages) break;

    page++;
    await sleep(1200);
  }

  return allPatients;
}
async function submitResults(results) {
  try {
    const response = await axios.post(
      `${BASE_URL}/submit-assessment`,
      results,
      { headers }
    );

    console.log("Submission successful:");
    console.log(response.data);

  } catch (error) {
    console.error("Submission failed:", error.message);
  }
}

module.exports = {
  getAllPatients,
  submitResults,
  fetchPatients
};