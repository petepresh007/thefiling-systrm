const { BadRequestError, NotFoundError } = require("../errors");
const File = require("../model/file");
const fs = require("fs");
const { join } = require("path");
const deleteFiles = require("../middleware/deleteFiles");
const sendEmail = require("../middleware/sendEmail");
const Admin = require("../model/admin");

const createFile = async (req, res) => {
    const expectedFile = req.file
    const { name, subject, test, term, session, Class, date } = req.body;

    if (!name || !subject || !test || !term || !expectedFile || !Class) {
        throw new BadRequestError("Please, make sure you fill all fields...")
    }

    //Check if file exist
    const checkFile = await File.findOne({
        'file.originalname': expectedFile.originalname,
    });
    

    if (checkFile) {
        //check if file is uploaded by you
        if (name === checkFile.name) {
            const path = join(__dirname, "..", "upload", checkFile.file.filename);
            if (fs.existsSync(path)) {
                deleteFiles(path);
            }
            throw new BadRequestError("This file has already been uploaded by you.");
        }


        const path = join(__dirname, "..", "upload", checkFile.file.filename);
        if (fs.existsSync(path)) {
            deleteFiles(path);
        }
        throw new BadRequestError("The file you are attempting to upload already exists, please contact the admin...");
    }

    const newFile = new File({
        name,
        subject,
        test,
        term,
        session,
        file: {
            filename: expectedFile.filename,
            contentType: expectedFile.mimetype,
            originalname: expectedFile.originalname,
            size: expectedFile.size,
            path: expectedFile.path,
        },
        Class,
        date: date ? new Date(date) : new Date(),
    })

    if (newFile) {
        await newFile.save();
        res.status(201).json({ msg: "Your record and file has been saved successfully..." })
    }
}


//DOWNLOAD FILE
const downloadFile = async (req, res) => {
    const { filename } = req.params;

    // Find file information in MongoDB
    const fileRecord = await File.findOne({ 'file.filename': filename });
    

    if (!fileRecord) {
        return res.status(404).send('No record for the file was found');
    }

    // Set response headers
    res.set('Content-Type', fileRecord.file.contentType || 'application/octet-stream');
    res.set('Content-Length', fileRecord.file.size);
    res.set('Content-Disposition', `inline; filename="${fileRecord.file.filename}"`);

    // Read the file content from disk and stream it to the response
    const filePath = join(__dirname, "..", 'upload', fileRecord.file.filename);

    if (!fs.existsSync(filePath)) {
        return res.status(404).send('No file was found');
    }
    const fileStream = fs.createReadStream(filePath);


    fileStream.on('error', (error) => {
        console.error('File Stream Error:', error);
        res.status(500).send('Internal Server Error');
    });

    fileStream.pipe(res);
}


//GET ALL FILES
const getALLFile = async (req, res) => {
    const admin = req.users.id;

    if (admin) {
        const files = await File.find({}).select("-__v");
        if (files) {

            const details = files.map((file) => ({
                _id: file._id,
                name: file.name,
                subject: file.subject,
                test: file.test,
                term: file.term,
                session: file.session,
                file: file.file,
                Class: file.Class,
                date: file.date.toDateString()
            }))
            res.status(200).json(details)
        }
    }
}
//fortnight", "midterm", "examination", "lesson plan", "lesson note

//FORTING
const getALLFileFortnight = async (req, res) => {
    const admin = req.users.id;

    if (admin) {
        const files = await File.find({ test: "fortnight" }).select("-__v");
        if (files) {
            res.status(200).json({ files })
        }
    }
}
//MIDTERM
const getALLFileMidterm = async (req, res) => {
    const admin = req.users.id;

    if (admin) {
        const files = await File.find({ test: "midterm" }).select("-__v");
        if (files) {
            res.status(200).json({ files })
        }
    }
}
//EXAMINATION
const getALLFileExamination = async (req, res) => {
    const admin = req.users.id;

    if (admin) {
        const files = await File.find({ test: "examination" }).select("-__v");
        if (files) {
            res.status(200).json({ files })
        }
    }
}
//LESSON PLAN
const getALLFileLessonPlan = async (req, res) => {
    const admin = req.users.id;

    if (admin) {
        const files = await File.find({ test: "lesson plan" }).select("-__v");
        if (files) {
            res.status(200).json({ files })
        }
    }
}
//LESON NOTE
const getALLFileLessonNote = async (req, res) => {
    const admin = req.users.id;

    if (admin) {
        const files = await File.find({ test: "lesson note" }).select("-__v");
        if (files) {
            res.status(200).json({ files })
        }
    }
}

