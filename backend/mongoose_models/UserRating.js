import mongoose from 'mongoose'

const RatingSchema = new mongoose.Schema({
    content_id: { type: String, required: true },
    rating: { type: Number, required: true }
}, { timestamps: true }); 

const UserRatingSchema = new mongoose.Schema({
    user_id: { type: mongoose.SchemaTypes.ObjectId, required: true },
    ratings: [RatingSchema] 
}, { timestamps: true });

export default mongoose.model('UserRating', UserRatingSchema);