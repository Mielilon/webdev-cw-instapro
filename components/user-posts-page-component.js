import { getPosts } from "../api.js";
import { renderHeaderComponent } from "./header-component.js";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale/ru";
import { goToPage, getToken } from "../index.js";

export function renderUserPostsPageComponent({ appEl, userId, user }) {
  appEl.innerHTML = "Загрузка постов...";

  const token = getToken();

  getPosts({ token })
    .then((posts) => {
      const userPosts = posts.filter((post) => post.user.id === userId);

      const postsHtml = userPosts
        .map((post) => {
          post.likes.counter = Number(post.likes.counter) || 0;

          return `
              <li class="post">
                <div class="post-header" data-user-id="${post.user.id}">
                    <img src="${
                      post.user.imageUrl
                    }" class="post-header__user-image" alt="${post.user.name}">
                    <p class="post-header__user-name">${post.user.name}</p>
                </div>
                <div class="post-image-container">
                  <img class="post-image" src="${
                    post.imageUrl
                  }" alt="Изображение поста">
                </div>
                <div class="post-likes">
                  <button data-post-id="${post.id}" class="like-button">
                    <img src="./assets/images/${
                      post.isLiked ? "like-active" : "like-not-active"
                    }.svg" alt="Кнопка лайка">
                  </button>
                  <p class="post-likes-text">
                    Нравится: <strong>${post.likes.counter}</strong>
                  </p>
                </div>
                <p class="post-text">
                  <span class="user-name">${post.user.name}</span>
                  ${post.text}
                </p>
                <p class="post-date">${formatDistanceToNow(
                  new Date(post.createdAt),
                  {
                    addSuffix: true,
                    locale: ru,
                  }
                )}</p>
              </li>`;
        })
        .join("");

      appEl.innerHTML = `
          <div class="page-container">
            <div class="header-container"></div>
            <ul class="posts">
              ${postsHtml}
            </ul>
          </div>`;

      renderHeaderComponent({
        element: document.querySelector(".header-container"),
        user,
      });

      document.querySelectorAll(".post-header").forEach((userEl) => {
        userEl.addEventListener("click", () => {
          goToPage(USER_POSTS_PAGE, { userId: userEl.dataset.userId });
        });
      });
    })
    .catch((error) => {
      console.error("Ошибка загрузки постов пользователя:", error);
      appEl.innerHTML = "Ошибка при загрузке постов.";
    });
}
