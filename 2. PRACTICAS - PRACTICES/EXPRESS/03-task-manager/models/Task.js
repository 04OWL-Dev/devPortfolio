import mongoose, { mongo } from "mongoose"
const taskSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: [true, 'must provide name'], 
        trim: true,
        maxlength: [20, 'name can not be more than 20 characters'],
    },
    completed: {
        type: Boolean, 
        default: false
    }
})

export default mongoose.model('Task', taskSchema)
//Nombre del modelo y el esquema/estructura de la colección. 