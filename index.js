import { getPosts, postsHost, token } from "./api.js";
import { renderAddPostPageComponent } from "./components/add-post-page-component.js";
import { renderAuthPageComponent } from "./components/auth-page-component.js";
import {
  ADD_POSTS_PAGE,
  AUTH_PAGE,
  LOADING_PAGE,
  POSTS_PAGE,
  USER_POSTS_PAGE,
} from "./routes.js";
import { renderPostsPageComponent } from "./components/posts-page-component.js";
import { renderLoadingPageComponent } from "./components/loading-page-component.js";
import {
  getUserFromLocalStorage,
  removeUserFromLocalStorage,
  saveUserToLocalStorage,
} from "./helpers.js";
import { userPosts } from "./api.js";
import { renderUserPostsPageComponent } from "./components/renderUserPostsPageComponent.js";

export let user = getUserFromLocalStorage();
export let page = null;
export let posts = [];

const getToken = () => {
  const token = user ? `Bearer ${user.token}` : undefined;
  return token;
};

export const logout = () => {
  user = null;
  removeUserFromLocalStorage();
  goToPage(POSTS_PAGE);
};

/**
 * Включает страницу приложения
 */
export const goToPage = (newPage, data) => {
  if (
    [
      POSTS_PAGE,
      AUTH_PAGE,
      ADD_POSTS_PAGE,
      USER_POSTS_PAGE,
      LOADING_PAGE,
    ].includes(newPage)
  ) {
    if (newPage === ADD_POSTS_PAGE) {
      /* Если пользователь не авторизован, то отправляем его на страницу авторизации перед добавлением поста */
      page = user ? ADD_POSTS_PAGE : AUTH_PAGE;
      return renderApp();
    }

    if (newPage === POSTS_PAGE) {
      page = LOADING_PAGE;
      renderApp();

      return getPosts({ token: getToken() })
        .then((newPosts) => {
          page = POSTS_PAGE;
          posts = newPosts;
          renderApp();
        })
        .catch((error) => {
          console.error(error);
          goToPage(POSTS_PAGE);
        });
    }

    if (newPage === USER_POSTS_PAGE) {
      // @@TODO: реализовать получение постов юзера из API
      page = LOADING_PAGE;
      renderApp();
      console.log("Открываю страницу пользователя: ", data.userId);
      console.log(data.userId);
      // let userId = data.userId;
      return userPosts({ userId:data.userId })
        .then((userPost) => {
          page = USER_POSTS_PAGE;
          posts = userPost;
          renderApp();
        })
        .catch((error) => {
          console.error(error);
          goToPage(USER_POSTS_PAGE);
        });
    }
  }

  page = newPage;
  renderApp();

  return;
};

//   throw new Error("страницы не существует");
// };

export const renderApp = () => {
  const appEl = document.getElementById("app");
  if (page === LOADING_PAGE) {
    return renderLoadingPageComponent({
      appEl,
      user,
      goToPage,
    });
  }

  if (page === AUTH_PAGE) {
    return renderAuthPageComponent({
      appEl,
      setUser: (newUser) => {
        user = newUser;
        saveUserToLocalStorage(user);
        goToPage(POSTS_PAGE);
      },
      user,
      goToPage,
    });
  }

  if (page === ADD_POSTS_PAGE) {
    return renderAddPostPageComponent({
      appEl,
      onAddPostClick({ description, imageUrl }) {
        // @TODO: реализовать добавление поста в API
        console.log("Добавляю пост...", { description, imageUrl });
        // Отправка поста на сервер
        fetch(postsHost, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // добавляем токен авторизации, если он есть
          },
          body: JSON.stringify({ description, imageUrl }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Ошибка при добавлении поста");
            }
            return response.json();
          })
          .then((data) => {
            console.log("Пост добавлен:", data);
            goToPage(POSTS_PAGE); // Возвращаемся на страницу постов после успешного добавления
          })
          .catch((error) => {
            console.error("Ошибка:", error);
            // Можно добавить уведомление пользователю об ошибке
          });
      },
    });
  }
  if (page === POSTS_PAGE) {
    return renderPostsPageComponent({
      appEl,
    });
  }

  if (page === USER_POSTS_PAGE) {
    // @TODO: реализовать страницу с фотографиями отдельного пользвателя
    // appEl.innerHTML = "Здесь будет страница фотографий пользователя";
    // return renderUserPostsPageComponent({ appEl});
    return renderUserPostsPageComponent({ appEl });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const likeBtns = document.querySelectorAll('.like-button');

  likeBtns.forEach(likeBtn => {
    likeBtn.addEventListener('click', () => {
      console.log('Лайкнул пост...');
      console.log(likeBtn);

      // Отправка лайка на сервер
      fetch(`${postsHost}/${posts.id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify({ postId: posts.id }), 
      })
      .then((response) => {
        
        return response.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error('Ошибка:', error);
      });
    });
  });
});


goToPage(POSTS_PAGE);
