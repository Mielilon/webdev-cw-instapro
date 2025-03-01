import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, getToken} from "../index.js";
import { disLikess, likess, getPosts } from "../api.js";
import { user } from "../index.js";
import { renderUserPostsPageComponent } from "./renderUserPostsPageComponent.js";

export function renderPostsPageComponent({ appEl }) {
  debugger
  console.log("Актуальный список постов:", posts);
  const appHtml = posts
    .map((post) => {
      return `
      <div class="page-container">
        <div class="header-container"></div>
          <ul class="posts">
            <li class="post">
              <div class="post-header" data-user-id="${post.user.id}">
                  <img src="${
                    post.user.imageUrl
                  }" class="post-header__user-image">
                  <p class="post-header__user-name">${post.user.name}</p>
              </div>
              <div class="post-image-container">
                <img class="post-image" src="${post.imageUrl}">
              </div>
              <div class="post-likes">
                <button data-post-id="${post.id}" class="like-button">
                ${
                  post.likes.find((likes) => likes.id === user._id)
                    ? '<img src="./assets/images/like-active.svg">'
                    : '<img src="./assets/images/like-not-active.svg">'
                }
                </button>
                <p class="post-likes-text">
                  Нравится: <strong>${
                    post.likes.length > 0 ? post.likes[0].name : post.user.name
                  }</strong>
                  ${
                    post.likes.length > 1
                      ? "и еще " + (post.likes.length - 1)
                      : ""
                  }
                </p>
              </div>
              <p class="post-text">
                <span class="user-name">${post.user.name}</span>
                ${post.description}
                </p>
              <p class="post-date">${post.createdAt}</p>
            </li>
          </ul>
      </div>`;
    })
    .join("");

  appEl.innerHTML = appHtml;

  likeBtn(appEl);
  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  document.querySelectorAll(".post-header").forEach((userEl) => {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  });
}

export function likeBtn(appEl) {
  document.querySelectorAll(".like-button").forEach((likeButton) => {
    likeButton.addEventListener("click", async () => {
      
      const postId = likeButton.getAttribute("data-post-id");
      console.log(likeButton);
      console.log(likeButton.innerHTML);

      if (
        likeButton.innerHTML.trim() ===
        '<img src="./assets/images/like-active.svg">'
      ) {
        disLikess({ postId, token: getToken() });
        likeButton.innerHTML =
          '<img src="./assets/images/like-not-active.svg">';
      } else {
        likess({ postId, token: getToken() });
        likeButton.innerHTML = '<img src="./assets/images/like-active.svg">';
      }

      // Получаем обновленный список постов
      debugger
      const newPosts = getPosts({ token: getToken() });
      updatePosts(newPosts); // Использование функции обновления
      // if(USER_POSTS_PAGE) {
      // renderUserPostsPageComponent({appEl})
      // }else {
        
        renderPostsPageComponent({ appEl })

      // }
    });
  });
}
export function updatePosts(newPosts) {
  posts.length = 0; // Очищаем текущий массив
  posts.push(newPosts); // Добавляем новые посты
}
