import mongoose from "mongoose"

const ApplicationSchema = new mongoose.Schema({
    job: {
        type: mongoose.Types.ObjectId,
        ref: 'Job',
        required: [true, "Please provide job"],
    },
    applicant: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, "Please provide user"],
    },
    status: {
        type: String,
        enum: {
            values: ['submitted', 'reviewed', 'accepted', 'declined'],
            message: '{VALUE} is not supported'
        },
        default: 'submitted',
    },
    resumeUrl: {
        type: String,
        required: [true, "Please provide resume URL"],
    },
}, {
    timestamps: true
})

const Application = mongoose.model("Application", ApplicationSchema);

export default Application;