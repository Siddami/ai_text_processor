# AI-Powered Text Processing Interface

An AI-powered text processing interface built with **Next.js (TypeScript)**, **Tailwind CSS**, and **shadcn/ui** components. This application leverages **Chrome's AI APIs** to provide language detection, text summarization, and translation features in a responsive chat-like interface.

##  Features

- **Text Input & Display**: Chat-like interface with a textarea for user input and dynamic output.
- **Language Detection**: Automatically detect the language of the input text.
- **Summarization**: Summarize long texts (over 150 characters) using Chrome's Summarizer API.
- **Translation**: Translate texts into supported languages (English, Portuguese, Spanish, Russian, Turkish, French).
- **Responsive UI**: Fully responsive layout optimized for desktop, tablet, and mobile devices.
- **Accessibility**: Keyboard navigable and screen reader-friendly.

##  Requirements

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **Chrome Canary** *(or the latest Chrome version with experimental flags enabled)*

## ⚡ Chrome AI API Setup

To use or test the API functions, ensure you:

1. **Use Chrome Canary** *(preferred)* or the **latest version of Chrome**.
2. **Enable experimental flags** for each API (Language Detector, Summarizer, Translator).
3. **Refer to Chrome's official documentation** for flag details and API-specific configurations.

⚙️ *Optimization Tip*: Enable related flags for improved performance and stability.

##  Installation

1. **Clone the repository:**

```bash
git clone https://github.com/your-username/ai-text-processing.git
cd ai-text-processing
```

2. **Install dependencies:**

```bash
npm install
# or
yarn install
```

3. **Run the development server:**

```bash
npm run dev
# or
yarn dev
```

Visit `https://ai-text-processor-hng-livid.vercel.app/` to view the app.

## 🧑‍💻 Usage

1. Type or paste text into the textarea.
2. Click the **send** icon to process the text.
3. View detected language and access **Summarize** (if applicable) and **Translate** options.
4. Use the dropdown to select a target language and click **Translate**.

##  Tech Stack

- **Framework**: Next.js (TypeScript)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **APIs**: Chrome AI APIs (Language Detection, Summarization, Translation)

## Acceptance Criteria

- Users can input and display text in the output area.
- Language detection occurs automatically upon sending text.
- **Summarize** button appears for texts over 150 characters (English only).
- Users can translate text using the provided languages.
- API errors and empty inputs trigger clear error messages.

## Error Handling

- **API Failures**: Displays user-friendly error messages.
- **Empty/Invalid Inputs**: Prompts users with helpful feedback.

## Documentation

For detailed API usage, flag configurations, and optimization tips, check the [Chrome AI API Documentation](https://developer.chrome.com/docs/ai/built-in).

## Responsive Design

- Optimized for mobile, tablet, and desktop.
- Utilizes a flexible grid and stacked layout for smaller screens.

## Code Quality

- Modular, maintainable TypeScript code.
- Proper comments and structured files.
- Async/await and Promises for API calls and error handling.

---

**Pro Tip**: For the best experience, use **Chrome Canary** and ensure all experimental flags are enabled.

