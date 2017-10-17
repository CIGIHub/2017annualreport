export const mapTimestampToZeroToOne = (timestamp, start = 1470009600000, end = 1501459200000) => (timestamp - start) / (end - start);

export const sinFuncWithAmplitudeWaveNumberAndYOffset = (amplitude, waveNumber, yOffset) => x => Math.sin(x * waveNumber) * -1 * amplitude + yOffset;

export function calculateLinePositions(lineTemplates) {
  const lineTemplateLength = lineTemplates.length;
  const timestamps = new Array(lineTemplateLength);

  let i = lineTemplateLength;
  while (i-- > 0) {
    const lineTemplate = lineTemplates[i];
    timestamps[i] = new Date(lineTemplate.year, lineTemplate.month).valueOf();
  }
  i = lineTemplateLength - 1;
  const start = timestamps[0];
  const diff = timestamps[lineTemplateLength - 1] - start;
  lineTemplates[0].position = 0;
  lineTemplates[lineTemplateLength - 1].position = 1;

  while (i-- > 1) {
    lineTemplates[i].position = (timestamps[i] - start) / diff;
  }
  return lineTemplates;
}