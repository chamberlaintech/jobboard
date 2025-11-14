import mongoose from "mongoose"

const JobSchema = new mongoose.Schema({
    company: {
        type: String,
        required: [true, "Please provide company name"],
        maxlength: 100,
    },
    position: {
        type: String,
        required: [true, "Please provide position"],
        maxlength: 100,
    },
    status: {
        type: String,
        enum: {
            values: ['pending', 'interview', 'declined', 'accepted'],
            message: '{VALUE} is not supported'
        },
        default: 'pending',
    },
    type: {
        type: String,
        enum: {
            values: ['full-time', 'part-time', 'remote', 'internship', 'contract'],
            message: '{VALUE} is not supported'
        },
        default: 'full-time',
    },
    location: {
        type: String,
        required: [true, "Please provide job location"],
        maxlength: 100,
    },
    salary: {
        type: Number,
        min: 0,
    },
    tags: {
        type: [String],
        set: arr => arr.map(tag => tag.toLowerCase()),
        default: [],
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, "Please provide user"],
    },
}, {
    timestamps: true
})

const Job = mongoose.model("Job", JobSchema);

export default Job;