//Mark guide
const getALLFileMarkGuide = async (req, res) => {
    const admin = req.users.id;

    if (admin) {
        const files = await File.find({ test: "mark guide" }).select("-__v");
        if (files) {
            res.status(200).json({ files })
        }
    }
}

//GET SINGLE FILE
const getSingleFile = async (req, res) => {
    const { fileId } = req.params;
    const admin = req.users.id;

    if (admin) {
        const files = await File.findOne({ _id, fileId }).select("-__v");
        if (files) {
            res.status(200).json({ files })
        }
    }
}

//DELETE SINGLE FILE
const deleteSingleFile = async (req, res) => {
    const { fileId } = req.params;
    const admin = req.users.id;
    const filesToDelete = await File.findById(fileId);
    const admins = await Admin.find({});

    if (!filesToDelete) {
        throw new NotFoundError(`No file with id: ${fileId}`)
    }

    const adminEmail = admins.map((admin) => {
        const { email } = admin;
        return email;
    })

    if (admin) {
        const deleteFiless = await File.findByIdAndDelete(fileId, { originalname: false, new: true });
        if (deleteFiless) {
            const path = join(__dirname, "..", "upload", filesToDelete.file.filename);
            if (fs.existsSync(path)) {
                deleteFiles(path);
            }

            //sent_from, send_to, subject, message
            const sent_from = process.env.SMTP_MAIL;
            const sent_to = [adminEmail];
            const subject = `<p> Deleted Record</p>`
            const message = `
            <p>${admin.username} deleted ${filesToDelete.name}'s record</p>
            `
            await sendEmail(sent_from, sent_to.join(', '), subject, message);
            res.status(200).json({ deleteFiless })
        }
    }
}
//CLEAR DB
const deleteAllRecord = async (req, res) => {
    const admin = req.users.id;

    if (admin) {
        const deleteFiles = await File.deleteMany({})
        if (deleteFiles) {
            res.status(200).json({ deleteFiles })
        }
    }

}

//UPDATE FILE
const updateRecord = async (req, res) => {
    const admin = req.users.id;
    const { fileId } = req.params;
    const { name, subject, test, term, session, Class } = req.body;

    const expectedFile = req.file;
    const getFiles = await File.findById(fileId);

    if (!getFiles) {
        throw new NotFoundError(`No record was found with id: ${fileId}`)
    }

    if (admin) {
        if (expectedFile) {
            const path = join(__dirname, "..", "upload", getFiles.file.filename)
            if (fs.existsSync(path)) {
                deleteFiles(path)
            }
        }

        const updateRecord = await File.findByIdAndUpdate(fileId, {
            name: name ? name : getFiles.name,
            subject: subject ? subject : getFiles.subject,
            test,
            term,
            session,
            file: expectedFile ? {
                filename: expectedFile.filename,
                contentType: expectedFile.mimetype,
                originalname: expectedFile.originalname,
                size: expectedFile.size,
                path: expectedFile.path,
            } : getFiles.file,
            Class: Class ? Class : getFiles.Class
        }, { new: true })

        if (updateRecord) {
            await updateRecord.save();
            res.status(200).json({ updateRecord })
        }
    }

}


/**SEARCH BY NAME */
async function searchFiles(req, res) {
    const { searchQuery } = req.query;

    // Use a regular expression for a case-insensitive search
    const regex = new RegExp(searchQuery, 'i');

    // Search for files with a name containing the provided search query
    const files = await File.find({ name: regex });

    // if(!files){
    //     throw new NotFoundError(`${regex} Has no record...`)
    // }
    res.status(200).json(files);
}


const getALLFileFortnightNames = async (req, res) => {
    const admin = req.users.id;

    if (admin) {
        const files = await File.find({ test: "fortnight" }).select("-__v");
        if (files) {
            res.status(200).json({ files })
        }
    }
}



module.exports = { createFile, downloadFile, deleteAllRecord, deleteSingleFile, getALLFile, getSingleFile, updateRecord, getALLFileFortnight, getALLFileMidterm, getALLFileExamination, getALLFileLessonNote, getALLFileLessonPlan, searchFiles, getALLFileMarkGuide, getALLFileFortnightNames }