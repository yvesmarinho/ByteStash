export const linkifyOptions = {
  defaultProtocol: 'https',
  target: '_blank',
  rel: 'noopener noreferrer',
  className: 'text-blue-400 hover:text-blue-300 transition-colors duration-200 underline decoration-blue-400/50 hover:decoration-blue-300 cursor-pointer',
  validate: {
    url: (_: any) => true
  }
};