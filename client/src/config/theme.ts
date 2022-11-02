import { css } from "lit-element";

const fontSizes = {
  S: 12,
  M: 14,
  L: 16,
  XL: 18,
};

const fontWeights = {
  REGULAR: 400,
  MEDIUM: 500,
  SEMI_BOLD: 600,
  BOLD: 700,
};

export const defaultTheme = css`
  :host {
    font-family: Roboto, -apple-system, apple color emoji, BlinkMacSystemFont,
      Segoe UI, Oxygen-Sans, Ubuntu, Cantarell, Helvetica Neue, sans-serif;
  }
`;

const colors = css`
  :host {
    --primary-text: black;
    --secondary-color: #c4c9cc;
    --secondary-text-color: #707579;
    --light-grey-bg: #fafafa;
    --message-text-bg-color: black;
    --message-text-color: white;
    --question-bg-color: #fcc42a;
    --chat-background: white;
  }
`;

export const appTheme = {
  typography: {
    fontSizes,
    fontWeights,
  },

  defaultTheme,
  colors,
};
