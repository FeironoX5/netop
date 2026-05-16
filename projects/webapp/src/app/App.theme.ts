export const appTheme = {
  // fonts
  f: {
    main: "'Lato', sans-serif",
    code: "'Iosevka Charon Mono', monospace",
  },
  // colors
  c: {
    accent: '#4557eb',
    text: '#bfbdb6ff',
    bg: '#313337ff',
    border: '#3f4043ff',
    disabled: { text: '#696a6aff', bg: '#1f2127ff' },
    placeholder: { text: '#696a6aff' },
    error: {
      text: '#ef7177ff',
      bg: '#48161bff',
      'bg-hovered': '#66272dff',
    },
    warning: {
      text: '#feb454ff',
      bg: '#572815ff',
      'bg-hovered': '#754221ff',
    },
    success: {
      text: '#aad84cff',
      bg: '#294113ff',
      'bg-hovered': '#405c1cff',
    },
    element: {
      bg: '#1f2127ff',
      hover: '#2d2f34ff',
      active: '#3e4043ff',
      selected: '#3e4043ff',
    },
    l0: { bg: '#0d1016ff' },
    l1: { bg: '#1f2127ff', border: '#1b1e24ff' },
  },
  // sizes
  s: {
    spacing: '8px',
    'spacing-sm': '0.4em',
    'border-radius': '15px',
    get 'border-radius-inner'() {
      return `calc(${appTheme['s']['border-radius']} - ${appTheme['s']['spacing']})`;
    },
    'border-width': '1px',
    'font-size': '1rem',
    'font-size-sm': '0.675rem',
    'sidebar-width': '300px',
  },
  get border() {
    return `${appTheme['s']['border-width']} solid ${appTheme['c']['border']}`;
  },
};
