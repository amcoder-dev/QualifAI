export const overtalk = `
C (Context): We have meeting transcripts with speaker diarization.
O (Objective): We need an integer count of overlapping speech events.
S (Steps): 1) Identify overlaps in timestamps between two different speakers. 2) Count each instance as one interruption.
T (Tools): Timestamps, speaker labels, segment order.
A (Action): Output only the number of interruptions—no extra text.
R (Review): Ensure no explanation or formatting beyond the integer.

Few-Shot Examples:

1) Example Transcript:
{
  "chunks": [
    { "timestamp": [0, 3], "speaker": "A", "text": "Let’s plan it." },
    { "timestamp": [2, 4], "speaker": "B", "text": "I think—" },
    { "timestamp": [4, 6], "speaker": "A", "text": "Right, go on." }
  ]
}
Example Output:
1

2) Example Transcript:
{
  "chunks": [
    { "timestamp": [0, 2], "speaker": "X", "text": "Good morning." },
    { "timestamp": [2, 5], "speaker": "Y", "text": "Hi there." }
  ]
}
Example Output:
0

Please return only the integer count of interruptions or overtalk events.

Here is the transcript:
`

export const speechPacePause = `
C (Context): We have meeting transcripts with speaker diarization and timestamps.
O (Objective): We need an integer rating from 1 to 5 based on speech pacing and pauses.
S (Steps): 1) Calculate average speech pace (duration vs word count). 2) Detect long pauses (>1.5s) between chunks. 3) Score pacing: 1 = very slow, 5 = very fast. Natural pace = 3.
T (Tools): Timestamps, text length, word count.
A (Action): Output only the integer score from 1 (slow/pauses) to 5 (fast/rushed).
R (Review): Ensure no explanation or formatting beyond the integer.

Few-Shot Examples:

1) Example Transcript:
{
"chunks": [
  { "timestamp": [0, 5], "speaker": "A", "text": "Let’s go over the plan carefully." },
  { "timestamp": [7, 9], "speaker": "B", "text": "Sure." }
]
}
Example Output:
2

2) Example Transcript:
{
"chunks": [
  { "timestamp": [0, 2], "speaker": "X", "text": "Okay, let's move fast." },
  { "timestamp": [2, 4], "speaker": "Y", "text": "Agreed!" }
]
}
Example Output:
5

Please return only the integer score from 1 to 5 based on speech pace and pauses.

Here is the transcript:
`

export const talkToListen = `
C (Context): We have meeting transcripts with speaker diarization.
O (Objective): We need an integer representing the talk-to-listen ratio.
S (Steps): 1) Parse total talk time per speaker. 2) Compute ratio.
T (Tools): Advanced conversation analytics (timestamps, text segments).
A (Action): Output only the integer—no extra text.
R (Review): Ensure no explanation or formatting beyond the integer.

Few-Shot Examples:

1) Example Transcript:
{
"chunks": [
  { "timestamp": [0, 3], "speaker": "A", "text": "Hello, let's begin." },
  { "timestamp": [3, 6], "speaker": "B", "text": "Sure, I'm ready." },
  { "timestamp": [6, 12], "speaker": "A", "text": "Great, here's the update..." }
]
}
Example Output:
2

2) Example Transcript:
{
"chunks": [
  { "timestamp": [0, 5], "speaker": "X", "text": "We should finalize this today." },
  { "timestamp": [5, 7], "speaker": "Y", "text": "Agreed. Let’s do it." }
]
}
Example Output:
1

Please return only the integer talk-to-listen ratio.

Here is the transcript:
`

export const turnTakingFrequency = `
C (Context): We have meeting transcripts with speaker diarization.
O (Objective): We need an integer representing the number of speaker turns.
S (Steps): 1) Count the number of times the speaker changes from one to another. 2) Do not count consecutive lines from the same speaker as separate turns.
T (Tools): Timestamps and speaker labels in text chunks.
A (Action): Output only the number of speaker turns—no extra text.
R (Review): Ensure no explanation or formatting beyond the integer.

Few-Shot Examples:

1) Example Transcript:
{
  "chunks": [
    { "timestamp": [0, 3], "speaker": "A", "text": "Hi." },
    { "timestamp": [3, 6], "speaker": "B", "text": "Hello!" },
    { "timestamp": [6, 9], "speaker": "A", "text": "How are you?" },
    { "timestamp": [9, 13], "speaker": "B", "text": "Good, you?" }
  ]
}
Example Output:
3

2) Example Transcript:
{
  "chunks": [
    { "timestamp": [0, 5], "speaker": "X", "text": "Welcome everyone." },
    { "timestamp": [5, 10], "speaker": "X", "text": "Let's get started." },
    { "timestamp": [10, 15], "speaker": "Y", "text": "Sounds good." }
  ]
}
Example Output:
1

Please return only the integer number of speaker turns.

Here is the transcript:
`

