const express = require('express');
const bodyparser = require('body-parser')
const multer = require('multer');
const path = require('path')
const doxctopdf = require('docx-pdf')
// const qpdf = require('node-qpdf2')

const app = express()

// function encryptPDF(inputFilePath, outputFilePath, password) {
//     // Create the qpdf command to add password protection
//     const command = `qpdf --encrypt ${password} ${password} 256 -- ${inputFilePath} ${outputFilePath}`;
  
//     // Execute the command
//     exec(command, (error, stdout, stderr) => {
//       if (error) {
//         console.error(`exec error: ${error}`);
//         return;
//       }
//       if (stderr) {
//         console.error(`stderr: ${stderr}`);
//         return;
//       }
//       console.log(`PDF encrypted and saved to ${outputFilePath}`);
//     });
//   }
  
//   // Example usage
//   const inputPDF = path.join(__dirname, 'input.pdf'); // Path to input PDF
//   const outputPDF = path.join(__dirname, 'encrypted_output.pdf'); // Path to save encrypted PDF
//   const password = 'your-password-here'; // Password for encryption
  
//   encryptPDF(inputPDF, outputPDF, password);




// app.use(express.static('public'))
app.use(express.static('public/uploads'))
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html")
})


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
})

var upload = multer({ storage: storage });

app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())


app.post("/docxtopdf", upload.single('file'), (req, res) => {
    
    const password = req.body.password;
    console.log(password)
    let ofp = Date.now() + "output.pdf";


    doxctopdf(req.file.path, ofp,async (err, result) => {
        if (err) {
            console.log(err)
        }
        else {
            // if (password) {
            //     const encryptedPDF = "encrypted-" + ofp;

            //     const pdfConfig = {
            //         input: ofp,
            //         output: encryptedPDF,
            //         password: password,
            //     };
            // }
            // await qpdf.encrypt(pdfConfig);
            res.download(ofp, () => { })
        }
    })
})
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
