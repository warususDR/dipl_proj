from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
import pandas as pd
from recommendation_algs import prepare_anime_set, recommend_by_genres, recommend_by_description, recommend_similar_content_lda,recommend_similar_content_tfidf, recommend_collab

# server config
app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb+srv://warusus:xlJJroAKnDZRSQHD@clusterdmytrii.xzcilih.mongodb.net/dipl_proj?retryWrites=true&w=majority&appName=ClusterDmytrii"
mongo = PyMongo(app)

#api endpoints
@app.route("/")
def hello_world():
    return { "message": "recommender api" }

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
        anime_set = prepare_anime_set()
        genres_recs = recommend_by_genres(anime_set, pref_genres)
        description_recs = recommend_by_description(anime_set, description)
        return {"genre_recs": genres_recs[:10], "descript_recs": description_recs[:10]}, 200 
    

@app.route("/recommend/similar-items", methods=["POST"])
def recommend_similar_items():
    item_data = request.get_json()
    anime_set = prepare_anime_set()
    topic_recs = recommend_similar_content_lda(anime_set, item_data)
    term_recs = recommend_similar_content_tfidf(anime_set, item_data)
    return {"topic_recs": topic_recs[:10], "term_recs": term_recs[:10]}, 200


@app.route("/recommend/collaborative/<user_id>", methods=["GET"])
def recommend_collaborative(user_id):
    try:
        user_ratings = mongo.db.userratings.find_one({ "user_id": ObjectId(user_id)})
    except Exception as err:
        print(f"Error: {err}")
        return { "error": "Invalid user id!" }, 400
    if user_ratings is None:
        print(f"User with id {user_id} left no ratings")
        return { "error": "No ratings" }, 404
    elif len(user_ratings["ratings"]) < 5:
        return {"not_enough_ratings": []}, 200
    else:
        anime_set = prepare_anime_set()
        rec_ids = recommend_collab(user_ratings, anime_set)
    return {"collab_recs": rec_ids[:20]}, 200