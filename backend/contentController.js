import db from "./Connection.js";
import UserRating from "./mongoose_models/UserRating.js";
import UserActions from "./mongoose_models/UserActions.js";
import { secret } from "./utils.js";
import jwt from "jsonwebtoken";

const action_types = ['OpenAnimePageFromHome', 'RatedAnime', 'OpenedDescription', 'ViewedTrailer'];

class ContentController {
    async setRating(req, res) {
        try {
            const { content_id, rating_value } = req.body;
            const jwt_token = req.headers.authorization.split(' ')[1];
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
        try {
            const jwt_token = req.headers.authorization.split(' ')[1];
            const { id } = jwt.verify(jwt_token, secret);
            const userRatings = await db.getDocument(UserRating, { user_id: id });
            if(!userRatings) return res.status(200).json({no_rating: 'Could not find ratings for this user'});
            const ratingsJson = userRatings.ratings.map(rating => rating.toJSON());
            res.status(200).json(ratingsJson);
        } catch(error) {
            console.error('Rating get error', error);
            res.status(400).json({ error: `Rating get error: ${error}` });
        }
    }
    async getRatingByContent(req, res) {
        try {
            const content_id = req.params.content_id;
            const jwt_token = req.headers.authorization.split(' ')[1];
            if(!jwt_token) return res.status(400).json({ error: `No authorization token: ${error}` });
            const { id } = jwt.verify(jwt_token, secret);
            const userRatings = await db.getDocument(UserRating, { user_id: id });
            if(!userRatings) return res.status(400).json({error: 'Could not find ratings for this user'});
            const rating = userRatings.ratings.find(rating => rating.content_id.toString() === content_id)
            if(!rating) return res.status(200).json({ no_rating: 'No rating found' });
            res.status(200).json(rating.toJSON());
        } catch(error) {
            console.error('Rating get error', error);
            res.status(400).json({ error: `Rating get error: ${error}` });
        }
    }
    async updateActions(req, res) {
        try {
            const { content_id, action_id } = req.body;
            const jwt_token = req.headers.authorization.split(' ')[1];
            if(!jwt_token) return res.status(400).json({ error: `No authorization token: ${error}` });
            const { id } = jwt.verify(jwt_token, secret);
            const userActions = await db.getDocument(UserActions, { user_id: id}); 
            if(userActions) {
                const existingActions = userActions.actions.find(action => action.content_id === content_id);
                if (existingActions) {
                    const existingAction = existingActions.content_actions.find(action => action.action_id === action_id);
                    if(existingAction) existingAction.action_count++;
                    else existingActions.content_actions.push({action_id, action_name: action_types[action_id], action_count: 1});
                } 
                else {
                    userActions.actions.push({ content_id, 
                        content_actions: [{action_id, action_name: action_types[action_id], action_count: 1 }] });
                }
                await userActions.save();
                return res.status(200).json({ message: 'Action updated!' });
            }
            else {
                await db.addDocument(UserActions, {user_id: id, actions: [{ content_id, 
                content_actions: [{action_id: action_id, action_name: action_types[action_id], action_count: 1 }]}]});
            }
            return res.status(200).json({ message: 'Action added!' });
            
        } catch(error) {
            console.error('Update action error', error);
            res.status(400).json({ error: `Update action error: ${error}` });
        }
    }
    async getActionsByUser(req, res) {
        try {
            const jwt_token = req.headers.authorization.split(' ')[1];
            if(!jwt_token) return res.status(400).json({ error: `No authorization token: ${error}` });
            const { id } = jwt.verify(jwt_token, secret);
            const userActions = await db.getDocument(UserActions, { user_id: id}); 
            if(!userActions) return res.status(200).json({ no_actions: 'No actions found!' });
            const userActionsJson = userActions.actions.map(action => action.toJSON());
            res.status(200).json(userActionsJson);
        } catch(error) {
            console.error('Get action error', error);
            res.status(400).json({ error: `Get action error: ${error}` });
        }
    }
    async getSimilar(req, res) {
        try {
            const similar_url = 'http://127.0.0.1:5000/recommend/similar-items'
            let similar;
            fetch(similar_url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(req.body)
                }).then(res => {
                    return res.json();
                }).then(data => {
                    similar = data;
                    return res.status(200).json({similar});
                }).catch(err => {
                    console.error('Error occured', err);
            })
        } catch(error) {
            console.error('Get similar error', error);
            res.status(400).json({ error: `Get similar error: ${error}` });
        }
    }
}

const contentController = new ContentController();
export default contentController;