const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = require('docx');

const references = [
    {
        authors: "Dubey, R., et al.",
        year: 2025,
        title: "Artificial Intelligence and English Language Learning: Exploring the Roles of AI-Driven Tools in Personalizing Learning and Providing Instant Feedback",
        journal: "International Journal of Modern Education",
        link: "https://www.researchgate.net/publication/381519244"
    },
    {
        authors: "Lo, C. K.",
        year: 2023,
        title: "What is the impact of ChatGPT on education? A rapid review of the literature",
        journal: "Education Sciences",
        volume: "13",
        issue: "4",
        pages: "410",
        link: "https://doi.org/10.3390/educsci13040410"
    },
    {
        authors: "Jeon, J.",
        year: 2024,
        title: "Exploring AI chatbot affordances in the EFL classroom: Young learners’ experiences and perspectives",
        journal: "Computer Assisted Language Learning",
        volume: "37",
        issue: "1-2",
        pages: "1-28",
        link: "https://doi.org/10.1080/09588221.2021.2021241"
    },
    {
        authors: "Widyana, R., et al.",
        year: 2022,
        title: "The Application of Text-to-Speech Technology in Language Learning",
        journal: "Proceedings of the 6th International Conference on Language, Literature, Culture, and Education",
        link: "https://doi.org/10.2991/978-2-494069-91-6_14"
    },
    {
        authors: "Nurkholis, A., Bimantara, R., & Neneng.",
        year: 2022,
        title: "Interactive English E-Learning Based on Cloud Speech-to-Text API",
        journal: "Jurnal Ilmiah Edutic: Pendidikan dan Informatika",
        link: "https://www.researchgate.net/publication/365851493"
    },
    {
        authors: "Lin, V., et al.",
        year: 2023,
        title: "The Impact of Virtual Pedagogical Agents on Learners’ Social Presence and Knowledge Transfer",
        journal: "Computers & Education",
        link: "https://doi.org/10.1016/j.compedu.2023.104823"
    }
];

const doc = new Document({
    sections: [{
        properties: {},
        children: [
            new Paragraph({
                text: "DAFTAR REFERENSI",
                heading: HeadingLevel.HEADING_1,
                alignment: AlignmentType.CENTER,
                spacing: { after: 400 },
            }),
            ...references.flatMap(ref => {
                let refText = `${ref.authors} (${ref.year}). ${ref.title}. `;
                if (ref.journal) refText += `${ref.journal}. `;
                if (ref.volume) refText += `${ref.volume}`;
                if (ref.issue) refText += `(${ref.issue})`;
                if (ref.pages) refText += `, ${ref.pages}. `;

                return [
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: refText,
                            }),
                            new TextRun({
                                text: `Available at: ${ref.link}`,
                                color: "0000FF",
                                underline: {},
                            }),
                        ],
                        spacing: { after: 200 },
                        indent: { left: 720, hanging: 720 }, // Hanging indent for APA
                    })
                ];
            })
        ],
    }],
});

Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync("DAFTAR_REFERENSI.docx", buffer);
    console.log("File DAFTAR_REFERENSI.docx successfully created.");
});
