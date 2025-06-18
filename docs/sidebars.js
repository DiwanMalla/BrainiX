/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  tutorialSidebar: [
    "introduction",
    "index",
    {
      type: "category",
      label: "Architecture",
      items: [
        "architecture/overview",
        "architecture/technology-stack",
        "architecture/database-schema",
        "architecture/api-design",
      ],
    },
    {
      type: "category",
      label: "Components",
      items: [
        "components/ai-features",
        "components/authentication",
        "components/course-management",
        "components/learning-system",
        "components/payment-processing",
      ],
    },
    {
      type: "category",
      label: "Frontend",
      items: ["frontend/component-system"],
    },
  ],

  // But you can create a sidebar manually
  /*
  tutorialSidebar: [
    'intro',
    'hello',
    {
      type: 'category',
      label: 'Tutorial',
      items: ['tutorial-basics/create-a-document'],
    },
  ],
   */
};

export default sidebars;
