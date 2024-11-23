
const express = require('express');
const bodyparser = require('body-parser')
const multer = require('multer');
const path = require('path')
const doxctopdf = require('docx-pdf')
const qpdf = require('node-qpdf2')

const app = express()

// app.use(express.static('public'))
app.use(express.static('uploads'))
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html")
})


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
})

var upload = multer({ storage: storage });

app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())


app.post("/docxtopdf", upload.single('file'), async (req, res) => {
    const metaData = {
        name : 
    }
    const password = req.body.password;
    console.log(password)
    let ofp = Date.now() + "output.pdf";


    doxctopdf(req.file.path, ofp,async (err, result) => {
        if (err) {
            console.log(err)
        }
        else {
            if (password) {
                const encryptedPDF = "encrypted-" + ofp;

                const pdfConfig = {
                    input: ofp,
                    output: encryptedPDF,
                    password: password,
                };
            }
            await qpdf.encrypt(pdfConfig);
            res.download(ofp, () => { })
        }
    })
})
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});




// const express = require("express");
// const multer = require("multer");
// const fs = require("fs");
// const path = require("path");
// const mammoth = require("mammoth");
// const PDFDocument = require("pdfkit");

// const app = express();
// const port = 3000;

// // Serve static files (for the frontend)
// app.use(express.static("public"));

// // Setup Multer for file uploads
// const upload = multer({ dest: "uploads/" });

// // Endpoint to handle file upload and conversion
// app.post("/convert", upload.single("docxFile"), async (req, res) => {
//   const uploadedFile = req.file;

//   if (!uploadedFile || path.extname(uploadedFile.originalname) !== ".docx") {
//     return res.status(400).send("Please upload a valid .docx file.");
//   }

//   try {
//     // Read the .docx file
//     const docxBuffer = fs.readFileSync(uploadedFile.path);
//     const result = await mammoth.extractRawText({ buffer: docxBuffer });

//     // Create a PDF document
//     const pdfPath = `converted-${Date.now()}.pdf`;
//     const pdfDoc = new PDFDocument();
//     pdfDoc.pipe(fs.createWriteStream(pdfPath));
//     pdfDoc.text(result.value); // Add extracted text to the PDF
//     pdfDoc.end();

//     // Cleanup uploaded .docx file
//     fs.unlinkSync(uploadedFile.path);

//     // Send the PDF file to the client
//     res.download(pdfPath, () => {
//       fs.unlinkSync(pdfPath); // Cleanup the generated PDF file after download
//     });
//   } catch (error) {
//     console.error("Error during conversion:", error);
//     res.status(500).send("An error occurred during file conversion.");
//   }
// });

// // Start the server
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:3000`);
// });


