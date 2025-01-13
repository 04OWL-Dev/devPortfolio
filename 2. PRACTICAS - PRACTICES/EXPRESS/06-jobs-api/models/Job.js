import mongoose from "mongoose";
const JobSchema = new mongoose.Schema({
    company: {
        type: String,
        required: [true, 'Please provide company name'],
        maxlength: 50,
    },
    position: {
        type: String,
        required: [true, 'Please provide position'],
        maxlength: 100,
    },
    status: {
        type: String,
        enum: ['interview', 'declined', 'pending'],
        default: 'pending',
    },
    createdBy: {
        type: mongoose.Types.ObjectId,//Usuario creador del trabajo.
        ref: 'User',//Modelo al que se le hace
        required: [true, 'Please provide user'],
    },
    
}, { timestamps: true })

export default mongoose.model('Job', JobSchema)