/* eslint-disable import/export */

// Allow SCSS to be imported
declare module '*.scss' {
  const content: any;
  export default content;
}

declare module '*.css' {
  const content: any;
  export default content;
}

// Allow JSON to be imported
declare module '*.json' {
  const content: any;
  export default content;
}
