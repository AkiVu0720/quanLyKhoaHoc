let userLogin = [
{
    "email":"akivu@gmail.com",
    "password":"123456"
},
{
    "email":"akivu2@gmail.com",
    "password":"123456"
},
{
    "email":"akivu3@gmail.com",
    "password":"123456"
}
]

console.log(localStorage.getItem("userLogin",JSON.stringify(userLogin))
);
localStorage.setItem("userLogin",JSON.stringify(userLogin))


function Dom (id){
return document.getElementById(id)
}


function isUser(email,password){
        
        let listUser = localStorage.getItem("userLogin") ? JSON.parse(localStorage.getItem("userLogin")) : [];
        for (let index = 0; index < listUser.length; index++) {
            if(email == listUser[index].email && password == listUser[index].password ){
                return true
            }
        };
        console.log("ket qua sai")
        return false
}

function login (){
    let listData = localStorage.getItem("userLogin") ? JSON.parse(localStorage.getItem("userLogin")) : [];
    let ipEmail = Dom("email").value
    let ipPassword = Dom("password").value
    let checkUser = isUser(ipEmail,ipPassword)
    if(checkUser){
        window.location.href = "dashboard.html"
    }else{
       Dom('mes').style.visibility = 'visible';
       Dom("email").value= "";
       Dom("password").value = "";
    }
}



Dom("btn_login").addEventListener("click", function (e) {
   e.preventDefault()
    login()
})

Dom("email").oninput = function(){
    Dom('mes').style.visibility = 'hidden';
}
Dom("password").oninput = function(){
    Dom('mes').style.visibility = 'hidden';
}



