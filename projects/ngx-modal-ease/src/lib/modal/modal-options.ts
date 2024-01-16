export interface Options {
  modal?: {
    enter?: string;
    leave?: string;
    top?: string;
    left?: string;
  };
  overlay?: {
    enter?: string;
    leave?: string;
    backgroundColor?: string;
  };
  size?: {
    minHeight?: string;
    width?: string;
    maxWidth?: string;
    height?: string;
    maxHeight?: string;
    padding?: string;
  };
  data?: {
    [key: string]: unknown;
  };
}
