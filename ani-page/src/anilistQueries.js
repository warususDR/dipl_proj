export const endpoint_url = 'https://graphql.anilist.co'
export const id_query = `
query ($id: Int) { # Define which variables will be used in the query (id)
  Media (id: $id, type: ANIME) { # Insert our variables into the query arguments (id) (type: ANIME is hard-coded in the query)
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
      }
    }
    genres
  }
}
`;
export const all_query = `
query {
    Page(page: 1, perPage: 500) {
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