var host = window.location.host;//127.0.0.1:9000
function reg(){
    console.log(88888,'reg')
    window.location.href = 'http://'+ host +'/reg';
}
function login(){
    console.log(9999,'login')
    window.location.href = 'http://'+ host +'/login';
}
document.querySelector("#reg") && document.querySelector("#reg").addEventListener('click',reg,false)
document.querySelector("#login") && document.querySelector("#login").addEventListener('click',login,false)