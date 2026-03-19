# TextSummarizer AI - AI Developer Intern Task

A minimal web application that accepts unstructured text and produces a structured summary using Gemini AI.

## 🚀 How to Set Up and Run

1. **Prerequisites**: Ensure you have Node.js installed.
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Configure API Key**:
   - Open the **Settings** (⚙️ gear icon) in AI Studio.
   - Go to **Secrets**.
   - Add a new secret named `GEMINI_API_KEY`.
   - Paste your Gemini API key as the value.
4. **Run the App**:
   ```bash
   npm run dev
   ```
   The application will be available at the provided App URL.

## 🧠 LLM Choice & Prompt Design

### Why Gemini 3 Flash?
I chose **Gemini 3 Flash** (`gemini-3-flash-preview`) for this task because:
- **Speed**: It offers low latency, which is ideal for a real-time summarization tool.
- **Structured Output**: It has excellent support for JSON schema-based responses, ensuring the output always matches the required format.
- **Context Window**: It can handle large blocks of unstructured text without truncation issues.

### Prompt Design
The prompt is designed to be direct and leverage Gemini's JSON response capabilities:
```typescript
{
  text: `Analyze the following text and provide a structured summary.
  
  Text:
  "${text}"`
}
```
I used the `responseSchema` configuration in the `@google/genai` SDK. This is superior to "prompt engineering" alone because it enforces the data structure at the API level, guaranteeing that the model returns a valid JSON object with `oneSentenceSummary`, `keyPoints` (exactly 3), and `sentiment`.

## 🛠️ Trade-offs & Shortcuts

1. **Client-Side Only**: For this assignment, I implemented the logic directly in the frontend. In a production environment, I would move the API calls to a backend proxy to protect the API key and handle rate limiting more robustly.
2. **File Support**: I added support for `.txt`, `.md`, and `.json` files. I skipped complex formats like PDF or DOCX to keep the solution within the 1-2 hour time budget.
3. **Error Handling**: I implemented basic error catching for empty inputs and API failures. More granular error states (like rate limit warnings) could be added with more time.

## 🔮 Future Improvements

- **Batch Processing**: Allow users to upload multiple files and download a CSV/JSON of all summaries.
- **Custom Schemas**: Let users define what fields they want to extract (e.g., "Extract all dates" or "List all mentioned people").
- **Export**: Add a button to copy the structured result to the clipboard or download it as a PDF report.

## 📝 Example Output

**Input Text:**
> "The quarterly earnings report for TechFlow Inc. was released today, showing a 15% increase in revenue compared to last year. Despite global supply chain challenges, the company successfully launched three new products and expanded its market share in Europe. Investors responded positively, with the stock price rising by 4% in after-hours trading. CEO Sarah Jenkins expressed optimism about the upcoming fiscal year, citing a strong pipeline of innovation."

**Structured Result:**
- **Summary**: TechFlow Inc. reported a strong quarterly performance with 15% revenue growth and successful product launches despite supply chain hurdles.
- **Key Points**:
  1. Revenue increased by 15% year-over-year.
  2. Three new products were launched and European market share expanded.
  3. Stock price rose by 4% following the positive earnings report.
- **Sentiment**: Positive
- **Confidence**: 98%
