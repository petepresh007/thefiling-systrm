const express = require("express");
const router = express.Router();
const authentication = require("../middleware/authentication");
const { createFile, downloadFile, deleteAllRecord, deleteSingleFile, getALLFile, getSingleFile, updateRecord, getALLFileFortnight, getALLFileMidterm, getALLFileExamination, getALLFileLessonNote, getALLFileLessonPlan, searchFiles, getALLFileMarkGuide, getALLFileFortnightNames } = require("../controllers/file");
const upload = require("../multer")


router.post("/create", upload.single("file"), createFile);
router.get("/download/:filename", downloadFile);
router.get("/allfiles", authentication, getALLFile)
router.get("/files/:fileId", authentication, getSingleFile);
router.delete("/delete", authentication, deleteAllRecord);
router.delete("/delete/:fileId", authentication, deleteSingleFile);
router.patch("/update/:fileId", upload.single("file"),authentication, updateRecord);

router.get("/fortnight", authentication, getALLFileFortnight);
router.get("/midterm", authentication, getALLFileMidterm);
router.get("/examination", authentication, getALLFileExamination);
router.get("/lesson", authentication, getALLFileLessonNote);
router.get("/plan", authentication, getALLFileLessonPlan);
router.get("/markguide", authentication, getALLFileMarkGuide);
router.get("/fornightnews", authentication, getALLFileFortnightNames)
router.get("/search", authentication, searchFiles);

module.exports = router;