import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

// const apiKey = process.env.GEMINI_API_KEY;

// if (!apiKey) {
//   console.error("GEMINI_API_KEY is not set.");
//   // You can even throw an error to stop execution
// }

// console.log("API Key loaded:", apiKey ? "Yes" : "No");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export const aiSummarizedCommit = async (diff: string) => {
  // https://github.com/docker/genai-stack/commit/<commithash>.diff
  const response = await model.generateContent([
    `
    You are an expert programmer, and your job is to summarize a git diff.
    Reminder about the git diff format:
    For every file, there are a few metadata lines, like (for example):
    \'\'\'
    diff --git a/lib/index.js b/lib/index.js
    index 83db48f..f735d3a 100644
    --- a/lib/index.js
    +++ b/lib/index.js
    \'\'\'
    This means that \'lib/index.js\' was modified in this commit. Note that this is only an example.
    Then there is a specifier of the lines that were modified.
    A line starting with \'+\' means it was added.
    A line that starting with \'-\' means that line was deleted.
    A line that starts with neither \'+\' nor \'-\' is code given for context and better understanding.
    It is not part of the diff.
    [...]
    EXAMPLE SUMMARY COMMENTS:
    \'\'\'
    - Raised the amount of returned recordings from \'10\' to \'100\' [packages/server/recordings_api.ts], [packages/server/constants.ts]
    - Fixed a typo in the github action name [.github/workflows/gpt-commit-summarizer.yml]
    - Moved the \'octokit\' initialization to a separate file [src/octokit.ts], [src/index.ts]
    - Added an OpenAI API for completions [packages/utils/apis/openai.ts]
    - Lowered numeric tolerance for test files
    \'\'\'
    Most commits will have less comments than this examples list.
    The last comment does not include the file names, because there were more than two relevant files in the hypothetical commit.
    Do not include parts of the example in your response summary.
    It is given only as an example of appropriate comments.
    `,
    `Please summarize the following git diff: \n\n${diff}\n`,
  ])

  return response.response.text();
}

console.log(await aiSummarizedCommit(`
  diff --git a/src/lib/auth-client.ts b/src/lib/auth-client.ts
index f07a6d6..97720d5 100644
--- a/src/lib/auth-client.ts
+++ b/src/lib/auth-client.ts
@@ -2,7 +2,7 @@ import { polarClient } from "@polar-sh/better-auth"
 import { createAuthClient } from "better-auth/react"
 export const authClient = createAuthClient({
     /** The base URL of the server (optional if you're using the same domain) */
-    // baseURL: "https://aether-talk-snowy.vercel.app",
-    baseURL: "http://localhost:3000",
+    baseURL: "https://aether-talk-snowy.vercel.app",
+    // baseURL: "http://localhost:3000",
     plugins: [polarClient()]
 })
\ No newline at end of file
  `));
