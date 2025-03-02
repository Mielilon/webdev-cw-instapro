import { renderUploadImageComponent } from './upload-image-component.js'
import { renderHeaderComponent } from './header-component.js'
import { replaceSymbols } from '../helpers.js'
import { renderPostsPageComponent } from './posts-page-component.js'
export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
    const render = () => {
        let imageUrl = ''
        const appHtml = `

      <div class="page-container">
        <div class="header-container"></div>
        <div class="form">
            <h3 class="form-title">Оставить комментарий&nbsp;Instapro</h3>
            <div class="form-inputs">
              <div class="file-upload-image-container"></div>
              <input
                type="textarea"
                id="text-input"
                class="input"
                rows="5"
                cols=""
                33
                placeholder="Введите комментарий"
            />
            <div class="form-error"></div>
        </div>
          <button class="button" id="add-button">Опубликовать</button>
        </div>
      </div>

  `

        appEl.innerHTML = appHtml
        const uploadDescription = document.getElementById('text-input')
        const uploadImageContainer = app.querySelector(
            '.file-upload-image-container'
        )

        renderHeaderComponent({
            element: document.querySelector('.header-container'),
        })
        if (uploadImageContainer) {
            renderUploadImageComponent({
                element: uploadImageContainer,
                onImageUrlChange(newImageUrl) {
                    imageUrl = newImageUrl
                },
            })
        }

        document.getElementById('add-button').addEventListener('click', () => {
            onAddPostClick({
                description: replaceSymbols(uploadDescription.value),
                imageUrl: imageUrl,
            })
            renderPostsPageComponent({ appEl })
        })
    }

    render()
  }