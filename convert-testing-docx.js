
import fs from 'fs';
import path from 'path';
import MarkdownIt from 'markdown-it';
import htmlToDocx from 'html-to-docx';

const md = new MarkdownIt();

async function convert(inputFile, outputFile) {
    try {
        const markdown = fs.readFileSync(inputFile, 'utf-8');
        const html = md.render(markdown);

        // Professional styling for thesis
        const fullHtml = `
      <!DOCTYPE html>
      <html lang="id">
      <head>
          <meta charset="UTF-8">
          <style>
              @page {
                  margin: 2.54cm;
              }
              body { 
                  font-family: 'Times New Roman', Times, serif; 
                  font-size: 12pt;
                  line-height: 1.5;
                  color: #000;
              }
              h1 { font-size: 16pt; text-align: center; text-transform: uppercase; margin-bottom: 20px; }
              h2 { font-size: 14pt; margin-top: 20px; border-bottom: 1px solid #000; padding-bottom: 5px; }
              h3 { font-size: 12pt; margin-top: 15px; font-weight: bold; }
              table { 
                  border-collapse: collapse; 
                  width: 100%; 
                  margin: 15px 0;
                  page-break-inside: auto;
              }
              th { 
                  background-color: #f2f2f2; 
                  font-weight: bold; 
                  text-align: center;
                  border: 1px solid #000;
                  padding: 8px;
              }
              td { 
                  border: 1px solid #000; 
                  padding: 8px; 
                  vertical-align: top;
                  font-size: 11pt;
              }
              .page-break {
                  page-break-before: always;
              }
              center { text-align: center; }
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

const filesToConvert = [
    { input: 'docs/BLACK_BOX_TESTING.md', output: 'docs/BLACK_BOX_TESTING.docx' },
    { input: 'docs/THESIS_BAB4_HASIL_DAN_PEMBAHASAN.md', output: 'docs/THESIS_BAB4_HASIL_DAN_PEMBAHASAN.docx' },
    { input: 'docs/THESIS_BAB5_KESIMPULAN.md', output: 'docs/THESIS_BAB5_KESIMPULAN.docx' },
    { input: 'docs/TUGAS_AKHIR_FULL.md', output: 'docs/TUGAS_AKHIR_FULL.docx' }
];

for (const { input, output } of filesToConvert) {
    await convert(input, output);
}