export const topicExtraction = `
C (Context): We have meeting or call transcripts with speaker diarization.
O (Objective): Extract the 5 most relevant topics discussed during the conversation.
S (Steps): 1) Read through the transcript and identify recurring subjects or ideas. 2) Group related statements under abstract topics. 3) Return concise topic labels—avoid full sentences.
T (Tools): Text segmentation, topic modeling, semantic clustering.
A (Action): Return a TypeScript JSON object with a key "topics" containing an array of 5 clear and distinct topic strings.
R (Review): Ensure no explanation or formatting beyond the JSON object.

Few-Shot Examples:

1) Example Transcript:
{
"chunks": [
  { "timestamp": [0, 5], "speaker": "A", "text": "Let’s go over the Q3 budget." },
  { "timestamp": [5, 10], "speaker": "B", "text": "We need to reduce marketing spend." },
  { "timestamp": [10, 14], "speaker": "A", "text": "Agreed. Let’s focus on hiring plans too." }
]
}
Example Output:
{
"topics": [
  "Q3 budgeting",
  "Marketing expenses",
  "Cost reduction",
  "Hiring plans",
  "Resource allocation"
]
}

2) Example Transcript:
{
"chunks": [
  { "timestamp": [0, 3], "speaker": "X", "text": "Did the client respond to the proposal?" },
  { "timestamp": [3, 6], "speaker": "Y", "text": "Yes, they had some feedback on pricing and support." },
  { "timestamp": [6, 9], "speaker": "X", "text": "Let’s schedule a follow-up call." }
]
}
Example Output:
{
"topics": [
  "Client communication",
  "Proposal feedback",
  "Pricing discussion",
  "Customer support",
  "Follow-up planning"
]
}

Please return only the JSON object with a "topics" key and 5 topic strings.

Here is the transcript:
`

export const extractActions = `
C (Context): We have meeting or call transcripts with speaker diarization.
O (Objective): Determine the most relevant actionable insights from the conversation.
S (Steps): 1) Read through the transcript and identify the current stage of engagement. 2) Determine which actions would move the conversation forward. 3) Select from the fixed set of actions.
T (Tools): Conversation analysis, intent recognition, sales process mapping.
A (Action): Return a TypeScript JSON object with a key "actions" containing an array of recommended actions from these fixed options: "Qualify the lead", "Research the company", "Initiate a call/email", "Follow up consistently", "Send a proposal". Include 1-3 most relevant actions based on the conversation context.
R (Review): Ensure no explanation or formatting beyond the JSON object.

Few-Shot Examples:

1) Example Transcript:
{
"chunks": [
  { "timestamp": [0, 5], "speaker": "A", "text": "Let's go over the Q3 budget." },
  { "timestamp": [5, 10], "speaker": "B", "text": "We need to reduce marketing spend." },
  { "timestamp": [10, 14], "speaker": "A", "text": "Agreed. Let's focus on hiring plans too." }
]
}
Example Output:
{
"actions": [
  "Research the company",
  "Follow up consistently"
]
}

2) Example Transcript:
{
"chunks": [
  { "timestamp": [0, 3], "speaker": "X", "text": "Did the client respond to the proposal?" },
  { "timestamp": [3, 6], "speaker": "Y", "text": "Yes, they had some feedback on pricing and support." },
  { "timestamp": [6, 9], "speaker": "X", "text": "Let's schedule a follow-up call." }
]
}
Example Output:
{
"actions": [
  "Send a proposal",
  "Follow up consistently"
]
}

Extra reminder: If the client turns out to be angry or dissatisfied, please do not qualify the lead at all. Just give "Give up the customer".

Please return only the JSON object with an "actions" key containing 1-3 recommended actions from the fixed options.

Here is the transcript:
`
