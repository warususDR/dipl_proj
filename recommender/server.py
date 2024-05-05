from flask import Flask, jsonify
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from recommendation_algs import fetch_best_anime, recommend_by_genres, recommend_by_description

# server config
app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb+srv://warusus:xlJJroAKnDZRSQHD@clusterdmytrii.xzcilih.mongodb.net/dipl_proj?retryWrites=true&w=majority&appName=ClusterDmytrii"
mongo = PyMongo(app)

#api endpoints
@app.route("/")
def hello_world():
    return { "message": "recommender api"}

@app.route("/recommend/by-prefs/<user_id>", methods=["GET"])
def recommend_by_prefs(user_id):
    try:
        user_data = mongo.db.users.find_one({ "_id": ObjectId(user_id)})
    except Exception as err:
        print(f"Error: {err}")
        return { "error": "Invalid user id!" }, 400
    if user_data is None:
        print(f"No user with id {user_id} found")
        return { "error": "No user found!" }, 404
    else:
        description = user_data["description"]
        pref_genres = user_data["favorite_genres"]
        anime_set = []
        for i in range(1, 3):
            anime_set += fetch_best_anime(i)
        filtered_set = list(filter(lambda anime: anime["genres"] and anime["description"], anime_set))
        genres_recs = recommend_by_genres(filtered_set, pref_genres)
        description_recs = recommend_by_description(filtered_set, description)
        
        return {"genre_recs": genres_recs[:10], "descript_recs": description_recs[:10]}, 200 