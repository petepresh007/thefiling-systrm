const { BadRequestError } = require("../errors");
const homepage = require("../model/homepage");
const Hompage = require("../model/homepage");

const createImage = async (req, res) => {
    const { description, category } = req.body;
    const expectedFiles = req.files;

    const fileToBeStored = expectedFiles.map((file) => {
        const { filename, originalname } = file;
        return { filename, originalname }
    })

    /**Check for empty submissions */
    if (!description || !category || !expectedFiles) {
        throw new BadRequestError("All fields are required...")
    }

    /**CHECKING IF FILES HAVE BEEN UPLOADED ALREADY */
    const mapped = req.files.map((data) => { data.originalname });
    const checkFiles = await homepage.findOne({ file: mapped });
    if (checkFiles) {
        throw new ConflictError("The file you are attempting to upload has already been uploaded");
    }

    const createdHompage = new Hompage({
        description,
        category,
        file: fileToBeStored
    })

    if (createdHompage) {
        await createdHompage.save()
        res.status(200).json(createdHompage)
    }
}

module.exports = { createImage }