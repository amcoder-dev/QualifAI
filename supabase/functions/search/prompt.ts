export const calculateAISearchRelevantScorePrompt  = `
 C (Context): We have web scraping snippets and an AI product description.
    O (Objective): Calculate a single relevance score between 0 and 1 that represents how relevant the web content is to the AI product.
    S (Steps): 1) Analyze both inputs separately. 2) Compare them across multiple relevance aspects. 3) Calculate a final normalized score.
    T (Tools): Semantic similarity, relevance assessment, multi-aspect evaluation.
    A (Action): Return a TypeScript JSON object with a single key "relevanceScore" containing a float between 0 and 1.
    R (Review): Ensure no explanation or formatting beyond the JSON object.
  
    Relevance Aspects to Consider:
    - How much does the company and its product offered related to our AI product?

    Scoring Guidelines:
    - 0.0-0.2: Minimal to no relevance
    - 0.3-0.4: Low relevance with minor overlapping elements
    - 0.5-0.6: Moderate relevance with some clear connections
    - 0.7-0.8: High relevance with significant alignment
    - 0.9-1.0: Extremely high relevance, nearly perfect match

  
    Few-Shot Examples:
  
    1) Example Input:
    {
      "webSnippets": [
        "Cloud-based machine learning solutions for enterprise data management",
        "Automatic data cleansing and preprocessing with 99.7% accuracy",
        "Compatible with SQL, NoSQL, and proprietary database systems"
      ],
      "productDescription": "DataSense AI is an enterprise-grade machine learning platform for automated data preprocessing and cleansing. Designed for seamless integration with all major database systems, it achieves industry-leading 99.8% accuracy while reducing processing time by 75%."
    }
    Example Output:
    {
      "relevanceScore": 0.89
    }
  
    2) Example Input:
    {
      "webSnippets": [
        "Top 10 project management tools for remote teams",
        "Comparison of asynchronous communication platforms",
        "How to improve team collaboration across time zones"
      ],
      "productDescription": "CodeAssist is an AI pair programming tool that writes, explains, and refactors code in real-time. Supporting 25+ programming languages, it integrates with popular IDEs to boost developer productivity by up to 40%."
    }
    Example Output:
    {
      "relevanceScore": 0.21
    }

    productDescription: "DataSense AI is an enterprise-grade machine learning platform for automated data preprocessing and cleansing. Designed for seamless integration with all major database systems, it achieves industry-leading 99.8% accuracy while reducing processing time by 75%."

    Please return only the JSON object with a "relevanceScore" key containing a float between 0 and 1.
`
