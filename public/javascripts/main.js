var host = window.location.host;//127.0.0.1:9000
function reg(){
    console.log(88888,'reg')
    window.location.href = 'http://'+ host +'/reg';
}
function login(){
    console.log(9999,'login')
    window.location.href = 'http://'+ host +'/login';
}
function post(){//博客发表页面
    console.log(9999,'post')
    window.location.href = 'http://'+ host +'/post';
}
function logout(){
    console.log(9999,'logput')
    window.location.href = 'http://'+ host +'/logout';
}
function seePersonalBlog(){//点击个人所有博客
    window.location.href = 'http://'+ host +'?seepersonalBlog=true';
}
function allBlog(){//查看所有博客
    window.location.href = 'http://'+ host;
}
document.querySelector("#reg") && document.querySelector("#reg").addEventListener('click',reg,false)
document.querySelector("#login") && document.querySelector("#login").addEventListener('click',login,false)
document.querySelector("#post") && document.querySelector("#post").addEventListener('click',post,false)
document.querySelector(".logout") && document.querySelector(".logout").addEventListener('click',logout,false)
document.querySelector("#personalBlog") && document.querySelector("#personalBlog").addEventListener('click',seePersonalBlog,false)
document.querySelector("#allBlog") && document.querySelector("#allBlog").addEventListener('click',allBlog,false)
