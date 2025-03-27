export const calculateAISearchRelevantScorePrompt  = `
 C (Context): We have web scraping snippets.
    O (Objective): Calculate a single relevance score between 0 and 1 that represents how relevant the web content is to the AI product.
    T (Tools): Semantic similarity, relevance assessment, multi-aspect evaluation.
    A (Action): Return a TypeScript JSON object with a single key "relevanceScore" containing a float between 0 and 1.

    Relevance Aspects to Consider:
    - How much does the company and its product offered related to our AI product?

    Scoring Guidelines:
    - 0.0-0.2: Minimal to no relevance
    - 0.3-0.4: Low relevance with minor overlapping elements
    - 0.5-0.6: Moderate relevance with some clear connections
    - 0.7-0.8: High relevance with significant alignment
    - 0.9-1.0: Extremely high relevance, nearly perfect match

    webSnippets: []

  Do the following carefully and write out your thought process:
  1) Analyze how relevant the web snippets are to AI.
  2) Compare them across multiple relevance aspects.
  3) Calculate a final normalized score.
  4) Output a JSON object with a "relevanceScore" key containing the score you calculated from the previous step.
`
