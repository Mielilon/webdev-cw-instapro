
import { POSTS_PAGE, USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, } from "../index.js";
import { postLike, disLike } from "../api.js";


export function renderPostsPageComponent({ appEl }) {
  // @TODO: реализовать рендер постов из api
  console.log("Актуальный список постов:", posts);

  /**
   * @TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */

  const potsHtml = posts.map((post) => {
    return `
     <li class="post">
                    <div class="post-header" data-user-id=${post.user.id}>
                        <img src=${post.user.imageUrl} class="post-header__user-image">
                        <p class="post-header__user-name">${post.user.name}</p>
                    </div>
                    <div class="post-image-container">
                      <img class="post-image" src=${post.imageUrl}>
                    </div>
                    <div class="post-likes">
                      <button data-post-id=${post.id} data-is-Liked=${post.isLiked} class="like-button">
                        <img src=${post.isLiked ? './assets/images/like-active.svg' : './assets/images/like-not-active.svg'}>
                      </button>
                      <p class="post-likes-text">
                        Нравится: <strong>${post.likes.length}</strong>
                      </p>
                    </div>
                    <p class="post-text">
                      <span class="user-name">${post.user.login}</span>
                      ${post.description}
                    </p>
                    <p class="post-date">
                      ${post.createdAt}
                    </p>
                  </li>`
  })

  const appHtml = `
              <div class="page-container">
                <div class="header-container"></div>
                <ul class="posts">
                   ${potsHtml}
                </ul>
              </div>`;

  appEl.innerHTML = appHtml

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

     for (let userEl of document.querySelectorAll(".post-header")) {
      userEl.addEventListener("click", () => {
        goToPage(USER_POSTS_PAGE, {
          userId: userEl.dataset.userId,
         
        });
       
      });
    }  
 

  for (let button of document.querySelectorAll('.like-button')) {
    button.addEventListener('click', (e) => {
      if (e.target.classList.contains('like-button')) {
        let id = e.target.dataset.postId
        let isLiked = e.target.dataset.isLiked
        console.log('isLiked', isLiked)
        
        if (isLiked === 'true') {
          disLike(id).then((user) => 
          goToPage(POSTS_PAGE)
        )
        } else {
          postLike(id).then((user) =>  goToPage(POSTS_PAGE))
        }
      }



    })
  }

}


