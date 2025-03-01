import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage } from "../index.js";
import { token } from "../api.js";
import { user } from "../index.js";
import { likeBtn } from "./posts-page-component.js";

export function renderUserPostsPageComponent({ appEl }) {
  console.log("Актуальный список постов:", posts);

  const appHtml = posts
  
    .map(
      (post) =>
        `
     
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
                  post.likes.find((likes) => likes._id === user._id)
                    ? '<img src="./assets/images/like-active.svg">'
                    : '<img src="./assets/images/like-not-active.svg">'
                }
                </button>
                <p class="post-likes-text">
                  Нравится: <strong>${
                    post.likes.length > 0 ? post.likes[0].name : "0"
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
              <p class="post-date">
                19 минут назад
              </p>
            </li>`
    )
    .join("");
  const userHtml = `
 <div class="page-container">
        <div class="header-container"></div>
        
            ${
              token && posts[0]
                ? `
            <div class="posts-user-header">
                <img src="${posts[0].user.imageUrl}" class="posts-user-header__user-image">
                <p class="posts-user-header__user-name">${posts[0].user.name}</p>
            </div>`
                : ""
            }
            ${posts.length === 0 ? "Постов нет" : ""}
           
           <ul class="posts">
                
                ${appHtml}
            </ul>
            
        </div>`;
  appEl.innerHTML = userHtml;

  for (let header of document.querySelectorAll(".post-header")) {
    header.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: header.dataset.userId,
      
      });

      
    });

    likeBtn()

  }

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });
}
