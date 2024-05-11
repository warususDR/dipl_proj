import requests
import re
from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
from sklearn.metrics.pairwise import linear_kernel
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.decomposition import LatentDirichletAllocation
import pandas as pd
import ast

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

# content-based recommendation (LDA)

def recommend_similar_content(anime_data, target_data):
    anime_data = anime_data[anime_data["mean_score"] > 75]
    anime_texts = []
    for _, row in anime_data.iterrows():
        description = strip_html(row['description'].strip())
        genres = ' '.join(ast.literal_eval(row['genres']))
        tags_prep = map(lambda tag: (tag["name"] + " " + tag["description"]), ast.literal_eval(row["tags"]))
        tags = ' '.join(list(tags_prep))
        studios_prep = map(lambda studio: studio["name"], ast.literal_eval(row["studios"]))
        studios = ' '.join(list(studios_prep))
        combined_text = f"{description} {tags}"
        anime_texts.append(combined_text)
    target_description = strip_html(target_data["description"].strip())
    target_genres = ' '.join(target_data["genres"])
    target_tags_prep = map(lambda tag: (tag["name"] + " " + tag["description"]), target_data["tags"])
    target_tags = ' '.join(list(target_tags_prep))
    target_studios_prep = map(lambda nodes: nodes["name"], target_data["studios"]["nodes"])
    target_studios = ' '.join(list(target_studios_prep))
    target_combined_text = f"{target_description} {target_tags} "
    corpus = anime_texts + [target_combined_text]
    ids = anime_data["id"].tolist()
    vectorizer = CountVectorizer(stop_words='english', lowercase=True)
    matrix = vectorizer.fit_transform(corpus)
    lda = LatentDirichletAllocation(n_components=50, learning_method="online", batch_size=512, random_state=42)
    # lda.fit(matrix)
    # # Transform target data
    # target_vector = vectorizer.transform([target_combined_text])
    # target_topic_distribution = lda.transform(target_vector)
    # # Calculate similarity based on topic distributions
    # similarities = []
    # for i, text in enumerate(anime_texts):
    #     text_vector = vectorizer.transform([text])
    #     text_topic_distribution = lda.transform(text_vector)
    #     similarity = cosine_similarity(target_topic_distribution, text_topic_distribution)[0][0]
    #     similarities.append((anime_data.iloc[i]["id"], similarity))
    # # Sort similarities
    # sorted_similarities = dict(sorted(similarities, key=lambda x: x[1], reverse=True))
    # # Return sorted anime IDs
    # return list(sorted_similarities.keys())
    lda_result = lda.fit_transform(matrix)
    similarity_scores = cosine_similarity(lda_result[-1].reshape(1, -1), lda_result[:-1])
    id_sim_dict = dict(zip(ids, similarity_scores.flatten()))
    sorted_dict = dict(sorted(id_sim_dict.items(), key=lambda item: item[1], reverse=True))
    return list(sorted_dict.keys())[1:]
    # similarity = linear_kernel(matrix[-1], matrix)
    # id_sim_dict = dict(zip(ids, similarity[0][:-1]))
    # sorted_dict = dict(sorted(id_sim_dict.items(), key=lambda item: item[1], reverse=True))
    # return list(sorted_dict.keys())

    


