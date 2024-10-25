import Prism from 'prismjs';
import 'prismjs/themes/prism.css';

if (typeof window !== 'undefined') {
  window.Prism = window.Prism || {};
  window.Prism.manual = true;
}

interface LanguageConfig {
  aliases: string[];
  loader?: () => any;
  label: string;
}

type LanguageMapping = {
  [key: string]: LanguageConfig;
};

const LANGUAGE_MAPPING: LanguageMapping = {
  // Web Development
  javascript: {
    aliases: ['js', 'node', 'nodejs', 'jsx', 'mjs', 'cjs', 'node.js'],
    loader: () => require('prismjs/components/prism-javascript'),
    label: 'javascript'
  },
  typescript: {
    aliases: ['ts', 'tsx', 'typescript-next', 'typescriptreact'],
    loader: () => require('prismjs/components/prism-typescript'),
    label: 'typescript'
  },
  html: {
    aliases: ['html5', 'htm', 'xhtml'],
    loader: undefined,
    label: 'html'
  },
  css: {
    aliases: ['css3', 'styles', 'stylesheet'],
    loader: undefined,
    label: 'css'
  },
  php: {
    aliases: ['php3', 'php4', 'php5', 'php7', 'php8'],
    loader: () => require('prismjs/components/prism-php'),
    label: 'php'
  },
  webassembly: {
    aliases: ['wasm'],
    loader: () => require('prismjs/components/prism-wasm'),
    label: 'webassembly'
  },

  // System Programming
  c: {
    aliases: ['h'],
    loader: () => require('prismjs/components/prism-c'),
    label: 'c'
  },
  cpp: {
    aliases: ['c++', 'cc', 'cxx', 'hpp', 'h++', 'cplusplus'],
    loader: () => require('prismjs/components/prism-cpp'),
    label: 'c++'
  },
  csharp: {
    aliases: ['cs', 'c#', 'dotnet', 'net'],
    loader: () => require('prismjs/components/prism-csharp'),
    label: 'c#'
  },
  rust: {
    aliases: ['rs', 'rust-lang', 'rustlang'],
    loader: () => require('prismjs/components/prism-rust'),
    label: 'rust'
  },
  go: {
    aliases: ['golang', 'go-lang'],
    loader: () => require('prismjs/components/prism-go'),
    label: 'go'
  },

  // JVM Languages
  java: {
    aliases: ['jsp'],
    loader: () => require('prismjs/components/prism-java'),
    label: 'java'
  },
  kotlin: {
    aliases: ['kt', 'kts'],
    loader: () => require('prismjs/components/prism-kotlin'),
    label: 'kotlin'
  },
  scala: {
    aliases: ['sc'],
    loader: () => require('prismjs/components/prism-scala'),
    label: 'scala'
  },
  groovy: {
    aliases: ['gvy', 'gy', 'gsh'],
    loader: () => require('prismjs/components/prism-groovy'),
    label: 'groovy'
  },

  // Scripting Languages
  python: {
    aliases: ['py', 'py3', 'pyc', 'pyd', 'pyo', 'pyw', 'pyz'],
    loader: () => require('prismjs/components/prism-python'),
    label: 'python'
  },
  ruby: {
    aliases: ['rb', 'rbw', 'rake', 'gemspec', 'podspec', 'thor', 'irb'],
    loader: () => require('prismjs/components/prism-ruby'),
    label: 'ruby'
  },
  perl: {
    aliases: ['pl', 'pm', 'pod', 't', 'prl'],
    loader: () => require('prismjs/components/prism-perl'),
    label: 'perl'
  },
  lua: {
    aliases: ['lua'],
    loader: () => require('prismjs/components/prism-lua'),
    label: 'lua'
  },

  // Shell Scripting
  bash: {
    aliases: ['sh', 'shell', 'zsh', 'ksh', 'csh', 'tcsh', 'shellscript'],
    loader: () => require('prismjs/components/prism-bash'),
    label: 'bash'
  },
  powershell: {
    aliases: ['ps', 'ps1', 'psd1', 'psm1', 'pwsh'],
    loader: () => require('prismjs/components/prism-powershell'),
    label: 'powershell'
  },
  batch: {
    aliases: ['bat', 'cmd', 'command'],
    loader: () => require('prismjs/components/prism-batch'),
    label: 'batch'
  },

  // Database
  sql: {
    aliases: ['mysql', 'postgresql', 'psql', 'pgsql', 'plsql', 'tsql', 'mssql', 'sqlite'],
    loader: () => require('prismjs/components/prism-sql'),
    label: 'sql'
  },
  mongodb: {
    aliases: ['mongo'],
    loader: () => require('prismjs/components/prism-mongodb'),
    label: 'mongodb'
  },

  // Markup & Config
  markdown: {
    aliases: ['md', 'mkd', 'mkdown', 'mdwn', 'mdown'],
    loader: () => require('prismjs/components/prism-markdown'),
    label: 'markdown'
  },
  yaml: {
    aliases: ['yml', 'yaml-frontmatter'],
    loader: () => require('prismjs/components/prism-yaml'),
    label: 'yaml'
  },
  json: {
    aliases: ['json5', 'jsonc', 'jsonl', 'geojson'],
    loader: () => require('prismjs/components/prism-json'),
    label: 'json'
  },
  xml: {
    aliases: ['rss', 'atom', 'xhtml', 'xsl', 'plist', 'svg'],
    loader: undefined,
    label: 'xml'
  },

  // Other
  latex: {
    aliases: ['tex', 'context', 'ltx'],
    loader: () => require('prismjs/components/prism-latex'),
    label: 'latex'
  },
  graphql: {
    aliases: ['gql'],
    loader: () => require('prismjs/components/prism-graphql'),
    label: 'graphql'
  },
  solidity: {
    aliases: ['sol'],
    loader: () => require('prismjs/components/prism-solidity'),
    label: 'solidity'
  },
  plaintext: {
    aliases: ['text', 'txt', 'plain'],
    loader: undefined,
    label: 'plain text'
  }
};

