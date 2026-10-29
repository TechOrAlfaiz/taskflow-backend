const mongoose = require("mongoose");

const Task = require("../models/task.model");

const getTasks = async (req, res, next) => {
    try {
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit ?? 10);

        if (
            !Number.isSafeInteger(page) ||
            page < 1 ||
            !Number.isSafeInteger(limit) ||
            limit < 1 ||
            limit > 50
        ) {
            return res.status(400).json({
                message: "Page must be a positive integer and limit must be between 1 and 50"
            });
        }

        const skip = (page - 1) * limit;

        if (!Number.isSafeInteger(skip)) {
            return res.status(400).json({
                message: "Page is too large"
            });
        }

        const filter = { owner: req.userId };

        if (req.query.completed !== undefined) {
            if (
                req.query.completed !== "true" &&
                req.query.completed !== "false"
            ) {
                return res.status(400).json({
                    message: "Completed filter must be true or false"
                });
            }

            filter.completed = req.query.completed === "true";
        }
        const total = await Task.countDocuments(filter);
        const totalPages = Math.ceil(total / limit);

        const tasks = await Task.find(filter)
            .sort({ createdAt: -1, _id: -1 })
            .skip(skip)
            .limit(limit);

        return res.status(200).json({
            page,
            limit,
            total,
            totalPages,
            tasks
        });
    } catch (error) {
        next(error);
    }
};

const createTask = async (req, res, next) => {
    try {
        const { title } = req.body ?? {};

        if (typeof title !== "string" || title.trim() === "") {
            return res.status(400).json({
                message: "Title must be a non-empty string"
            });
        }

        if (title.trim().length > 200) {
            return res.status(400).json({
                message: "Title must not exceed 200 characters"
            });
        }

        const task = await Task.create({
            title: title.trim(),
            owner: req.userId
        });

        return res.status(201).json({ task });
    } catch (error) {
        next(error);
    }
};

const getTasksById = async (req, res, next) => {
    try {
        const id = req.params.id;

        if (!mongoose.isObjectIdOrHexString(id)) {
            return res.status(400).json({
                message: "Invalid task ID"
            });
        }

        const task = await Task.findOne({
            _id: id,
            owner: req.userId
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        return res.status(200).json({ task });
    } catch (error) {
        next(error);
    }
};

const updateTask = async (req, res, next) => {
    try {
        const id = req.params.id;

        if (!mongoose.isObjectIdOrHexString(id)) {
            return res.status(400).json({
                message: "Invalid task ID"
            });
        }

        const { completed } = req.body ?? {};

        if (typeof completed !== "boolean") {
            return res.status(400).json({
                message: "Completed must be a boolean"
            });
        }

        const task = await Task.findOne({
            _id: id,
            owner: req.userId
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        task.completed = completed;
        await task.save();

        return res.status(200).json({ task });
    } catch (error) {
        next(error);
    }
};

const deleteTask = async (req, res, next) => {
    try {
        const id = req.params.id;

        if (!mongoose.isObjectIdOrHexString(id)) {
            return res.status(400).json({
                message: "Invalid task ID"
            });
        }

        const task = await Task.findOneAndDelete({
            _id: id,
            owner: req.userId
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        return res.status(200).json({
            message: "Task deleted Successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getTasks, createTask, getTasksById, updateTask, deleteTask };