import { user_act_url } from "./backendEndpoints";
import { endpoint_url, ids_query } from "./anilistQueries";

export const stripHtml = html => {
    let doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
};
export const updateAction = (content_id, action_id) => {
    fetch(user_act_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
        },
        body: JSON.stringify({ content_id, action_id }) 
        }).then(res => {
            return res.json()
        }).then(data => {
            if(data.hasOwnProperty('error')) {
                console.log(data.error);
            }
        }).catch(err => {
            console.error('Error occured', err);
        }
    )
};

export const fetchAnimeByIds = (anime_ids, setFunc) => {
        fetch(endpoint_url, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'},
            body: JSON.stringify({
            query: ids_query,
            variables: { ids: anime_ids }
            })
        },
        )
        .then((response) => {return response.json().then(function (json) {
        return response.ok ? json : Promise.reject(json);
        });})
        .then((response) => {
            setFunc(response.data.Page.media);
        }).catch(error => console.error('Error occured!', error))
    };