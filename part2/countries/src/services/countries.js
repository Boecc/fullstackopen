import axios from "axios";
const baseURL = 'https://studies.cs.helsinki.fi/restcountries/'
const getAll = () => {
    return axios.get(`${baseURL}/api/all`)
}

export default getAll