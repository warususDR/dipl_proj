import mongoose from 'mongoose'

const ActionSchema = new mongoose.Schema({
    action_id: {type: Number, required: true},
    action_name: {type: String, required: true},
    action_count: {type: Number, required: true}}, 
    {timestamps: true})

export default mongoose.model('Action', ActionSchema);