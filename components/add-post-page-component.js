
import { renderUploadImageComponent } from "./upload-image-component.js";
import { renderHeaderComponent } from "./header-component.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  let imageUrl = '';  // Объявление переменной для URL изображения

  const render = () => {
    const appHtml = `
      <div class="page-container">
        <div class="header-container">
          <div class="page-header">
            <h1 class="logo">instapro</h1>
            <button class="header-button add-or-login-button">
              <div title="Добавить пост" class="add-post-sign"></div>
            </button>
            <button title="Алексей" class="header-button logout-button">Выйти</button>  
          </div>
        </div>
        <div class="form">
          <h3 class="form-title">Добавить пост</h3>
          <div class="form-inputs">
            <div class="upload-image-container"></div>
            <label>
              Опишите фотографию:
              <textarea class="input textarea" rows="4"></textarea>
            </label>
            <button class="button" id="add-button">Добавить</button>
          </div>
        </div>
      </div>
    `;

    appEl.innerHTML = appHtml;
    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    // Инициализируем компонент загрузки изображения
    const uploadImageContainer = appEl.querySelector(".upload-image-container");
    renderUploadImageComponent({
      element: uploadImageContainer,
      onImageUrlChange(newImageUrl) {
        imageUrl = newImageUrl; // Обновляем значение imageUrl
      },
    });

    document.getElementById("add-button").addEventListener("click", () => {
      const description = document.querySelector(".textarea").value; // Получаем описание из textarea
      onAddPostClick({
        description: description,
        imageUrl: imageUrl,
      });
    });
  };

  render(); // Вызываем рендер
}

