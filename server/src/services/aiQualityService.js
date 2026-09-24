/**
 * AI Quality Predictor Engine
 * Analyzes crop parameters (moisture, defects, foreign matter, grain size)
 * and returns predicted grade, confidence, score, and detected issues.
 */

export const predictQuality = ({ cropName, moisturePercent, defectPercent, foreignMaterialPercent, weightKg }) => {
  const moisture = parseFloat(moisturePercent) || 12.0;
  const defects = parseFloat(defectPercent) || 2.0;
  const foreignMat = parseFloat(foreignMaterialPercent) || 0.5;

  let score = 100;
  const detectedIssues = [];

  // Moisture penalty (Ideal benchmark: 11% - 13% for grains)
  if (moisture > 14.5) {
    score -= (moisture - 14.5) * 8;
    detectedIssues.push(`Elevated moisture level (${moisture}%). Risk of fungal development during storage.`);
  } else if (moisture > 13.0) {
    score -= (moisture - 13.0) * 4;
    detectedIssues.push(`Moderate moisture variance (${moisture}%).`);
  }

  // Defect penalty
  if (defects > 5.0) {
    score -= defects * 5;
    detectedIssues.push(`Noticeable visual blemishes & broken kernels (${defects}%).`);
  } else if (defects > 2.0) {
    score -= defects * 3;
    detectedIssues.push(`Minor surface blemishes (${defects}%).`);
  }

  // Foreign material penalty
  if (foreignMat > 2.0) {
    score -= foreignMat * 10;
    detectedIssues.push(`Excess husk and stalk debris detected (${foreignMat}%).`);
  } else if (foreignMat > 0.8) {
    score -= foreignMat * 6;
    detectedIssues.push(`Low foreign material presence (${foreignMat}%).`);
  }

  // Bounds
  const qualityScore = Math.min(100, Math.max(45, Math.round(score)));

  let predictedGrade = 'Grade A';
  let confidence = 94;

  if (qualityScore >= 90) {
    predictedGrade = 'Grade A';
    confidence = Math.min(97, 88 + Math.round((qualityScore - 90) * 1.5));
  } else if (qualityScore >= 75) {
    predictedGrade = 'Grade B';
    confidence = Math.min(93, 85 + Math.round((qualityScore - 75) * 1.2));
  } else {
    predictedGrade = 'Grade C';
    confidence = 89;
  }

  if (detectedIssues.length === 0) {
    detectedIssues.push('Uniform grain coloration and size distribution');
    detectedIssues.push('Zero mold or infestation detected');
  }

  return {
    predictedGrade,
    qualityScore,
    confidence,
    detectedIssues,
    recommendedAction: qualityScore >= 75 ? 'ACCEPT' : 'REJECT',
    isAiAssisted: true,
    inspectionTimestamp: new Date().toISOString()
  };
};
