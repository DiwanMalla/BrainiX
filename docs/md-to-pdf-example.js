const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Configuration for your project
const config = {
  baseUrl: 'http://localhost:3000', // Your documentation server
  outputPath: './documentation.pdf',
  
  // Define your pages and their routes
  pages: [
    { url: '/docs/introduction', title: 'Introduction', author: 'TeamMember1' },
    { url: '/docs/architecture', title: 'Architecture', author: 'TeamMember2' },
    { url: '/docs/api-design', title: 'API Design', author: 'TeamMember3' },
    // Add more pages as needed
  ],
  
  // Team information for cover page
  teamMembers: {
    'Member1': 30,
    'Member2': 25,
    'Member3': 25,
    'Member4': 20
  }
};

// CSS for professional styling
const documentCSS = `
  <style>
    @page {
      margin: 20mm;
      size: A4;
    }
    
    body {
      font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    
    .cover-page {
      width: 100%;
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-align: center;
      page-break-after: always;
    }
    
    .cover-title {
      font-size: 48px;
      font-weight: 900;
      margin-bottom: 20px;
    }
    
    .cover-subtitle {
      font-size: 24px;
      margin-bottom: 40px;
      opacity: 0.9;
    }
    
    .team-info {
      background: rgba(255, 255, 255, 0.1);
      padding: 30px;
      border-radius: 15px;
      backdrop-filter: blur(10px);
    }
    
    .toc-page {
      page-break-before: always;
      page-break-after: always;
    }
    
    .toc-title {
      font-size: 36px;
      font-weight: 700;
      margin-bottom: 30px;
      color: #2d3748;
      border-bottom: 3px solid #667eea;
      padding-bottom: 10px;
    }
    
    .toc-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #e2e8f0;
    }
    
    .toc-item:hover {
      background-color: #f7fafc;
    }
    
    .toc-title-text {
      font-weight: 600;
      color: #2d3748;
    }
    
    .toc-author {
      background: #667eea;
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
    }
    
    .toc-page-number {
      font-weight: 600;
      color: #667eea;
      min-width: 30px;
      text-align: right;
    }
    
    /* Hide navigation elements for PDF */
    nav, .navbar, .sidebar, .pagination-nav, .theme-edit-this-page {
      display: none !important;
    }
    
    /* Code blocks styling */
    .prism-code {
      font-size: 12px;
      line-height: 1.4;
    }
    
    /* Ensure content fits well */
    .container {
      max-width: none !important;
    }
  </style>
`;

// Generate cover page HTML
function generateCoverPage() {
  const teamMembersList = Object.entries(config.teamMembers)
    .map(([name, percentage]) => `<div>${name}: ${percentage}%</div>`)
    .join('');

  return `
    ${documentCSS}
    <div class="cover-page">
      <div class="cover-content">
        <h1 class="cover-title">Project Documentation</h1>
        <p class="cover-subtitle">Technical Documentation</p>
        
        <div class="team-info">
          <h3>Team Members & Contributions</h3>
          ${teamMembersList}
          <div style="margin-top: 20px; font-size: 14px;">
            Capstone Project - ${new Date().getFullYear()}
          </div>
        </div>
      </div>
    </div>
  `;
}

// Generate table of contents
function generateTableOfContents(pageNumbers = null) {
  let tocHTML = `
    ${documentCSS}
    <div class="toc-page">
      <h1 class="toc-title">Table of Contents</h1>
  `;

  config.pages.forEach((page, index) => {
    const pageNum = pageNumbers ? pageNumbers[index] : '--';
    tocHTML += `
      <div class="toc-item">
        <span class="toc-title-text">${page.title}</span>
        <span class="toc-author">${page.author}</span>
        <span class="toc-page-number">${pageNum}</span>
      </div>
    `;
  });

  tocHTML += `</div>`;
  return tocHTML;
}

