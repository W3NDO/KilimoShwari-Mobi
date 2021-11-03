import Aro from './api.js';
let aro = new Aro("https://love-on-fire.herokuapp.com", {});
// let aro = new Aro("https://dc74-102-68-77-130.ngrok.io", {});

export default class Calls{
    //private vars.
    #login_url = "/api/v1/auth";
    #sign_up_url = "/users";
    #logout_url = "/users/sign_out";
    #love_actions_url = "/api/v1/love_actions"
    #user_love_actions_url = "/api/v1/user_love_actions"
    #love_tanks = "api/v1/love_tanks"  //may need to be augmented to also take an ID param
    #headers = {
        authorization: null
    }

    /** User Login / Logout / Sign Up */
    async login(data){
        try{
            let response = await aro.post(this.#login_url, {}, data);
            //console.log(response);
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
            //console.log(e);
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
            console.log(e);
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

    //LoveActions && User Love actions
    async getLoveActions(){
      try{
        let response = await aro.get(this.#love_actions_url, this.#headers);
        if (response.status != 200 || response.status != 304){
          throw new Error(response);
        }
        return{
            data: response.data.data
        }
      } catch(e){
        let status_code = e.response.status;
        console.log("Status Code: ", status_code);
        console.log(e.message);
        return {
            status: "failure",
            status_code: e.response.status
        };
      }
    }


    async post(data, url){
        let response = await aro.post(url, this.#headers, data );
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

    async get( url){
        let response = await aro.get(url, this.#headers);
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
        this.#headers.authorization = response['token'];
    }


    async get_headers(){
        return {
            auth: this.#headers.authorization,
        }
    }

}


// let data = {
//     email: "email@example.com",
//     password : "foobar123"
// }
// let call = new Calls();
// let res = await call.login(data);
// console.log(res);

