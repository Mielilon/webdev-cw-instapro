export function saveUserToLocalStorage(user) {
  window.localStorage.setItem("user", JSON.stringify(user));
}

export function getUserFromLocalStorage(user) {
  try {
    return JSON.parse(window.localStorage.getItem("user"));
  } catch (error) {
    return null;
  }
}

export function removeUserFromLocalStorage(user) {
  window.localStorage.removeItem("user");
}
// export function getTokenFromLocalStorage(token) {
//   try {
//     return JSON.parse(window.localStorage.getItem("token"));
//   } catch (error) {
//     return null;
//   }
// }
