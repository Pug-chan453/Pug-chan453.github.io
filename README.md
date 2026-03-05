<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>DarkNet Social</title>
<style>
body{margin:0;font-family:Arial;background:#0f0f10;color:#e6e6e6}
header{background:#1b1b1d;padding:15px;font-weight:bold;border-bottom:1px solid #333}
.container{max-width:700px;margin:auto;padding:20px}
.card{background:#1b1b1d;padding:15px;border-radius:10px;margin-bottom:15px}
input,textarea{width:100%;padding:8px;margin-top:5px;background:#2a2a2d;border:none;color:white;border-radius:6px}
button{margin-top:10px;padding:8px 14px;background:#5865f2;border:none;border-radius:6px;color:white;cursor:pointer}
.post{border-top:1px solid #333;padding-top:10px;margin-top:10px}
.username{font-weight:bold}
.actions{margin-top:8px;font-size:14px;color:#aaa;cursor:pointer}
.comment{font-size:14px;margin-top:4px}
.hidden{display:none}
</style>
</head>
<body>
<header>🌙 DarkNet Social</header>

<div class="container">

<div id="loginCard" class="card">
<h3>Login / Cadastro</h3>
<input id="username" placeholder="Nome de usuário">
<button onclick="login()">Entrar</button>
</div>

<div id="app" class="hidden">

<div class="card">
<textarea id="postText" placeholder="O que você está pensando?"></textarea>
<button onclick="createPost()">Postar</button>
</div>

<div id="feed"></div>

</div>

</div>

<script>
let currentUser=null
let posts=JSON.parse(localStorage.getItem("posts")||"[]")

function login(){
const name=document.getElementById("username").value.trim()
if(!name)return
currentUser=name
localStorage.setItem("user",name)
document.getElementById("loginCard").classList.add("hidden")
document.getElementById("app").classList.remove("hidden")
render()
}

function createPost(){
const text=document.getElementById("postText").value.trim()
if(!text)return
const post={
user:currentUser,
text:text,
likes:0,
comments:[]
}
posts.unshift(post)
save()
document.getElementById("postText").value=""
render()
}

function likePost(i){
posts[i].likes++
save()
render()
}

function addComment(i){
const input=document.getElementById("c"+i)
const txt=input.value.trim()
if(!txt)return
posts[i].comments.push({user:currentUser,text:txt})
input.value=""
save()
render()
}

function save(){
localStorage.setItem("posts",JSON.stringify(posts))
}

function render(){
const feed=document.getElementById("feed")
feed.innerHTML=""

posts.forEach((p,i)=>{
const div=document.createElement("div")
div.className="card"

let commentsHTML=""
p.comments.forEach(c=>{
commentsHTML+=`<div class='comment'><b>${c.user}:</b> ${c.text}</div>`
})

div.innerHTML=`
<div class='username'>${p.user}</div>
<div class='post'>${p.text}</div>
<div class='actions' onclick='likePost(${i})'>❤️ ${p.likes} Curtidas</div>

<input id='c${i}' placeholder='Comentar'>
<button onclick='addComment(${i})'>Enviar</button>

${commentsHTML}
`

feed.appendChild(div)
})
}

// auto login
const savedUser=localStorage.getItem("user")
if(savedUser){
currentUser=savedUser
document.getElementById("loginCard").classList.add("hidden")
document.getElementById("app").classList.remove("hidden")
render()
}
</script>

</body>
</html>
