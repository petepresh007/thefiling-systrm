const Admin = require("../model/admin");
const bcrypt = require("bcrypt");
const { BadRequestError, ConflictError, NotFoundError, NotAuthorizedError } = require("../errors");
const JWT = require("jsonwebtoken");


const registerAdmin = async (req, res) => {
    const { username, email, password } = req.body;

    /**CHECK IF A USER SUBMITS AN EMPTY FORM*/
    if (!username || !email || !password) {
        throw new BadRequestError("All fields are required")
    }

    const admin = await Admin.findOne({ username });

    /**CHECK IF USER EXISTS*/
    if (admin) {
        throw new ConflictError(`username: ${username} already exists, please enter another username`)
    }

    const harshedPassword = await bcrypt.hash(password, 10);
    const createdUserAdmin = new Admin({
        username,
        email,
        password: harshedPassword
    });

    if (createdUserAdmin) {
        await createdUserAdmin.save();
        const token = createdUserAdmin.JWT_TOK()
        return res.status(201).json({
            username: createdUserAdmin.username,
            adminUserID: createdUserAdmin._id,
            token,
        })
    }

}

/**GET ALL SUPER ADMIN */
const getAllAdmin = async (req, res) => {
    const admin = await Admin.find({}).select("username email");
    if (!admin) {
        throw new NotFoundError("No user was found")
    }
    return res.status(200).json({ msg: admin });
}

/**LOGIN SUPER ADMIN */
async function loginAdmin(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new BadRequestError("All fields are required....")
    }
    /**FIND USER */
    const admin = await Admin.findOne({ email });

    if (!admin) {
        throw new NotFoundError(`No user was found with the email ${email}`)
    }
    /**CHECK IF PASSWORD IS VALID */
    const ispasswordOk = await admin.checkPassword(password);

    if (!ispasswordOk) {
        throw new ConflictError("Please enter valid credentials ")
    }

    /**GENERATE TOKEN */
    const token = admin.JWT_TOK();

    /**SEND RESPONSE */
    res.status(200).json({ username: admin.username, token });

}

/**ADMIN STAY LOGGED IN*/
const stayLoggedIn = (req, res) => {
    const authHeaders = req.headers.authorization;

    if (!authHeaders || !authHeaders.startsWith("Bearer")) {
        throw new NotAuthorizedError("Please provide a valid token");
    }
    const token = authHeaders.split(" ")[1];

    try {
        const decode = JWT.verify(token, process.env.JWT_SECRET);
        res.status(200).json(decode);
    } catch (error) {
        throw new NotAuthorizedError("Token not verified...");
    }
}

const editAdmin = async (req, res) => {
    const { id } = req.params;
    const { username, email } = req.body;

    const editUser = await Admin.findByIdAndUpdate({ _id: id }, { username, email }, { new: true }).select("-password");
    if (!editUser) {
        throw new NotFoundError(`No user with the id: ${id}`);
    }
    return res.status(200).json({ msg: editUser });
}


const RemoveAllAdmin = async (req, res) => {
    const removeAllAdmin = await Admin.deleteMany({});
    if (removeAllAdmin) {
        res.status(200).json({ msg: `All admin have been deleted` });
    }
}


module.exports = {
    registerAdmin,
    getAllAdmin,
    RemoveAllAdmin,
    editAdmin,
    loginAdmin,
    stayLoggedIn
};
