import db from "./Connection.js";
import UserRating from "./mongoose_models/UserRating.js";
import { secret } from "./utils.js";
import jwt from "jsonwebtoken";

class ContentController {
    async setRating(req, res) {
        try {
            const { content_id, rating_value } = req.body;
            const jwt_token = req.headers.authorization.split(' ')[1];
            if(!jwt_token) return res.status(400).json({ error: `No authorization token: ${error}` });
            const { id } = jwt.verify(jwt_token, secret);
            const userRatings = await db.getDocument(UserRating, { user_id: id });
            if(userRatings) {
                const existingRating = userRatings.ratings.find(rating => rating.content_id.toString() === content_id);
                if (existingRating) {
                    existingRating.rating = rating_value;
                } 
                else {
                    userRatings.ratings.push({ content_id, rating: rating_value });
                }
                await userRatings.save();
                return res.status(200).json({ message: 'Rating updated!' });
            }
            else {
                await db.addDocument(UserRating, {user_id: id, ratings: [{ content_id: content_id, rating: rating_value }]});
            }
            return res.status(200).json({ message: 'Rating added!' });

        } catch(error) {
            console.error('Rating set error', error);
            res.status(400).json({ error: `Rating set error: ${error}` });
        }
    } 
    async getRatings(req, res) {
        const jwt_token = req.headers.authorization.split(' ')[1];
        if(!jwt_token) return res.status(400).json({ error: `No authorization token: ${error}` });
        const { id } = jwt.verify(jwt_token, secret);
        const userRatings = await db.getDocument(UserRating, { user_id: id });
        if(!userRatings) return res.status(200).json({no_rating: 'Could not find ratings for this user'});
        const ratingsJson = userRatings.ratings.map(rating => rating.toJSON());
        res.status(200).json(ratingsJson);
    }
    async getRatingByContent(req, res) {
        const content_id = req.params.content_id;
        const jwt_token = req.headers.authorization.split(' ')[1];
        if(!jwt_token) return res.status(400).json({ error: `No authorization token: ${error}` });
        const { id } = jwt.verify(jwt_token, secret);
        const userRatings = await db.getDocument(UserRating, { user_id: id });
        if(!userRatings) return res.status(400).json({error: 'Could not find ratings for this user'});
        const rating = userRatings.ratings.find(rating => rating.content_id.toString() === content_id)
        if(!rating) return res.status(200).json({ no_rating: 'No rating found' });
        res.status(200).json(rating.toJSON());
    }
    async updateActions(req, res) {

    }
    async getActionsByUser(req, res) {

    }
}

const contentController = new ContentController();
export default contentController;