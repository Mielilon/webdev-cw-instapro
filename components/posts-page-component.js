import { USER_POSTS_PAGE } from "../routes";
import { renderHeaderComponent } from "./header-component";
import { posts, goToPage, getToken } from "../index";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale/ru";
import { setLike, removeLike } from "../api";

/**
 * Рендерит страницу с постами.
 * @param {HTMLElement} appEl - Элемент, в который рендерится страница.
 */
export function renderPostsPageComponent({ appEl }) {
  const postsHtml = posts
    .map((post) => {
      post.likes = post.likes || {};
      post.likes.counter = Number(post.likes.counter) || 0;
      post.isLiked = post.isLiked || false;

      return `
        <li class="post" data-post-id="${post.id}">
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
          <p class="post-date">${formatDistanceToNow(new Date(post.createdAt), {
            addSuffix: true,
            locale: ru,
          })}</p>
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
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }

  function updatePostLikes(postId) {
    const post = posts.find((p) => p.id === postId);
    const postElement = document.querySelector(`[data-post-id="${postId}"]`);
    const likeButton = postElement.querySelector(".like-button");
    const likeText = postElement.querySelector(".post-likes-text");

    if (!postElement || !likeButton || !likeText) return;

    // Обновляем картинку лайка
    likeButton.querySelector("img").src = `./assets/images/${
      post.isLiked ? "like-active" : "like-not-active"
    }.svg`;

    // Обновляем количество лайков
    likeText.innerHTML = `Нравится: <strong>${post.likes.counter}</strong>`;
  }

  // Обработчик кликов на кнопки лайков
  for (let likeButton of document.querySelectorAll(".like-button")) {
    likeButton.addEventListener("click", async (event) => {
      const postId = event.target.closest(".post").dataset.postId;
      const token = getToken();

      if (!token) {
        alert("Вы не авторизованы. Пожалуйста, войдите в систему.");
        return;
      }

      try {
        const post = posts.find((p) => p.id === postId);
        if (!post) return;

        if (post.isLiked) {
          await removeLike(postId, token); // Удаляем лайк
          post.isLiked = false;
          post.likes.counter = Math.max(0, post.likes.counter - 1); // Предотвращаем уход в минус
        } else {
          await setLike(postId, token); // Добавляем лайк
          post.isLiked = true;
          post.likes.counter += 1;
        }

        updatePostLikes(postId);
      } catch (error) {
        console.error("Ошибка при обновлении лайков:", error.message);
      }
    });
  }
}
