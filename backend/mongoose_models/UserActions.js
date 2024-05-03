import mongoose from 'mongoose'

const ActionSchema = new mongoose.Schema({
    action_id: {type: Number, required: true},
    action_name: {type: String, required: true},
    action_count: {type: Number, required: true}}, 
    {timestamps: true})

const UserActionsSchema = new mongoose.Schema({
    user_id: {type: mongoose.SchemaTypes.ObjectId, required: true},
    actions: [{content_id: {type: String, required: true}, 
               content_actions: [ActionSchema]}]
    })

export default mongoose.model('UserActions', UserActionsSchema)