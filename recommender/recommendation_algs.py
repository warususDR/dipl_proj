import re
from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
from sklearn.metrics.pairwise import linear_kernel, cosine_similarity
from sklearn.decomposition import LatentDirichletAllocation
from surprise import Reader, SVD, Dataset
from surprise.model_selection import cross_validate
import pandas as pd
import ast
import numpy as np

'''
anilist_api_url = 'https://graphql.anilist.co'
top_score_anime_query = """
    query ($page: Int) {
        Page(page: $page, perPage: 50) {
            media(type: ANIME, sort: SCORE_DESC) {
                id
                title {
                    romaji
                    english
                }
                genres
                description
            }
        }
    }
"""
'''
# def fetch_best_anime(page):
#     response = requests.post(anilist_api_url, json={"query": top_score_anime_query, "variables": {"page": page}})
#     response_data = response.json()
#     if response.ok and 'data' in response_data:
#         return response_data['data']['Page']['media']
#     else:
#         print(f"Error fetching trending anime: {response_data}")
#         return []
    
def strip_html(html):
    text = re.sub('<[^<]+?>', '', html)
    return re.sub(r'\s+', ' ', text)

    
def prepare_anime_set():
    anime_set = pd.read_csv("anilist_dataset.csv")
    filtered_anime_set = anime_set[
        (anime_set["description"].notna()) & 
        (anime_set["genres"].notna() & anime_set["genres"].apply(lambda x: x != "[]")) &  
        (anime_set["status"].notna() & ~anime_set["status"].isin(["CANCELLED", "NOT_YET_RELEASED"])) &
        (anime_set["mean_score"].notna()) &
        (anime_set["average_score"].notna()) &
        (anime_set["tags"].notna()) &
        (anime_set["studios"].notna()) &
        (anime_set["season_year"].notna())
    ]
    return filtered_anime_set


# knowledge-based recommendation    

def recommend_by_genres(anime_data, pref_genres):
    anime_data["genres"] = anime_data["genres"].apply(lambda genre_lst: ast.literal_eval(genre_lst))
    filtered_data = anime_data[anime_data["genres"].apply(lambda genre_lst: set(genre_lst).intersection(pref_genres)).astype(bool)]
    filtered_data_sorted = filtered_data.sort_values(by="mean_score", ascending=False)
    recommended_ids = filtered_data_sorted["id"].tolist()
    return recommended_ids

# content-based recommendation (TF - IDF)

def recommend_by_description(anime_data, description):
    anime_data = anime_data[anime_data["mean_score"] > 75]
    anime_data["cleaned_description"] = anime_data['description'].apply(lambda html_desc: strip_html(html_desc.strip()))
    descriptions = anime_data['cleaned_description'].tolist()
    descriptions.append(description)
    ids = anime_data['id'].tolist()  
    vectorizer = TfidfVectorizer(stop_words='english', lowercase=True)
    matrix = vectorizer.fit_transform(descriptions)
    similarity = linear_kernel(matrix[-1], matrix)
    id_sim_dict = dict(zip(ids, similarity[0][:-1]))
    sorted_dict = dict(sorted(id_sim_dict.items(), key=lambda item: item[1], reverse=True))
    return list(sorted_dict.keys())

# content-based recommendation for items

def prepare_anime_soup(anime_data):
    anime_texts = []
    for _, row in anime_data.iterrows():
        description = strip_html(row['description'].strip())
        genres = ' '.join(ast.literal_eval(row['genres']))
        tags_prep = map(lambda tag: (tag["name"]), ast.literal_eval(row["tags"]))
        tags = ' '.join(list(tags_prep))
        studios_prep = map(lambda studio: studio["name"], ast.literal_eval(row["studios"]))
        studios = ' '.join(list(studios_prep))
        combined_text = f"{description} {genres} {tags} {studios}"
        anime_texts.append(combined_text)
    return anime_texts

def prepare_target_soup(target_data):
    target_description = strip_html(target_data["description"].strip())
    target_genres = ' '.join(target_data["genres"])
    target_tags_prep = map(lambda tag: (tag["name"]), target_data["tags"])
    target_tags = ' '.join(list(target_tags_prep))
    target_studios_prep = map(lambda nodes: nodes["name"], target_data["studios"]["nodes"])
    target_studios = ' '.join(list(target_studios_prep))
    target_combined_text = f"{target_description} {target_genres} {target_tags} {target_studios}"
    return target_combined_text

