import mongoose from 'mongoose'

const UserActionsSchema = new mongoose.Schema({
    user_id: {type: mongoose.SchemaTypes.ObjectId, required: true},
    actions: [{content_id: {type: mongoose.SchemaTypes.ObjectId, required: true}, 
               content_actions: {type: [mongoose.SchemaTypes.ObjectId], required: true}}]
    })

export default mongoose.model('UserActions', UserActionsSchema)