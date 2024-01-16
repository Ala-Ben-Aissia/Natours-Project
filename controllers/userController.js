const User = require("../models/userModel");
const {
	getAllDocs,
	getDoc,
	createDoc,
	updateDoc,
	deleteDoc,
} = require("../utils/docCRUD");

exports.getAllUsers = getAllDocs(User);
exports.getUser = getDoc(User);
exports.createUser = createDoc(User);
exports.updateUser = updateDoc(User);
exports.deleteUser = deleteDoc(User);
