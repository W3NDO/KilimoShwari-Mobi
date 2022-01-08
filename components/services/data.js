import Aro from './api.js';

let aro = new Aro("https://kilimo-shwari-2.herokuapp.com", {});
// let aro = new Aro("https://ba66-102-68-77-130.ngrok.io", {});


export default class Calls{
    //private vars.
    #login_url = "/api/v1/auth";
    #sign_up_url = "/users";
    #logout_url = "/users/sign_out";
    #all_policies_url = '/api/v1/policies'; //GET && POST
    #headers = {
        Authorization: null
    }

    /** User Login / Logout / Sign Up */
    async login(data){
        try{
            let response = await aro.post(this.#login_url, {}, data);
            
            if (response.status !== 200){
                throw new Error(response)
            }
            this.update_headers(response.data);
            return {
                status: "success",
                status_code: response.status,
                data: response.data
            };

        } catch(e){
            console.error(e);
            let status_code = e.response.status;
            console.log("Status Code: ", status_code);
            console.log(e.message);
            return {
                status: "failure",
                status_code: e.response.status
            };
        }
    }

    async sign_up(data){               
        try{
            let response = await aro.post(this.#sign_up_url, {}, data);
            console.log(response);
            this.update_headers(response);
            if (response.status !== 200){
                Alert.alert("Oopsie Woopsie UwU");
                throw new Error(response)
            }
            return {
                status: "success",
                status_code: response.status,
                data: response.data
            };

        } catch(e){
            console.error(e);
            let status_code = e.response.status;
            console.log("Status Code: ", status_code);
            console.log(e.message);
            return {
                status: "failure",
                status_code: e.response.status
            };
        }
    }

    async logout(){
        let response = await aro.delete(this.#logout_url);
        return{
            status: response.status,
            data: response.data
        }
    }


    async post(data, url){
        let response = await aro.post(url, this.#headers, data );
        if (response.status == 200){
            return {
                status: "success",
                status_code: response.status,
                data: response.data
            };
        } else {
            return {
                status: response.status
            }
        }
    }

    async get(url){
        let response = await aro.get(url, this.#headers);
        if (response.status == 200){
            return {
                status: "success",
                status_code: response.status,
                data: response.data
            };
        } else {
            return {
                status: response.status
            }
        }
    }

    async getPolicies(token){
        // this.#headers.Authorization = token;
        console.log("Get policies ",this.#headers.Authorization)
        res = await this.get(this.#all_policies_url);
        console.log(res)
        return res
    }

    async buyPolicy(data){
        console.log(this.#headers.Authorization)
        res = await this.post(data, this.#all_policies_url)
        console.log(res)
        return res
    }

    async put(data, url){
        let response = await aro.put(url, this.#headers, data );
        if (response.statusText == 'OK'){
            this.update_headers(response);
            return {
                status: response.status,
                data: response.data
            }
        } else {
            return {
                status: response.status
            }
        }
    }

    update_headers(response){
        this.#headers.Authorization = response['token'];
    }


    get_headers(){
        return this.#headers
    }

}