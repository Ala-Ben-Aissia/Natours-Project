const User = require("../models/userModel");
const AppError = require("./appError");
const catchAsync = require("./catchAsync");
const queryAPI = require("../utils/queryAPI");
exports.getAllDocs = (Model) =>
	catchAsync(async (req, res, next) => {
		const api = new queryAPI(Model.find(), req.query)
			.filter()
			.sort()
			.fields()
			.paginate();
		const docs = await api.query;
		return res.status(200).json({
			status: "success",
			results: docs.length,
			data: {
				docs,
			},
		});
	});

exports.getDoc = (Model) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.findById(req.params.id);
		if (!doc) return next(new AppError("Invalid doc ID", 404));
		return res.status(200).json({
			status: "success",
			data: {
				doc,
			},
		});
	});

exports.createDoc = (Model) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.create(req.body);
		return res.status(201).json({
			status: "success",
			data: {
				doc,
			},
		});
	});

exports.updateDoc = (Model) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.findByIdAndUpdate(
			req.params.id,
			req.body,
			{
				runValidators: true,
				new: true,
			}
		);
		if (!doc) return next(new AppError("Invalid doc ID", 404));
		return res.status(200).json({
			status: "success",
			data: {
				doc,
			},
		});
	});

exports.deleteDoc = (Model) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.findByIdAndDelete(req.params.id);
		if (!doc) return next(new AppError("Invalid doc ID", 404));
		return res.status(204).json({
			status: "success",
			data: null,
		});
	});
