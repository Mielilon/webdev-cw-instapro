
import {renderUploadImageComponent} from "./upload-image-component.js";
import { newPost } from "../api.js";
import { renderPostsPageComponent } from "./posts-page-component.js";
import { goToPage } from "../index.js";
import { POSTS_PAGE } from "../routes.js";
export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  const render = () => {
    // @TODO: Реализовать страницу добавления поста
    const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      Cтраница добавления поста
      <label class="file-upload-label">
       <input  class="url" type="file" style="display: none" > 
       Выберите фото</label> 
      <input class="text-description" type="text" placeholder=" добавьте описание">
      <button class="button" id="add-button">Добавить</button>
    </div>
  `;
    
    appEl.innerHTML = appHtml;
    const fileUploadLabel = document.querySelector('.file-upload-label');
    let imageUrl ='';

  if (fileUploadLabel) {
     renderUploadImageComponent({
       element: fileUploadLabel,
       onImageUrlChange(newImageUrl) {
        imageUrl = newImageUrl
      },
      
    });
   } 
  
    document.getElementById("add-button").addEventListener("click", () => {
      newPost({
        description: document.querySelector('.text-description').value,
        imageUrl: imageUrl,
      });
      goToPage(POSTS_PAGE)
      // renderPostsPageComponent(
      //  {appEl: document.querySelector('#app')}
      // )
    });
  };
  
  render(); 
}
