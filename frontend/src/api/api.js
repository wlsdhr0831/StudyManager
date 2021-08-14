import axios from 'axios';

// const BASE_URL = 'http://tzf.iptime.org';
const BASE_URL = '';

export const sign = async ({ username, userPw }) => (
    await axios.post(`${BASE_URL}/users/login`, { username, userPw })
        .then(() => true)
        .catch(() => false)
)

export const getFires = async ( date ) => (
    await axios.get(`${BASE_URL}/fires`, {
            params: { date: date }
        })
        .then((res) => res.data)
        .catch((e) => {
            throw Error({ message: e.message });
        })
)

export const startFire = async ( username ) => (
    await axios.post(`${BASE_URL}/fires`, username)
        .then(() => true)
        .catch(() => false)
);

export const endFire = async ( username ) => (
    await axios.get(`${BASE_URL}/fires/last`, username)
        .then(() => true)
        .catch(() => false)
);