import { languages } from 'prismjs';
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
  const lowercaseLang = lang.toLowerCase();
  switch (lowercaseLang) {
    case 'html':
    case 'xml':
    case 'svg':
      return languages.markup;
    case 'sh':
    case 'shell':
      return languages.bash;
    case 'js':
      return languages.javascript;
    case 'ts':
      return languages.typescript;
    case 'python':
    case 'py':
      return languages.python;
    case 'rb':
      return languages.ruby;
    case 'cs':
      return languages.csharp;
    case 'cpp':
    case 'c++':
      return languages.cpp;
    default:
      return languages[lowercaseLang] || languages.plaintext;
  }
};

export const getSupportedLanguages = () => [
  'Markup', 'CSS', 'C-like', 'JavaScript', 'TypeScript', 'Python', 'Java', 
  'C', 'C++', 'C#', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin', 'Scala', 
  'SQL', 'Bash', 'PowerShell', 'PHP', 'HTML', 'XML', 'SVG'
];

export const getLanguageLabel = (lang) => {
  const capitalizedLang = lang.charAt(0).toUpperCase() + lang.slice(1);
  return capitalizedLang.replace(/(\w+)script/i, '$1Script');
};