// Main PDF generation function
async function generatePDF() {
  console.log('🚀 Starting PDF generation...');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });

    // Generate cover page
    console.log('📄 Generating cover page...');
    const coverPageHTML = generateCoverPage();
    await page.setContent(coverPageHTML, { waitUntil: 'networkidle0' });
    const coverPagePDF = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });
    fs.writeFileSync('./cover.pdf', coverPagePDF);

    // Generate table of contents (placeholder)
    console.log('📋 Generating table of contents...');
    const tocHTML = generateTableOfContents();
    await page.setContent(tocHTML, { waitUntil: 'networkidle0' });
    const tocPDF = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' }
    });
    fs.writeFileSync('./toc.pdf', tocPDF);

    // Generate content pages
    console.log('📚 Generating content pages...');
    const contentPDFs = [];
    
    for (let i = 0; i < config.pages.length; i++) {
      const pageConfig = config.pages[i];
      console.log(`  Processing: ${pageConfig.title}`);
      
      try {
        const url = `${config.baseUrl}${pageConfig.url}`;
        await page.goto(url, { 
          waitUntil: 'networkidle0',
          timeout: 30000 
        });

        // Add CSS to hide navigation and style content
        await page.addStyleTag({ content: documentCSS });

        // Generate PDF for this page
        const contentPDF = await page.pdf({
          format: 'A4',
          printBackground: true,
          margin: { top: '25mm', right: '20mm', bottom: '25mm', left: '20mm' }
        });

        const filename = `./content-${i + 1}-${pageConfig.title.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`;
        fs.writeFileSync(filename, contentPDF);
        contentPDFs.push(filename);
        
        console.log(`  ✅ Generated: ${filename}`);
      } catch (error) {
        console.log(`  ❌ Error generating ${pageConfig.title}: ${error.message}`);
      }
    }

    console.log('✅ Individual PDFs generated successfully!');
    return { coverPagePDF, tocPDF, contentPDFs };

  } catch (error) {
    console.error('❌ Error during PDF generation:', error);
  } finally {
    await browser.close();
  }
}

// Merge PDFs into single document
async function createMergedPDF() {
  try {
    const { PDFDocument } = require('pdf-lib');
    
    console.log('🔄 Merging PDFs...');
    const mergedPdf = await PDFDocument.create();
    
    // Add cover page
    if (fs.existsSync('./cover.pdf')) {
      const coverPdfBytes = fs.readFileSync('./cover.pdf');
      const coverPdf = await PDFDocument.load(coverPdfBytes);
      const coverPages = await mergedPdf.copyPages(coverPdf, coverPdf.getPageIndices());
      coverPages.forEach(page => mergedPdf.addPage(page));
    }
    
    // Add table of contents
    if (fs.existsSync('./toc.pdf')) {
      const tocPdfBytes = fs.readFileSync('./toc.pdf');
      const tocPdf = await PDFDocument.load(tocPdfBytes);
      const tocPages = await mergedPdf.copyPages(tocPdf, tocPdf.getPageIndices());
      tocPages.forEach(page => mergedPdf.addPage(page));
    }
    
    // Add content pages
    for (let i = 0; i < config.pages.length; i++) {
      const filename = `./content-${i + 1}-${config.pages[i].title.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`;
      if (fs.existsSync(filename)) {
        const contentPdfBytes = fs.readFileSync(filename);
        const contentPdf = await PDFDocument.load(contentPdfBytes);
        const contentPages = await mergedPdf.copyPages(contentPdf, contentPdf.getPageIndices());
        contentPages.forEach(page => mergedPdf.addPage(page));
      }
    }
    
    // Save merged PDF
    const pdfBytes = await mergedPdf.save();
    fs.writeFileSync(config.outputPath, pdfBytes);
    
    console.log(`✅ Merged PDF created: ${config.outputPath}`);
    console.log(`📊 Total pages: ${mergedPdf.getPageCount()}`);
    
  } catch (error) {
    console.log('❌ Error creating merged PDF:', error.message);
  }
}

// Main execution
async function main() {
  console.log('🚀 Markdown to PDF Converter');
  console.log('============================\n');
  
  console.log('📋 Configuration:');
  console.log(`Base URL: ${config.baseUrl}`);
  console.log(`Pages to process: ${config.pages.length}`);
  console.log(`Output: ${config.outputPath}\n`);
  
  // Ensure your documentation server is running
  console.log('⚠️  Make sure your documentation server is running on localhost:3000\n');
  
  await generatePDF();
  await createMergedPDF();
  
  console.log('\n🎉 PDF generation completed!');
}

// Export functions for use in other projects
module.exports = {
  generatePDF,
  createMergedPDF,
  config
};

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}
