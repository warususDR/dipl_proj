import { user_act_url } from "./backendEndpoints";

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