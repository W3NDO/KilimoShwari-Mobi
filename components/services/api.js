import axios from 'axios';
/* import { Axios } from "axios";
import {
    AxiosRequestConfig,
    AxiosResponse,
    AxiosError,
} from "axios";
*/
/** Axios Request Object
 * Methods
 *      post(url, headers, data) => (data, headers)
 *      Get(url, headers) => (data, headers)
 *      Put(url, headers, data) => (data, headers)
 *      Delete(url, headers) => (data, headers)
 */

export default class Aro{
    base_url;
    header;

    constructor(base_url, header){
        this.base_url = base_url;
        this.headers = header;
    }

    async post(url, headers, data){
        const response = await axios({
            method: 'post',
            url: this.base_url + url,
            data: data,
            headers: headers
        });
        return response;
    }

    async put(url, headers, data){
        const response = await axios({
            method: 'post',
            url: this.base_url +  url,
            data: data,
            headers: headers
        })
        return response ;
    }

    async delete(url){
        const response = await axios({
            method: 'delete',
            url:this.base_url + url,
            headers: headers
        })
        return response
    }

    async get(url, headers){
        const response = await axios({
            method: 'get',
            url: this.base_url + url,
            headers: headers,
        })
        return response;
    }

}