# lda

def recommend_similar_content_lda(anime_data, target_data):
    anime_data = anime_data[anime_data["mean_score"] > 75]
    anime_texts = prepare_anime_soup(anime_data)
    target_combined_text = prepare_target_soup(target_data)
    corpus = anime_texts + [target_combined_text]
    ids = anime_data["id"].tolist()
    vectorizer = CountVectorizer(stop_words='english', lowercase=True)
    matrix = vectorizer.fit_transform(corpus)
    lda = LatentDirichletAllocation(n_components=10, learning_method="online", random_state=0)
    lda_result = lda.fit_transform(matrix)
    similarity_scores = cosine_similarity(lda_result[-1].reshape(1, -1), lda_result[:-1])
    id_sim_dict = dict(zip(ids, similarity_scores.flatten()))
    sorted_dict = dict(sorted(id_sim_dict.items(), key=lambda item: item[1], reverse=True))
    return list(sorted_dict.keys())

# tf-idf

def recommend_similar_content_tfidf(anime_data, target_data):
    anime_data = anime_data[anime_data["mean_score"] > 75]
    anime_texts = prepare_anime_soup(anime_data)
    target_combined_text = prepare_target_soup(target_data)
    corpus = anime_texts + [target_combined_text]
    ids = anime_data["id"].tolist()
    vectorizer = TfidfVectorizer(stop_words='english', lowercase=True)
    matrix = vectorizer.fit_transform(corpus)
    similarity = linear_kernel(matrix[-1], matrix)
    id_sim_dict = dict(zip(ids, similarity[0][:-1]))
    sorted_dict = dict(sorted(id_sim_dict.items(), key=lambda item: item[1], reverse=True))
    return list(sorted_dict.keys())

# collaborative filtering

def generate_synthetic_ratings(average_scores, rating_scale=100, deviation_factor=8, max_rating_amount=100):
    all_ratings = []
    for anime_id, avg_score in average_scores.items():
        deviations = np.random.normal(loc=0, scale=deviation_factor, size=np.random.randint(2, (max_rating_amount + 1)))
        ratings = avg_score + deviations
        ratings = np.clip(ratings, 0, rating_scale)
        ratings_prepared = list(map (lambda rating: int(rating / 10), ratings))
        i = 1
        for rating in ratings_prepared:
            entry = {}
            entry["user_id"] = f'synthethic{i}'
            entry["anime_id"] = str(anime_id)
            entry["rating"] = rating
            all_ratings.append(entry)
            i += 1
    return all_ratings

def recommend_collab(user_ratings, anime_data):
    anime_data = anime_data[anime_data["mean_score"] > 70]
    print(len(anime_data["average_score"]))
    avg_scores = anime_data["average_score"].tolist()
    ids = anime_data["id"].tolist()
    id_score = dict(zip(ids, avg_scores))
    ratings = generate_synthetic_ratings(id_score)
    # for record in ratings:
    #     print(record.items())
    actual_ratings = []
    for rating in user_ratings["ratings"]:
        entry = {}
        entry["user_id"] = str(user_ratings["user_id"])
        entry["anime_id"] = str(rating["content_id"])
        entry["rating"] = rating["rating"]
        actual_ratings.append(entry)
    all_ratings = ratings + actual_ratings
    ratings_df = pd.DataFrame(data=all_ratings, columns=["user_id", "anime_id", "rating"])
    user_anime_table = pd.pivot_table(data=ratings_df, values="rating", columns="anime_id", index="user_id")
    reader = Reader(rating_scale=(0, 100))  
    dataset = Dataset.load_from_df(ratings_df[['user_id', 'anime_id', 'rating']], reader)
    algorithm = SVD()
    # cross_validate(svd, dataset, measures=['RMSE', 'MAE'], cv=5, verbose=True)
    training_set = dataset.build_full_trainset()
    algorithm.fit(training_set)
    anime_not_rated_by_user = user_anime_table.columns[~user_anime_table.loc[str(user_ratings["user_id"])].notna()]
    predictions = []
    for anime_id in anime_not_rated_by_user:
        predicted_rating = algorithm.predict(str(user_ratings["user_id"]), anime_id).est
        predictions.append((anime_id, predicted_rating))
    sorted_preds = sorted(predictions, key=lambda item: item[1], reverse=True)
    return list(map(lambda pred: pred[0], sorted_preds))
    
    


