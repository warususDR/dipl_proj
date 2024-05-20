import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel, cosine_similarity
from surprise import Reader, Dataset, KNNBasic
import pandas as pd
import ast
import numpy as np
import joblib
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
import json

stop_words = set(stopwords.words("english"))
lemmatizer = WordNetLemmatizer()
    
def strip_html(html):
    text = re.sub('<[^<]+?>', '', html)
    return re.sub(r'\s+', ' ', text)

def preprocess_corpus(text):
    text = text.lower()
    text = re.sub(r'\W', ' ', text)
    tokens = word_tokenize(text)
    english_words = [token for token in tokens if len(token) > 2 and token not in stop_words]
    tokens = [lemmatizer.lemmatize(word) for word in english_words] 
    return ' '.join(tokens)
    
def prepare_anime_set():
    anime_set = pd.read_csv("anilist_dataset.csv")
    filtered_anime_set = anime_set[
        (anime_set["description"].notna()) & 
        (anime_set["genres"].notna() & anime_set["genres"].apply(lambda x: x != "[]")) &  
        (anime_set["status"].notna() & ~anime_set["status"].isin(["CANCELLED", "NOT_YET_RELEASED"])) &
        (anime_set["mean_score"].notna()) &
        (anime_set["average_score"].notna()) &
        (anime_set["tags"].notna() & anime_set["tags"].apply(lambda x: x != "[]")) &
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
    anime_data["cleaned_description"] = anime_data["description"].apply(lambda html_desc: strip_html(html_desc.strip()))
    descriptions = anime_data["cleaned_description"].tolist()
    descriptions.append(description)
    ids = anime_data["id"].tolist()  
    vectorizer = TfidfVectorizer(stop_words="english", lowercase=True, max_df=0.90, min_df=2)
    matrix = vectorizer.fit_transform(descriptions)
    similarity = linear_kernel(matrix[-1], matrix[:-1])
    id_sim_dict = dict(zip(ids, similarity.flatten()))
    sorted_dict = dict(sorted(id_sim_dict.items(), key=lambda item: item[1], reverse=True))
    return list(sorted_dict.keys())

# content-based recommendation for items

def prepare_anime_soup(anime_data):
    anime_texts = []
    for _, row in anime_data.iterrows():
        description = strip_html(row["description"].strip())
        genres = ' '.join(ast.literal_eval(row["genres"]))
        tags_prep = map(lambda tag: tag["name"], ast.literal_eval(row["tags"]))
        tags = ' '.join(list(tags_prep))
        studios_prep = map(lambda studio: studio["name"], ast.literal_eval(row["studios"]))
        studios = ' '.join(list(studios_prep))
        combined_text = f"{description} {genres} {tags} {studios}"
        anime_texts.append(combined_text)
    return anime_texts

def prepare_target_soup(target_data):
    target_description = strip_html(target_data["description"].strip())
    target_genres = ' '.join(target_data["genres"])
    target_tags_prep = map(lambda tag: tag["name"], target_data["tags"])
    target_tags = ' '.join(list(target_tags_prep))
    target_studios_prep = map(lambda nodes: nodes["name"], target_data["studios"]["nodes"])
    target_studios = ' '.join(list(target_studios_prep))
    target_combined_text = f"{target_description} {target_genres} {target_tags} {target_studios}"
    return target_combined_text

# lda

def display_topics(model, feature_names, num_top_words):
    for topic_idx, topic in enumerate(model.components_):
        print(f"Topic {topic_idx}:")
        print(" ".join([feature_names[i] for i in topic.argsort()[:-num_top_words - 1:-1]]))


def recommend_similar_content_lda(anime_data, target_data, model_path='anime_lda.pkl', vectorizer_path='anime_count.pkl'):
    anime_data = anime_data[anime_data["mean_score"] > 75]
    target_tag = list(map(lambda tag: tag["name"], target_data["tags"]))
    corpus = []
    with open('preprocessed_corpus.txt', 'r', encoding='utf-8') as f:
        corpus = f.read().split('\n')
    corpus += [preprocess_corpus(' '.join(target_tag))]
    ids = anime_data["id"].tolist()
    vectorizer = joblib.load(vectorizer_path)
    lda = joblib.load(model_path)
    matrix = vectorizer.transform(corpus)
    lda_result = lda.transform(matrix)
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
    vectorizer = TfidfVectorizer(stop_words='english', lowercase=True, max_df=0.90, min_df=2)
    matrix = vectorizer.fit_transform(corpus)
    similarity = linear_kernel(matrix[-1], matrix[:-1])
    id_sim_dict = dict(zip(ids, similarity.flatten()))
    sorted_dict = dict(sorted(id_sim_dict.items(), key=lambda item: item[1], reverse=True))
    return list(sorted_dict.keys())

# collaborative filtering

def generate_synthetic_ratings(average_scores, rating_scale=100, deviation_factor=12, max_rating_amount=50):
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

def find_similar_anime(user_ratings, rated_anime, anime_data):
    high_rated = list(filter(lambda entry: entry["rating"] > 6, user_ratings["ratings"]))
    high_rated = sorted(high_rated, key=lambda item: item["updatedAt"], reverse=True)
    if not high_rated:
        return None
    else:
        if len(high_rated) > 5:
            high_rated = high_rated[:5]
    ids = list(map(lambda entry: entry["content_id"], high_rated))
    interesting_anime = list(filter(lambda entry: str(entry["id"] )in ids, rated_anime))
    similar_ids = []
    for anime in interesting_anime:
       similar_ids += recommend_similar_content_tfidf(anime_data, anime)[:20]
    return list(map(lambda id: str(id), set(similar_ids)))
        
def recommend_collab(user_ratings, rated_anime, anime_data):
    similar_anime_ids = find_similar_anime(user_ratings, rated_anime, anime_data)    
    ratings = []
    with open('synthethic_ratings.txt', 'r', encoding='utf-8') as f:
        ratings = json.load(f)
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
    algorithm = KNNBasic(sim_options={'user_based': True})
    training_set = dataset.build_full_trainset()
    algorithm.fit(training_set)
    anime_to_predict = user_anime_table.columns[~user_anime_table.loc[str(user_ratings["user_id"])].notna()]
    if similar_anime_ids:
        anime_to_predict = list(filter(lambda anime_id: anime_id in similar_anime_ids, anime_to_predict))
    predictions = []
    for anime_id in anime_to_predict:
        predicted_rating = algorithm.predict(str(user_ratings["user_id"]), anime_id).est
        predictions.append((anime_id, predicted_rating))
    sorted_preds = sorted(predictions, key=lambda item: item[1], reverse=True)
    return list(map(lambda pred: pred[0], sorted_preds))

# used code

# anime_tags = list(map(lambda tag: ast.literal_eval(tag), anime_data["tags"].tolist()))
# all_tags = []
# for tag_list in anime_tags:
#     curr_tags = list(map(lambda tag: tag["name"], tag_list))
#     all_tags.append(' '.join(curr_tags))
# corpus = list(map(lambda item: preprocess_corpus(item), corpus))

# vectorizer = CountVectorizer(max_df=0.90, min_df=3)
# matrix = vectorizer.fit_transform(corpus)
# lda = LatentDirichletAllocation(n_components=15, learning_method="online", random_state=0, learning_decay=0.7)
# lda.fit(matrix)
# lda_result = lda.transform(matrix)
# joblib.dump(vectorizer, vectorizer_path)
# joblib.dump(lda, model_path)

#anime_data = anime_data[anime_data["average_score"] > 70]
    # avg_scores = anime_data["average_score"].tolist()
    # ids = anime_data["id"].tolist()
    # id_score = dict(zip(ids, avg_scores))
    # ratings = generate_synthetic_ratings(id_score)
# cross_validate(svd, dataset, measures=['RMSE', 'MAE'], cv=5, verbose=True)
    
    


