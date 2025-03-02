// Замени на свой, чтобы получить независимый от других набор данных.
// "боевая" версия инстапро лежит в ключе prod
import {getToken } from "../index.js";

const personalKey = "prod";
const baseHost = "https://wedev-api.sky.pro";
// let userid= data.userId
export const postsHost = `${baseHost}/api/v1/${personalKey}/instapro`;

// export let token = ""

export function getPosts({ token }) {
  return fetch(postsHost, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Нет авторизации");
      }

      return response.json();
    })
    .then((data) => {
      return data.posts;
    });
}
export function putPost(commentToApi) {
  let token = getToken()
  return fetch(postsHost, {
      method: 'POST',
      headers: {
          Authorization: token,
      },
      body: JSON.stringify(commentToApi),
  }).then((response) => {
      if (response.status === 401) {
          throw new Error('Нет авторизации')
      }
      if (response.status === 201) {
          return response.status
      }
      return alert('Что-то пошло не так! Проверьте запрос')
  })
}

export function registerUser({ login, password, name, imageUrl }) {
  return fetch(baseHost + "/api/user", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
      name,
      imageUrl,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Такой пользователь уже существует");
    }
    return response.json();
  });
}

export function loginUser({ login, password }) {
  return fetch(baseHost + "/api/user/login", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Неверный логин или пароль");
    }
    return response.json();
  });
}

// Загружает картинку в облако, возвращает url загруженной картинки
export function uploadImage({ file }) {
  const data = new FormData();
  data.append("file", file);

  return fetch(baseHost + "/api/upload/image", {
    method: "POST",
    body: data,
  }).then((response) => {
    return response.json();
  });
}


// export function userPosts(userId) {

//   return fetch(`${postsHost}/user-posts/${userId.userId}`, {
//     method: "GET",
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   })
//     .then((response) => {
//       if (response.status === 401) {
//         throw new Error("Нет авторизации");
//       }

//       return response.json();
//     })
//     .then((data) => {
//       console.log(data);
//       return data.posts;
//     });
// }

export function putLike(postId, status) {
  let token = getToken()
  return fetch(
      `${postsHost}/${postId}/${status === false ? 'like' : 'dislike'}`,
      {
          method: 'POST',
          headers: {
              Authorization: token,
          },
      }
  )
      .then((response) => {
          if (response.status === 401) {
              throw new Error('Нет авторизации')
          }
          if (response.status === 200) {
              return response.json()
           
          }
          return alert('Что-то пошло не так! Проверьте запрос')
      })
      .catch((error) => {
        alert(error)
          return false
      })
}