const ALIAS_TO_LANGUAGE: { [key: string]: string } = Object.entries(LANGUAGE_MAPPING).reduce((acc, [lang, info]) => {
  acc[lang] = lang;
  info.aliases.forEach(alias => {
    acc[alias] = lang;
  });
  return acc;
}, {} as { [key: string]: string });

const loadedLanguages = new Set<string>(['markup', 'css', 'html']);

const initializeCoreLanguages = () => {
  if (typeof Prism === 'undefined') {
    console.error('Prism is not properly initialized');
    return;
  }

  const coreLanguages = ['javascript', 'typescript', 'python', 'java'];
  
  coreLanguages.forEach(lang => {
    const config = LANGUAGE_MAPPING[lang];
    if (config?.loader) {
      try {
        config.loader();
        loadedLanguages.add(lang);
      } catch (error) {
        console.warn(`Failed to load core language: ${lang}`, error);
      }
    }
  });
};

if (typeof Prism !== 'undefined') {
  initializeCoreLanguages();
} else {
  console.warn('Prism not available during initialization');
}

export const normalizeLanguage = (lang: string): string => {
  if (!lang || typeof lang !== 'string') return 'plaintext';
  const normalized = lang.toLowerCase().trim();
  return ALIAS_TO_LANGUAGE[normalized] || normalized;
};

export interface LanguageInfo {
  language: string;
  aliases: string[];
  label: string;
}

export const getSupportedLanguages = (): LanguageInfo[] => {
  return Object.entries(LANGUAGE_MAPPING).map(([lang, info]) => ({
    language: lang,
    aliases: [...info.aliases],
    label: info.label
  }));
};

export const isLanguageSupported = (lang: string): boolean => {
  const normalized = normalizeLanguage(lang);
  return normalized in LANGUAGE_MAPPING;
};

export const getLanguageLabel = (lang: string): string => {
  const normalized = normalizeLanguage(lang);
  return LANGUAGE_MAPPING[normalized]?.label || lang.toLowerCase();
};

export const getAllLanguageAliases = (): Record<string, string[]> => {
  return Object.entries(LANGUAGE_MAPPING).reduce((acc, [lang, info]) => {
    acc[lang] = [...info.aliases];
    return acc;
  }, {} as Record<string, string[]>);
};

export const loadLanguage = async (lang: string): Promise<boolean> => {
  if (typeof Prism === 'undefined') {
    console.error('Prism is not properly initialized');
    return false;
  }

  const normalized = normalizeLanguage(lang);
  
  if (loadedLanguages.has(normalized)) {
    return true;
  }

  const config = LANGUAGE_MAPPING[normalized];
  if (config?.loader) {
    try {
      await config.loader();
      loadedLanguages.add(normalized);
      return true;
    } catch (error) {
      console.warn(`Failed to load language: ${normalized}`, error);
      return false;
    }
  }

  return false;
};

export const languageMapping = LANGUAGE_MAPPING;