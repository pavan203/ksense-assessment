const { getAllPatients, submitResults,fetchPatients } = require("./api");
const { analyzePatients } = require("./risk");

async function main() {
  const patients = await getAllPatients();

  console.log(`Fetched ${patients.length} patients`);

  const results = analyzePatients(patients);
  
  console.log("Submitting results");

  await submitResults(results);
}

main();