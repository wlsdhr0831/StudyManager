import axios from 'axios';

const BASE_URL = 'http://tzf.iptime.org';

export const sign = async ({ username, userPw }) => (
    await axios.post(`${BASE_URL}/users/login`, { username, userPw })
        .then(() => true)
        .catch(() => false)
)