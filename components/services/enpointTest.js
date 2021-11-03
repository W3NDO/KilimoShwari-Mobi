import Calls from './data';

let call = new Calls();
user = {
  "email": "email@example.com",
  "password": "foobar123"
}
call.login(user);
let res = await call.getLoveActions();
console.log(res);
