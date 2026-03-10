import Email from "../utils/mailer.js";
import bcrypt from "bcrypt";
import {
  createUser,
  getUserByEmail,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  activateUser,
  deactivateUser,
  GetUserPassword,
  getallUsers,
  getUserByPhone,
  getUserByCode,
  updateUserCode,
  getMyUsers,
  getUserByNid,
  getalldocuments
} from "../services/userService.js";
import {
  createNotification,
} from "../services/NotificationService.js";
import db from "../database/models/index.js";
import imageUploader from "../helpers/imageUplouder.js";
import { getLocationScope, outranks } from "../middlewares/roleConfig.js";
import { generateVerificationToken } from "../utils/generateToken.js";
import { sendVerificationEmail } from "../services/emailService.js";
import jwt from "jsonwebtoken";

const getModels = () => {
  const { Requests, Counties, Districts, Clans, Towns, Villages, Categories, Users, Posts, Notifications, Documents } = db;
  return { Requests, Counties, Districts, Clans, Towns, Villages, Categories, Users, Posts, Notifications, Documents };
};

export const changePassword = async (req, res) => {
  console.log(req.user.id)
  const { oldPassword, newPassword, confirmPassword } = req.body;
  if (!oldPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Please provide userId, oldPassword, newPassword, and confirmPassword",
    });
  }

  try {
    const user = await GetUserPassword(req.user.id);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid user",
      });
    }

    console.log("Retrieved user from database:", user);

    const storedPassword = user || null;

    if (!storedPassword) {
      return res.status(500).json({
        success: false,
        message: "User password not found in the database",
      });
    }

    const validPassword = await bcrypt.compare(oldPassword, storedPassword);

    if (!validPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid old password",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await updateUser(req.user.id, { password: hashedPassword });

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Helper to parse an ID value to integer or null
const parseId = (val) => {
  if (val === "" || val === null || val === undefined) return null;
  const parsed = parseInt(val);
  return isNaN(parsed) ? null : parsed;
};

export const addUser = async (req, res) => {
  if (!req.body.role || req.body.role === "") {
    return res.status(400).json({ success: false, message: "Please provide role" });
  }
  if (!req.body.firstname || req.body.firstname === "") {
    return res.status(400).json({ success: false, message: "Please provide firstname" });
  }
  if (!req.body.lastname || req.body.lastname === "") {
    return res.status(400).json({ success: false, message: "Please provide lastname" });
  }
  if (!req.body.email || req.body.email === "") {
    return res.status(400).json({ success: false, message: "Please provide email" });
  }
  if (!req.body.phone || req.body.phone === "") {
    return res.status(400).json({ success: false, message: "Please provide phone" });
  }

  // Validate role hierarchy: creator must outrank the new user
  if (req.user.role !== 'admin' && !outranks(req.user.role, req.body.role)) {
    return res.status(403).json({
      success: false,
      message: "You cannot create a user with equal or higher role than yours",
    });
  }

  console.log(req.body);

  // For citizen role: inherit address from the logged-in leader's jurisdiction
  if (req.body.role === 'citizen') {
    req.body.county_id  = req.user.county_id  || null;
    req.body.district_id = req.user.district_id || null;
    req.body.clan_id    = req.user.clan_id    || null;
    req.body.town_id    = req.user.town_id    || null;
    req.body.village_id = req.user.village_id  || null;
  } else {
    // For all leader/admin roles: parse the submitted address IDs properly.
    // Empty strings from the form must become null, not "" which breaks the DB.
    req.body.county_id   = parseId(req.body.county_id);
    req.body.district_id = parseId(req.body.district_id);
    req.body.clan_id     = parseId(req.body.clan_id);
    req.body.town_id     = parseId(req.body.town_id);
    req.body.village_id  = parseId(req.body.village_id);
  }

  const NidExist = await getUserByNid(req.body.nid);
  if (NidExist) {
    return res.status(400).json({ success: false, message: "National id already exist" });
  }

  try {
    const userExist = await getUserByEmail(req.body.email);
    if (userExist) {
      return res.status(400).json({ success: false, message: "email already exist" });
    }

    const phoneExist = await getUserByPhone(req.body.phone);
    if (phoneExist) {
      return res.status(400).json({ success: false, message: "phone number has been used" });
    }

    const password = `1234`;
    req.body.password = password;
    req.body.status = "active";

    console.log(req.body);
    const newUser = await createUser(req.body);
    newUser.password = password;

    try {
      await new Email(newUser).sendAccountAdded();
    } catch (emailError) {
      console.error("Failed to send account creation email:", emailError);
    }

    try {
      await createNotification({
        userID: newUser.id,
        title: "Account created for you",
        message: "your account has been created successfully",
        type: 'account',
        isRead: false
      });
    } catch (notifError) {
      console.error("Failed to create account notification:", notifError);
    }

    try {
      const token = generateVerificationToken(newUser.id);
      const link = `http://localhost:3000/verify-email?token=${token}`;
      await sendVerificationEmail(newUser.email, link);
    } catch (verifEmailError) {
      console.error("Failed to send verification email in addUser:", verifEmailError);
    }

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: newUser.id,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        email: newUser.email,
        role: newUser.role,
        county_id: newUser.county_id,
        district_id: newUser.district_id,
        clan_id: newUser.clan_id,
        town_id: newUser.town_id,
        village_id: newUser.village_id,
      },
    });
  } catch (error) {
    console.error("Error in addUser:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const SignUp = async (req, res) => {
  if (!req.body.role || req.body.role === "" || !req.body.firstname || req.body.firstname === "" || !req.body.lastname || req.body.lastname === "" || !req.body.email || req.body.email === "" || !req.body.phone || req.body.phone === ""
    || !req.body.gender || req.body.gender === "") {
    return res.status(400).json({
      success: false,
      message: "Please provide all information",
    });
  }
  console.log(req.body);
  const { password } = req.body;

  if (!password || password === "") {
    return res.status(400).json({ success: false, message: "Please provide a password" });
  }

  try {
    const userExist = await getUserByEmail(req.body.email);
    if (userExist) {
      return res.status(400).json({ success: false, message: "email already exist" });
    }

    const NidExist = await getUserByNid(req.body.nid);
    if (NidExist) {
      return res.status(400).json({ success: false, message: "National id already exist" });
    }

    const phoneExist = await getUserByPhone(req.body.phone);
    if (phoneExist) {
      return res.status(400).json({ success: false, message: "phone number has been used" });
    }

    req.body.status = "active";
    req.body.role = "citizen";

    // Parse the submitted address IDs properly.
    // Empty strings from the form must become null, not "" which breaks the DB.
    req.body.county_id   = parseId(req.body.county_id);
    req.body.district_id = parseId(req.body.district_id);
    req.body.clan_id     = parseId(req.body.clan_id);
    req.body.town_id     = parseId(req.body.town_id);
    req.body.village_id  = parseId(req.body.village_id);

    const newUser = await createUser(req.body);

    try {
      const token = generateVerificationToken(newUser.id);
      const link = `http://localhost:3000/verify-email?token=${token}`;
      await sendVerificationEmail(newUser.email, link);
    } catch (verifEmailError) {
      console.error("Failed to send verification email in SignUp:", verifEmailError);
    }

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: newUser.id,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        email: newUser.email,
        role: newUser.role,
        county_id: newUser.county_id,
        district_id: newUser.district_id,
        clan_id: newUser.clan_id,
        town_id: newUser.town_id,
        village_id: newUser.village_id,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    let users = await getUsers();
    const locationScope = getLocationScope(req.user);

    if (req.user.role === 'admin') {
      // Admin sees all non-citizen users (leaders list)
      let leaders = users.filter(user => user.role !== "citizen" && user.id !== req.user.id);
      return res.status(200).json({
        success: true,
        message: "Users retrieved successfully",
        users: leaders,
      });
    }

    // All leader roles: filter by location scope and exclude self
    let filteredUsers = users.filter(user => {
      if (user.id === req.user.id) return false;
      // Apply location scope filtering
      for (const [key, value] of Object.entries(locationScope)) {
        if (user[key] !== value) return false;
      }
      return true;
    });

    // Non-admin leaders see leaders below them (not citizens)
    filteredUsers = filteredUsers.filter(user => user.role !== "citizen");

    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      users: filteredUsers,
    });
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const getCitizen = async (req, res) => {
  try {
    const { Users, Counties, Districts, Clans, Towns, Villages } = getModels();

    if (!Users) {
      throw new Error("Users model not loaded");
    }

    // Build WHERE clause: always filter by citizen role + location scope
    const locationScope = getLocationScope(req.user);
    const whereClause = { role: "citizen", ...locationScope };

    const citizens = await Users.findAll({
      where: whereClause,
      attributes: { exclude: ["password"] },
      include: [
        { model: Counties, as: "county", required: false },
        { model: Districts, as: "district", required: false },
        { model: Clans, as: "clan", required: false },
        { model: Towns, as: "town", required: false },
        { model: Villages, as: "village", required: false },
      ],
    });

    return res.status(200).json({
      success: true,
      message: "Citizens retrieved successfully",
      users: citizens,
    });
  } catch (error) {
    console.error("DATABASE FETCH ERROR in getCitizen:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching citizens.",
      error: error.message,
    });
  }
};

