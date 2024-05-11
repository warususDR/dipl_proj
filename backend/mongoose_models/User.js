import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    nickname: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    gender: {type: String, required: true},
    birth_date: {type: Date, required: true},
    description: {type: String, required: false},
    signup_date: {type: Date, required: false},
    favorite_genres: {type: [String], required: false},
})

export default mongoose.model('User', UserSchema)