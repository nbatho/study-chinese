import { readFile } from 'node:fs/promises';
import { callOpenAiCompatibleJson } from './content-ai-client.js';
import { contentPath } from '../config/content-paths.js';

const reviewPromptPath = contentPath('prompts', 'review-content.txt');

const numberFrom = (value, fallback) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const normalizeReview = (review) => ({
  overall_score: numberFrom(review?.overall_score, 0),
  criteria: {
    naturalness: numberFrom(review?.criteria?.naturalness, 0),
    level_fit: numberFrom(review?.criteria?.level_fit, 0),
    culture: numberFrom(review?.criteria?.culture, 0),
    pedagogy: numberFrom(review?.criteria?.pedagogy, 0),
    translation: numberFrom(review?.criteria?.translation, 0)
  },
  blocking_issues: Array.isArray(review?.blocking_issues) ? review.blocking_issues : [],
  suggested_revisions: Array.isArray(review?.suggested_revisions) ? review.suggested_revisions : []
});

export class ContentReviewer {
  constructor({
    minOverallScore = Number(process.env.AI_REVIEW_MIN_OVERALL || 4),
    minCriterionScore = Number(process.env.AI_REVIEW_MIN_CRITERION || 3)
  } = {}) {
    this.minOverallScore = minOverallScore;
    this.minCriterionScore = minCriterionScore;
  }

  async loadPrompt() {
    return readFile(reviewPromptPath, 'utf8');
  }

  evaluate(review) {
    const normalized = normalizeReview(review);
    const lowCriteria = Object.entries(normalized.criteria)
      .filter(([, score]) => score < this.minCriterionScore)
      .map(([name, score]) => ({ name, score }));
    const ok =
      normalized.overall_score >= this.minOverallScore &&
      lowCriteria.length === 0 &&
      normalized.blocking_issues.length === 0;

    return {
      ok,
      review: normalized,
      thresholds: {
        minOverallScore: this.minOverallScore,
        minCriterionScore: this.minCriterionScore
      },
      lowCriteria
    };
  }

  async reviewLesson(lesson, { validation, targetLevel, topic, skill } = {}) {
    const basePrompt = await this.loadPrompt();
    const prompt = `${basePrompt}

Production review context:
${JSON.stringify(
  {
    target_hsk_level: targetLevel || lesson?.metadata?.hsk_level,
    topic: topic || lesson?.metadata?.topic,
    skill: skill || lesson?.metadata?.primary_skill,
    validation_summary: validation?.summary,
    validation_errors: validation?.errors || [],
    validation_warnings: validation?.warnings || []
  },
  null,
  2
)}

Lesson JSON to review:
${JSON.stringify(lesson, null, 2)}
`;

    const result = await callOpenAiCompatibleJson({
      purpose: 'review',
      systemPrompt: 'Return valid JSON only. You are a strict Mandarin curriculum reviewer.',
      prompt,
      temperature: 0.1
    });
    const evaluation = this.evaluate(result.json);

    return {
      ...evaluation,
      modelName: result.modelName,
      provider: result.provider,
      usage: result.usage
    };
  }
}

export const reviewLesson = async (lesson, options, reviewerOptions) => {
  const reviewer = new ContentReviewer(reviewerOptions);
  return reviewer.reviewLesson(lesson, options);
};
