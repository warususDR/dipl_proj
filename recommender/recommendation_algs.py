import requests
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel

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
def strip_html(html):
    return re.sub('<[^<]+?>', '', html)


def fetch_best_anime(page):
    response = requests.post(anilist_api_url, json={"query": top_score_anime_query, "variables": {"page": page}})
    response_data = response.json()
    if response.ok and 'data' in response_data:
        return response_data['data']['Page']['media']
    else:
        print(f"Error fetching trending anime: {response_data}")
        return []

# knowledge-based recommendation    

def recommend_by_genres(anime_data, pref_genres):
    recommended_ids = []
    for anime in anime_data:
        if set(anime["genres"]).intersection(pref_genres):
            recommended_ids.append(anime["id"])
    return recommended_ids

# content-based recommendation

def recommend_by_description(anime_data, description):
    descriptions = list(map(lambda anime: strip_html(anime["description"].strip()), anime_data))
    ids = list(map(lambda anime: anime["id"], anime_data))
    descriptions.append(description)
    vectorizer = TfidfVectorizer(stop_words="english")
    matrix = vectorizer.fit_transform(descriptions)
    similarity = linear_kernel(matrix[-1], matrix)
    id_sim_dict = dict(zip(ids, similarity[0][:-1]))
    sorted_dict = dict(sorted(id_sim_dict.items(), key=lambda item: item[1], reverse=True))
    return list(sorted_dict.keys())
