
import fs from 'fs';
import path from 'path';
import MarkdownIt from 'markdown-it';
import htmlToDocx from 'html-to-docx';

const md = new MarkdownIt();

async function convert(inputFile, outputFile) {
    try {
        const markdown = fs.readFileSync(inputFile, 'utf-8');
        const html = md.render(markdown);

        // Add some basic styling for the Word document
        const fullHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <title>Thesis</title>
          <style>
              body { font-family: 'Times New Roman', serif; }
              h1 { color: #000; text-align: center; }
              h2 { color: #000; margin-top: 20px; }
              h3 { color: #000; }
              table { border-collapse: collapse; width: 100%; margin: 10px 0; }
              th, td { border: 1px solid #000; padding: 8px; text-align: left; }
              blockquote { margin: 10px 0; padding: 10px; background: #f9f9f9; border-left: 5px solid #ccc; }
          </style>
      </head>
      <body>
          ${html}
      </body>
      </html>
    `;

        const docxBuffer = await htmlToDocx(fullHtml, null, {
            table: { row: { cantSplit: true } },
            footer: true,
            pageNumber: true,
        });

        fs.writeFileSync(outputFile, docxBuffer);
        console.log(`Successfully converted ${inputFile} to ${outputFile}`);
    } catch (error) {
        console.error(`Error converting ${inputFile}:`, error);
    }
}

const docsDir = 'docs';
const files = ['THESIS_BAB3_METODOLOGI.md', 'THESIS_BAB4_IMPLEMENTASI.md'];

for (const file of files) {
    const input = path.join(docsDir, file);
    const output = path.join(docsDir, file.replace('.md', '.docx'));
    await convert(input, output);
}
