// src/components/DiffChecker/diffUtils.js

export const preprocessText = (text, ignoreWhitespace, ignoreCase) => {
  let processed = text;
  if (ignoreWhitespace) {
    processed = processed.replace(/\s+/g, " ").trim();
  }
  if (ignoreCase) {
    processed = processed.toLowerCase();
  }
  return processed;
};

export const computeDiffLogic = (
  originalText,
  modifiedText,
  ignoreWhitespace,
  ignoreCase
) => {
  const original = preprocessText(
    originalText,
    ignoreWhitespace,
    ignoreCase
  ).split("\n");
  const modified = preprocessText(
    modifiedText,
    ignoreWhitespace,
    ignoreCase
  ).split("\n");

  const matrix = Array(original.length + 1)
    .fill(null)
    .map(() => Array(modified.length + 1).fill(0));

  for (let i = 1; i <= original.length; i++) {
    for (let j = 1; j <= modified.length; j++) {
      if (original[i - 1] === modified[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1] + 1;
      } else {
        matrix[i][j] = Math.max(matrix[i - 1][j], matrix[i][j - 1]);
      }
    }
  }

  const diff = [];
  let i = original.length;
  let j = modified.length;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && original[i - 1] === modified[j - 1]) {
      diff.unshift({
        type: "equal",
        original: original[i - 1],
        modified: modified[j - 1],
        origLine: i,
        modLine: j,
      });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || matrix[i][j - 1] >= matrix[i - 1][j])) {
      diff.unshift({
        type: "added",
        modified: modified[j - 1],
        origLine: i,
        modLine: j,
      });
      j--;
    } else if (i > 0) {
      diff.unshift({
        type: "deleted",
        original: original[i - 1],
        origLine: i,
        modLine: j,
      });
      i--;
    }
  }

  return diff;
};
