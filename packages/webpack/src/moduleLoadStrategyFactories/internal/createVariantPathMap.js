const createVariantPathMap = (content) => `const variantPathMap = new Map([
${content}
]);`;

export default createVariantPathMap;
