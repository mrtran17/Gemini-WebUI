import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css'; // Import the theme
import markedKatexExtension from 'marked-katex-extension';

marked.use(markedKatexExtension({
  throwOnError: false, // Don't throw if KaTeX parsing fails
  errorColor: '#cc0000', // Color for error messages
  delimiters: [
    { left: '$$', right: '$$', display: true }, // Block math
    { left: '$', right: '$', display: false, asciimath: false },   // Inline math, explicitly disable asciimath if it exists
  ],
  // Attempting to ensure raw text within math delimiters - checking documentation for relevant options
  // Based on common patterns, there might not be a direct option here to prevent markdown parsing inside math.
  // The issue might be with marked's core tokenization interacting with the extension.
  // Let's ensure no conflicting marked options are aggressively parsing inline elements.
}));

marked.setOptions({
  highlight: (code, lang) => {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  },
  gfm: true,
  pedantic: false,
  sanitize: false, // Be careful with this, ensure input is trusted or sanitize properly
  smartLists: true,
  smartypants: false,
  // no longer needed as delimiters are defined in the extension use():
  // inlineMath: [{ left: '$', right: '$' }, { left: '\\', right: '\\' }],
  // displayMath: [{ left: '$$', right: '$$' }, { left: '\\[', right: '\\]' }],
});

export { marked };