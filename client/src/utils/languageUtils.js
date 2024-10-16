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

export const getLanguageForPrism = (lang) => {
  if (typeof lang !== 'string') {
    console.warn(`Invalid language type: ${typeof lang}. Expected a string.`);
    return 'plaintext';
  }

  const lowercaseLang = lang.toLowerCase();
  switch (lowercaseLang) {
    case 'html':
    case 'xml':
    case 'svg':
      return languages.markup;
    case 'sh':
    case 'shell':
      return languages.bash;
    case 'react':
    case 'jsx':
      return languages.jsx;
    case 'node.js':
    case 'node':
      return languages.javascript;
    case 'c#':
    case 'cs':
    case 'csharp':
      return languages.csharp;
    case 'c++':
    case 'cpp':
      return languages.cpp;
    default:
      return languages[lowercaseLang] || languages.plaintext;
  }
};

export const getSupportedLanguages = () => [
  'Markup', 'CSS', 'JavaScript', 'TypeScript', 'Python', 'Java', 
  'C', 'C++', 'C#', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin', 'Scala', 
  'SQL', 'Bash', 'PowerShell', 'PHP', 'HTML', 'XML', 'SVG'
];

export const getLanguageLabel = (lang) => {
  const capitalizedLang = lang.charAt(0).toUpperCase() + lang.slice(1);
  return capitalizedLang.replace(/(\w+)script/i, '$1Script');
};