export const getOneUser = async (req, res) => {
  try {
    const user = await getUser(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, message: "User retrieved successfully", user });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

export const updateOneUser = async (req, res) => {
  try {
    let image;
    if (req.files && req.files.image) {
      try {
        image = await imageUploader(req);
        if (!image || !image.url) {
          throw new Error('Upload failed or image URL missing');
        }
        req.body.image = image.url;
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }

    const user = await updateUser(req.params.id, req.body);
    if (req.params.id != req.user.id) {
      await createNotification({
        userID: req.params.id,
        title: "your account has been updated",
        message: "your account has been edited by admin",
        type: 'account',
        isRead: false
      });
    }
    return res.status(200).json({ success: true, message: "User updated successfully", user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

export const deleteOneUser = async (req, res) => {
  try {
    const existingUser = await getUser(req.params.id);
    if (!existingUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    await deleteUser(req.params.id);
    return res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

export const activateOneUser = async (req, res) => {
  try {
    const existingUser = await getUser(req.params.id);
    if (!existingUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    await activateUser(req.params.id);
    return res.status(200).json({ success: true, message: "User activated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

export const deactivateOneUser = async (req, res) => {
  try {
    const existingUser = await getUser(req.params.id);
    if (!existingUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    await deactivateUser(req.params.id);
    return res.status(200).json({ success: true, message: "User deactivated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

export const checkEmail = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: "Please provide your Email" });
  }

  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(400).json({ success: false, message: "There is no account associated with that email" });
    }

    const timestamp = Date.now().toString().slice(-3);
    const randomPart = Math.floor(100 + Math.random() * 900).toString();
    const code = timestamp + randomPart;

    await new Email(user, null, code).sendResetPasswordCode();
    await updateUserCode(email, { code: code });

    return res.status(200).json({ success: true, message: "Code sent to your email successfully" });
  } catch (error) {
    console.error("Error checking email:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const checkCode = async (req, res) => {
  const { code } = req.body;
  if (!req.params.email) {
    return res.status(400).json({ success: false, message: "Please provide your Email" });
  }

  try {
    const user = await getUserByCode(req.params.email, code);
    if (!user) {
      return res.status(400).json({ success: false, message: "invalid code" });
    }
    return res.status(200).json({ success: true, message: "now you can reset your password" });
  } catch (error) {
    console.error("Error checking code:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const ResetPassword = async (req, res) => {
  const user = await getUserByEmail(req.params.email);
  if (!user) {
    return res.status(400).json({ success: false, message: "There is no account associated with that email" });
  }
  if (!user.code) {
    return res.status(400).json({ success: false, message: "No Reset Code" });
  }

  const { newPassword, confirmPassword } = req.body;
  if (!newPassword || !confirmPassword) {
    return res.status(400).json({ success: false, message: "Please provide newPassword, and confirmPassword" });
  }

  try {
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: "New password and confirm password do not match" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await updateUser(user.id, { password: hashedPassword, code: '' });

    return res.status(200).json({ success: true, message: "Password changed successfully, Login" });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const addRequest = async (req, res) => {
  try {
    const { Requests } = getModels();
    let userID = req.user.id;
    
    // Extract new fields from request body
    const { 
      reason, 
      county_id, district_id, clan_id, town_id, village_id,
      full_name, national_id, phone_number, household_size,
      current_county_id, current_district_id, current_clan_id, current_town_id, current_village_id,
      transfer_type, move_date, transfer_duration,
      host_name, host_phone, host_relationship
    } = req.body;

    let supporting_document = null;
    
    // Handle file upload if provided via multer/file-upload
    if (req.files && req.files.document) {
      try {
        // Use existing imageUploader or similar logic if available
        // For simplicity, we'll assume imageUploader can handle general files
        const uploadedFile = await imageUploader(req, 'document'); 
        if (uploadedFile && uploadedFile.url) {
          supporting_document = uploadedFile.url;
        }
      } catch (error) {
        console.error("Error uploading supporting document:", error);
      }
    }

    const request = await Requests.create({
      userID,
      reason,
      status: "pending",
      // Destination Info
      county_id,
      district_id,
      clan_id,
      town_id,
      village_id,
      // Citizen Identity
      full_name,
      national_id,
      phone_number,
      household_size,
      // Current Residence
      current_county_id,
      current_district_id,
      current_clan_id,
      current_town_id,
      current_village_id,
      // Transfer Details
      transfer_type,
      move_date,
      transfer_duration,
      supporting_document,
      // Host Details
      host_name,
      host_phone,
      host_relationship
    });

    try {
      await createNotification({
        userID: 1, // Notify Admin
        title: "New Enhanced Transfer Request",
        message: `A new transfer request has been submitted by ${req.user.firstname} ${req.user.lastname} for ${full_name || 'themselves'}.`,
        type: 'request',
        isRead: false
      });
    } catch (notificationError) {
      console.error("Non-fatal error creating notification:", notificationError);
      // We don't throw here to ensure the user still gets a success response
    }

    res.status(201).json({ message: "Request submitted successfully", request });
  } catch (error) {
    console.error("Error in addRequest:", error);
    res.status(500).json({ error: error.message });
  }
};

export const approveRequest = async (req, res) => {
  try {
    const { Requests, Users } = getModels();
    const { requestID } = req.params;
    const request = await Requests.findByPk(requestID);
    if (!request) return res.status(404).json({ message: "Request not found" });

    await Users.update(
      {
        county_id: request.county_id,
        district_id: request.district_id,
        clan_id: request.clan_id,
        town_id: request.town_id,
        village_id: request.village_id,
      },
      { where: { id: request.userID } }
    );

    await request.update({ status: "approved" });
    await createNotification({ userID: request.userID, title: "Request Approved", message: "your request has been approved !", type: 'request', isRead: false });

    res.status(200).json({ message: "Request approved successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const rejectRequest = async (req, res) => {
  try {
    const { Requests } = getModels();
    const { requestID } = req.params;
    const request = await Requests.findByPk(requestID);
    if (!request) return res.status(404).json({ message: "Request not found" });

    await request.update({ status: "rejected" });
    await createNotification({ userID: request.userID, title: "Request Rejected", message: "your request has been rejected !", type: 'request', isRead: false });

    res.status(200).json({ message: "Request rejected successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRequests = async (req, res) => {
  try {
    const { Requests, Counties, Districts, Clans, Towns, Villages, Users } = getModels();
    let requests;
    const includeOptions = [
      { model: Counties, as: "county" },
      { model: Districts, as: "district" },
      { model: Clans, as: "clan" },
      { model: Towns, as: "town" },
      { model: Villages, as: "village" },
      { model: Counties, as: "current_county" },
      { model: Districts, as: "current_district" },
      { model: Clans, as: "current_clan" },
      { model: Towns, as: "current_town" },
      { model: Villages, as: "current_village" },
      {
        model: Users,
        as: "user",
        include: [
          { model: Counties, as: "county" },
          { model: Districts, as: "district" },
          { model: Clans, as: "clan" },
          { model: Towns, as: "town" },
          { model: Villages, as: "village" }
        ],
      },
    ];

    if (req.user.role === "admin") {
      // Admin sees all requests
      requests = await Requests.findAll({ include: includeOptions });
    } else if (req.user.role === "citizen") {
      // Citizens see only their own requests
      requests = await Requests.findAll({ where: { userID: req.user.id }, include: includeOptions });
    } else {
      // Leaders see requests within their location scope
      const locationScope = getLocationScope(req.user);
      requests = await Requests.findAll({ where: locationScope, include: includeOptions });
    }

    if (!requests || requests.length === 0) {
      return res.status(404).json({ message: "No requests found" });
    }

    res.status(200).json({ requests });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addDocument = async (req, res) => {
  try {
    const { Documents } = getModels();
    let image = null;
    if (req.files && req.files.image) {
      try {
        const uploadedImage = await imageUploader(req);
        if (uploadedImage && uploadedImage.url) {
          image = uploadedImage.url;
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }

    const { userID, category, title, description } = req.body;

    if (!userID || !category || !title) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    let RecordedBy = req.user.id;

    const newDocument = await Documents.create({ userID, category, title, description, image, RecordedBy });
    await createNotification({ userID: userID, title: "Document added", message: "your account has been added a new document", type: 'request', isRead: false });

    res.status(201).json({ message: "Document added successfully", data: newDocument });
  } catch (error) {
    res.status(500).json({ message: "Error adding document", error: error.message });
  }
};

export const viewMyDocuments = async (req, res) => {
  try {
    let all = await getalldocuments(req.user.id);
    res.status(200).json({ message: "Documents retrieved successfully", data: all });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching documents", error: error.message });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const { Documents } = getModels();
    const { id } = req.params;
    const document = await Documents.findByPk(id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }
    await document.destroy();
    res.status(200).json({ message: "Document deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting document", error: error.message });
  }
};