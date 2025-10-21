import type { PromptRandQuestion } from "@/types/AssessmentTypes.types";

export function saveScore(questionId: string | number, score: number): void {
  const existingScores = window.localStorage.getItem(`scores_${questionId}`);
  if (existingScores) {
    const scores = JSON.parse(existingScores);
    scores.push(score);
    window.localStorage.setItem(`scores_${questionId}`, JSON.stringify(scores));
  } else {
    window.localStorage.setItem(
      `scores_${questionId}`,
      JSON.stringify([score])
    );
  }
}

/**
 * Overwrites the tasks in localStorage
 * @param data PromptRandQuestion
 */
export function saveTasks(data: PromptRandQuestion[]): void {
  if (data) {
    window.localStorage.setItem("tasks", JSON.stringify(data));
  }
}
