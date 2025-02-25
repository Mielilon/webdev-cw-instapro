
import {renderUploadImageComponent} from "./upload-image-component.js";



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
    const newImageUrl = document.querySelector('.url')
     console.log(newImageUrl.files[0])

  if (fileUploadLabel) {
     renderUploadImageComponent({
       element: fileUploadLabel,
       onImageUrlChange(newImageUrl) {
         imageUrl = newImageUrl;
       },
    });
   } 
    document.getElementById("add-button").addEventListener("click", () => {
      onAddPostClick({
        description: document.querySelector('.text-description').value,
        imageUrl: newImageUrl.value
      });
    });
  };
  /* renderUploadImageComponent({ , onImageUrlChange })  */
  render();
 
}
