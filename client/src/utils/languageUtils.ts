import { languages } from 'prismjs';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-swift';
import 'prismjs/components/prism-kotlin';
import 'prismjs/components/prism-scala';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-powershell';
import 'prismjs/components/prism-php';

let customLanguages = new Set<string>();

function isLanguagesRecord(obj: any): obj is Record<string, string> {
    return typeof obj === 'object' && obj !== null;
}

export const getLanguageForPrism = (lang: string): string => {
  if (typeof lang !== 'string') {
    console.warn(`Invalid language type: ${typeof lang}. Expected a string.`);
    return 'plaintext';
  }

  const lowercaseLang = lang.toLowerCase();
  switch (lowercaseLang) {
    case 'html':
    case 'xml':
    case 'svg':
      return 'markup';
    case 'sh':
    case 'shell':
      return 'bash';
    case 'react':
    case 'jsx':
      return 'jsx';
    case 'node.js':
    case 'node':
      return 'javascript';
    case 'c#':
    case 'cs':
    case 'csharp':
      return 'csharp';
    case 'c++':
    case 'cpp':
      return 'cpp';
    default:
        if (isLanguagesRecord(languages) && lowercaseLang in languages) {
            return languages[lowercaseLang];
        }
        return 'plaintext';
  }
};

const defaultLanguages = [
  'Markup', 'CSS', 'JavaScript', 'TypeScript', 'Python', 'Java', 
  'C', 'C++', 'C#', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin', 'Scala', 
  'SQL', 'Bash', 'PowerShell', 'PHP', 'HTML', 'XML', 'SVG'
];

export const getSupportedLanguages = (): string[] => {
    return [...defaultLanguages, ...customLanguages];
};

export const addCustomLanguage = (lang: string): string => {
  const existingLanguage = getSupportedLanguages().find(l => l.toLowerCase() === lang.toLowerCase());
  if (existingLanguage) {
    return existingLanguage;
  }
  customLanguages.add(lang);
  return lang;
};

export const removeCustomLanguage = (lang: string | null): void => {
  if (lang === null) {
    // Remove all custom languages
    customLanguages.clear();
  } else {
    customLanguages.delete(lang);
  }
};

export const getLanguageLabel = (lang: string): string => {
  const existingLanguage = getSupportedLanguages().find(l => l.toLowerCase() === lang.toLowerCase());
  if (existingLanguage) {
    return existingLanguage;
  }
  return lang.charAt(0).toUpperCase() + lang.slice(1).replace(/(\w+)script/i, '$1Script');
};