export const endpoint_url = 'https://graphql.anilist.co'
export const id_query = `
query ($id: Int) { 
  Media (id: $id, type: ANIME) { 
    id
    title {
      romaji
      english
      native
    }
    coverImage {
      extraLarge
    }
    description(asHtml: false)
    trailer {
      id
      site
      thumbnail
    }
    studios(isMain: true) {
      nodes {
        name
      }
    }
    characters {
      nodes {
        name {
          full
        }
        image {
          large
        }
      }
    }
    genres
    seasonYear
    status
    episodes
    source
    tags {
      id
      name
      description
    }
  }
}
`;
export const popular_query = `
query {
    Page(page: 1, perPage: 25) {
        media(type: ANIME, sort: POPULARITY_DESC) {
            id
            title {
              english
            }
            coverImage {
              large
            }
            description
            trailer {
                id
                site
                thumbnail
            }
            studios(isMain: true) {
                nodes {
                    name
                }
            }
            characters {
                nodes {
                    name {
                        full
                    }
                }
            }
        }
    }
}
`;
export const all_query = `
query ($page: Int) {
    Page(page: $page, perPage: 50) {
        pageInfo {
          total
        }
        media(type: ANIME, sort: TRENDING_DESC) {
            id
            title {
              romaji
              english
            }
            coverImage {
              large
            }
        }
    }
}
`;
export const ids_query = `
query ($ids: [Int]) {
  Page {
     media(id_in: $ids) {
      id
      title {
          romaji
          english
      }
      coverImage {
          large
      }
      description(asHtml: false)
      studios(isMain: true) {
        nodes {
          name
        }
      }
      genres
      tags {
        id
        name
        description
      }
    }  
  }
}
`;
export const search_query = `
    query($search: String) {
        Page(page: 1, perPage: 10) {
            media(search: $search, type: ANIME, isAdult: false) {
                id
                title {
                    romaji
                    english
                }
                coverImage {
                    large
                }
            }
        }
    }
`;
export const genres_query = `
    query {
        GenreCollection
    }
`;