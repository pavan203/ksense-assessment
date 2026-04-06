function isValidNumber(x) {
  return typeof x === "number" && !isNaN(x);
}

function parseBP(bp) {
  if (!bp || typeof bp !== "string" || !bp.includes("/")) return null;

  const parts = bp.split("/");
  if (parts.length !== 2) return null;

  const [sysStr, diaStr] = parts;

  // catch missing values like "150/" or "/90"
  if (!sysStr || !diaStr) return null;

  const sys = Number(sysStr);
  const dia = Number(diaStr);

  if (isNaN(sys) || isNaN(dia)) return null;

  return { sys, dia };
}

function bpScore(bp) {
  const parsed = parseBP(bp);
  if (!parsed) return 0;

  const { sys, dia } = parsed;

  const sysScore = sys < 120 ? 0 : sys <= 129 ? 1 : sys <= 139 ? 2 : 3;
  const diaScore = dia < 80 ? 0 : dia <= 89 ? 2 : 3;

  return Math.max(sysScore, diaScore);
}

function tempScore(temp) {
  if (!isValidNumber(temp)) return 0;

  if (temp <= 99.5) return 0;
  if (temp >= 99.6 && temp <= 100.9) return 1;
  if (temp >= 101) return 2;

  return 0;
}

function ageScore(age) {
  if (!isValidNumber(age)) return 0;

  if (age <= 65) return 1;
  if (age > 65) return 2;

  return 0;
}

function hasDataIssue(patient) {
  const bpValid = parseBP(patient.blood_pressure);
  const tempValid = isValidNumber(patient.temperature);
  const ageValid = isValidNumber(patient.age);
  return !bpValid || !tempValid || !ageValid;
}

function analyzePatients(patients) {
  const highRisk = [];
  const fever = [];
  const dataIssues = [];

  for (const p of patients) {
    const bp = bpScore(p.blood_pressure);
    const temp = tempScore(p.temperature);
    const age = ageScore(p.age);

    const total = bp + temp + age;

    if (total >= 4) {
      highRisk.push(p.patient_id);
    }

    if (isValidNumber(p.temperature) && p.temperature >= 99.6) {
      fever.push(p.patient_id);
    }

    if (hasDataIssue(p)) {
      dataIssues.push(p.patient_id);
    }
  }

  return {
    high_risk_patients: highRisk,
    fever_patients: fever,
    data_quality_issues: dataIssues
  };
}

module.exports = {
  analyzePatients
};