import mongoose from 'mongoose';
import Report from '../models/report.model.js'
import User from '../models/user.model.js'

export const getReports = async (req, res) => {
    try {
        let reports = [];
        await Report.db.transaction(async (session) => {
            reports = await Report.find( {isActive: true, show: true} ).session(session);
        })
        res.status(200).json(reports);
    } 
    catch (error) {
        res.status(404).json({ error });
    }
}

const updateUsersOnCreation = async (report, session) => {
    const culprit = await User.findOne({ username: report.culprit }).session(session);
    if (culprit) {
        if (report.isActive) {
            culprit.reportsAgainst = [...culprit.reportsAgainst, report._id];
            await User.findByIdAndUpdate(culprit._id, culprit).session(session);
        }
    }

    const snitch = await User.findOne({ username: report.snitch }).session(session);
    if (snitch) {
        snitch.reportsFiled = [...snitch.reportsAgainst, report._id];
        await User.findByIdAndUpdate(snitch._id, snitch).session(session);
    }
}

export const createReport = async (req, res) => {
    const report = req.body;
    const newReport = new Report(report);

    try {
        await Report.db.transaction(async (session) => {
            await updateUsersOnCreation(newReport, session);
            await newReport.save().session(session);
        })
        res.status(201).json(newReport);
    } 
    catch (error) {
        res.status(409).json({ error });
    }
}

const updateUsersOnUpdate = async (report, session) => {
    if (!report.isActive) {
        const user = await User.findOne({ username: report.culprit }).session(session);
        if (user) {
            user.reportsAgainst = user.reportsAgainst.filter((report_id) => String(report_id) != String(report._id));
            await User.findByIdAndUpdate(user._id, user).session(session);
        }
    }
}

export const updateReport = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).send('No report with that ID');
        return;
    }

    const updates = req.body;

    try {
        await Report.db.transaction(async (session) => {
            const oldReport = await Report.findById(id).session(session).lean();
            const newReport = {...oldReport, ...updates};
            await Report.findByIdAndUpdate(id, newReport).session(session);
            await updateUsersOnUpdate(newReport, session);
            res.status(200).json(newReport);
        })
    } 
    catch (error) {
        console.log(error)
        res.status(409).json(error);
    }
}