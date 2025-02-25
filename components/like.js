import { likes} from "../api.js"
let like = function() {
 
user = localStorage.getItem('user')
  if (user) {
    likes(user.id, postId)
  } else {
    alert("Лайкать посты могут только авторизованные пользователи")
  }
    

for (let likeBtn of document.querySelectorAll(".like-button"))
    likeBtn.addEventListener("click", ( () => {
        
        likes() 
        
    }
    ))
}