import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { renewPosts, posts, goToPage } from '../index.js'
// import { disLikess, likess, getPosts } from "../api.js";
// import { user } from "../index.js";
import { formatDistanceToNow } from "../node_modules/date-fns/formatDistanceToNow.js";
import { ru } from "../node_modules/date-fns/locale/ru.js";
import {  replaceSymbols  } from '../helpers.js'
import { putLike } from '../api.js'
import {user} from '../index.js'
// import { renderUserPostsPageComponent } from "./renderUserPostsPageComponent.js";

export function renderPostsPageComponent({ appEl }) {
  const userId = user ? user._id : null
  console.log("Актуальный список постов:", posts);
  let listOfPosts = posts
  
    .map((post, index) => {
      let formatedCreatedAt = formatDistanceToNow(post.createdAt, {
        locale: ru,
      });

      return `
     <li class="post">
<div class="post-header" data-user-id="${post.user.id}">
    <img src="${post.user.imageUrl}" class="post-header__user-image">
    <p class="post-header__user-name">${replaceSymbols(post.user.name)}</p>
</div>
<div class="post-image-container">
  <img class="post-image" src="${post.imageUrl}">
</div>
<div data-postid="${post.id}" class="post-likes">
  <button  class="like-button">
  
    <img data-likeimg=${post.id} class="like-button"
        ${post.likes.find((likes) => likes.id === userId)
          ? "<img src='./assets/images/like-active.svg'>"
          : "<img src='./assets/images/like-not-active.svg'>"
      }
  </button>
  <p class="post-likes-text">
    Нравится: ${
      post.likes.length === 0
        ? post.likes.length
        : `
      <strong id='likes-${post.id}'>${
            post.likes.length === 1
              ? replaceSymbols(post.likes[0].name)
              : `${replaceSymbols(post.likes[0].name)} и еще ${
                  post.likes.length - 1
                }`
          }</strong>
      `
    }
    

  </p>
</div>
<p class="post-text">
  <span class="user-name">${replaceSymbols(post.user.name)}</span>
  ${post.description}
</p>
<p class="post-date">
${formatedCreatedAt} назад
</p>
</li>`;
    })
    .join("");


  const appHtml = `
    <div class="page-container">
    <div class="header-container"></div>
    <ul class="posts">
    ${listOfPosts}
    </ul>
  </div>`;

  appEl.innerHTML = appHtml;

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

  for (let likeEl of document.querySelectorAll(".post-likes")) {
    let likeBtn = likeEl.querySelector(".like-button");
    likeBtn.addEventListener("click", () => {
  
      let like = likeEl.dataset.postid;
      let currentPost = posts.find(post => post.id === like);
      if (currentPost) {
        let status = currentPost.likes.some(like => like.id === userId);
      putLike(like, status)
        .then((data) => {
          data ? renewPosts({ data }) : "";
        })
        .finally(() => {
          return renderPostsPageComponent({ appEl });
        });
      }
    })
  }
}

