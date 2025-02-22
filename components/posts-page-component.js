import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { goToPage } from "../index.js";
import { getPosts } from "../api.js";
/* import { formatDistanceToNow } from "date-fns";  // Для форматирования времени */

export function renderPostsPageComponent({ appEl, token }) {
  // @TODO: реализовать рендер постов из api

  getPosts({ token })
    .then((posts) => {
      // Формируем HTML для каждого поста
      const postsHtml = posts
        .map((post) => {
          // Форматируем дату создания поста
          const timeAgo = formatDistanceToNow(new Date(post.createdAt), {
            addSuffix: true,
          });

          return `
          <li class="post">
            <div class="post-header" data-user-id="${post.userId}">
              <img src="${
                post.user.imageUrl
              }" class="post-header__user-image" alt="${post.user.name}">
              <p class="post-header__user-name">${post.user.name}</p>
            </div>
            <div class="post-image-container">
              <img class="post-image" src="${post.imageUrl}" alt="Post image">
            </div>
            <div class="post-likes">
              <button data-post-id="${post.id}" class="like-button">
                <img src="${
                  post.likedByUser
                    ? "./assets/images/like-active.svg"
                    : "./assets/images/like-not-active.svg"
                }">
              </button>
              <p class="post-likes-text">
                Нравится: <strong>${post.likes}</strong>
              </p>
            </div>
            <p class="post-text">
              <span class="user-name">${post.user.name}</span>
              ${post.text}
            </p>
            <p class="post-date">
              ${timeAgo}
            </p>
          </li>
        `;
        })
        .join(""); // Объединяем все посты в одну строку

      const appHtml = `
        <div class="page-container">
          <div class="header-container"></div>
          <ul class="posts">
            ${postsHtml}
          </ul>
        </div>
      `;

      appEl.innerHTML = appHtml;

      renderHeaderComponent({
        element: document.querySelector(".header-container"),
      });

      // Добавляем обработчики кликов на каждого пользователя
      for (let userEl of document.querySelectorAll(".post-header")) {
        userEl.addEventListener("click", () => {
          goToPage(USER_POSTS_PAGE, {
            userId: userEl.dataset.userId,
          });
        });
      }
    })
    .catch((error) => {
      console.error("Ошибка при загрузке постов:", error);
      appEl.innerHTML = `<p>Произошла ошибка при загрузке постов.</p>`;
    });
}
