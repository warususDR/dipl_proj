import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from './Connection.js'
import User from './mongoose_models/User.js'
import { secret } from './utils.js'

const generateJwtToken = (id, email, nickname) => {
    const data = { id, email, nickname };
    return jwt.sign(data, secret, {expiresIn: '8h'});
} 

class UserController {
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const currUser = await db.getDocument(User, { email: email});
            if (!currUser) return res.status(400).json({ error: `No user with ${email} email!` })
            const passwordCheck = bcrypt.compareSync(password, currUser.password);
            if (!passwordCheck) return res.status(400).json({ error: 'Wrong password!' })
            const jwt_token = generateJwtToken(currUser._id, currUser.email, currUser.nickname);
            res.status(200).json({ jwt_token });
        } catch(error) {
            console.error('Login error', error);
            res.status(400).json({ error: `Login error: ${error}` });
        }
    }

    async signUp(req, res) {
        try {
            const raw_data = req.body;
            const data = {};
            for (const key in raw_data) {
                if (raw_data.hasOwnProperty(key)) {
                data[key] = raw_data[key];
                }
            }
            const usr = await db.getDocument(User, {email: data.email});
            if (usr) return res.status(400).json({ error: 'Email already taken!' })
            const encodedPassword = bcrypt.hashSync(data.password, 10);
            data.password = encodedPassword;
            data.signup_date = new Date();
            const newUser = await db.addDocument(User, data);
            if (newUser) {
                res.status(200).json( {message: `Added user ${newUser._id}` } );
            }
            else res.status(400).json({ error: "Couldn't sign up" });
        } catch(error) {
            console.error('Error adding user', error);
            res.status(400).json({ error: `Error adding user: ${error}` });
        }

    }

    async getInfo(req, res) {
        try {
            const jwt_token = req.headers.authorization.split(' ')[1];
            const { id } = jwt.verify(jwt_token, secret);
            const currUser = await db.getDocumentById(User, id);
            if (!currUser) return res.status(400).json({ error: `Error getting user with id provided: ${error}` });
            res.status(200).json(currUser.toJSON());
        } catch(error) {
            console.error('Error getting user info', error);
            res.status(400).json({ error: `Error getting user info: ${error}` });
        }
    }

    async updateUser(req, res) {
         try {
            const jwt_token = req.headers.authorization.split(' ')[1];
            const { id } = jwt.verify(jwt_token, secret);
            const raw_data = req.body;
            const data = {};
            for (const key in raw_data) {
                if (raw_data.hasOwnProperty(key)) {
                data[key] = raw_data[key];
                }
            }
            const currUser = await db.getDocumentById(User, id);
            if (!currUser) return res.status(400).json({ error: `Error getting user with id provided: ${error}` });
            await db.updateDocumentById(User, id, data);
            res.status(200).json(currUser.toJSON());
        } catch(error) {
            console.error('Error updating user info', error);
            res.status(400).json({ error: `Error updating user info: ${error}` });
        }
    }

    async getPrefs(req, res) {
         try {
            const jwt_token = req.headers.authorization.split(' ')[1];
            const { id } = jwt.verify(jwt_token, secret);
            const user = await db.getDocumentById(User, id)
            if(!user.description || user.description === '' || user.favorite_genres.length === 0) {
                return res.status(400).json({error: 'No description or genres for user'})
            }
            const prefs_url = `http://127.0.0.1:5000/recommend/by-prefs/${id}`
            let prefs;
            fetch(prefs_url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                }).then(res => {
                    return res.json();
                }).then(data => {
                    prefs = data;
                    return res.status(200).json({prefs});
                }).catch(err => {
                    console.error('Error occured', err);
            })
        } catch(error) {
            console.error('Error getting recommendations by preferences', error);
            res.status(400).json({ error: `Error getting recommendations by preferences: ${error}` });
        }
    }

    async getPersonalRecs(req, res) {
         try {
            const jwt_token = req.headers.authorization.split(' ')[1];
            const { id } = jwt.verify(jwt_token, secret);
            await db.getDocumentById(User, id)
            const collab_url = `http://127.0.0.1:5000/recommend/collaborative/${id}`
            let recs;
            fetch(collab_url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(req.body)
                }).then(res => {
                    return res.json();
                }).then(data => {
                    if  (data.hasOwnProperty('not_enough_ratings')) {
                        return res.status(200).json({"not_enough_ratings": []})
                    }
                    else {
                        recs = data;
                        return res.status(200).json({recs});
                    }
                }).catch(err => {
                    console.error('Error occured', err);
            })
        } catch(error) {
            console.error('Error getting personal recommendations', error);
            res.status(400).json({ error: `Error getting personal recommendations: ${error}` });
        }
    }

}

const userController = new UserController();
export default userController;