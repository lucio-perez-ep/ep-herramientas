// ==UserScript==
// @name                Barra de herramientas especificas para Mercado Libre
// @version             v1.0
// @author              Lucio Perez
// @description         Herramientas varias para optimizar la gestión de ventas en Mercado Libre.
// @icon 				https://www.google.com/s2/favicons?sz=64&domain=mercadolibre.com.ar
// @match               https://*.mercadolibre.com.ar/ventas/omni/*
// @match               https://*.mercadolibre.com.ar/publicaciones*
// @match               https://*.mercadolibre.com.ar/publicaciones/listado*
// @grant               none
// @noframes
// ==/UserScript==

if (window.self !== window.top) {
  return
}

// Create the toolbar and append it to the body
const allowedPaths = [
    /^\/publicaciones$/,
    /^\/publicaciones\/listado/,
    /^\/ventas\/omni\/listado$/
];

const isAllowedPage = allowedPaths.some(regex =>
    regex.test(window.location.pathname)
);

if (isAllowedPage) {
    createToolbar();
}

// Check page and disable corresponding buttons
const currentUrl = window.location.href

if (currentUrl.includes('mercadolibre.com.ar/ventas/omni')) {
  createButtonToAddNotesToSales()
  createButtonToSearchNotes()
} else if (currentUrl.includes('mercadolibre.com.ar/publicaciones')) {
  createButtonToSearchPublicationsDetails()
}

function createToolbar () {
  const toolBar = document.createElement('div')
  toolBar.id = 'toolBar'
  toolBar.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
                <div style="display:flex;flex-direction:column;">
                    <span style="font-size:12px;color:#666">Herramientas para Mercado Libre</span>
                </div>
                <button id="toolbarToggle" aria-label="Toggle toolbar" style="background:transparent;border:none;color:#666;font-size:18px;cursor:pointer;padding:6px 8px;border-radius:6px">−</button>
            </div>
        `
  toolBar.style.position = 'fixed'
  toolBar.style.bottom = '12px'
  toolBar.style.left = '12px'
  toolBar.style.width = '320px'
  toolBar.style.maxWidth = '30%'
  toolBar.style.background = 'linear-gradient(180deg,#ffffff,#fbfbfe)'
  toolBar.style.border = '1px solid rgba(0,0,0,0.06)'
  toolBar.style.borderRadius = '10px'
  toolBar.style.padding = '12px'
  toolBar.style.zIndex = '10000'
  toolBar.style.boxShadow = '0 8px 24px rgba(16,24,40,0.08)'
  toolBar.style.fontFamily =
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
  toolBar.style.color = '#333'

  document.body.appendChild(toolBar)

  // Create an internal content container to host buttons and controls
  const toolbarToggle = document.getElementById('toolbarToggle')
  const toolbarContent = document.createElement('div')
  toolbarContent.id = 'toolbarContent'
  toolbarContent.style.marginTop = '8px'
  toolbarContent.style.display = 'flex'
  toolbarContent.style.flexDirection = 'column'
  toolbarContent.style.gap = '10px'
  toolBar.appendChild(toolbarContent)

  toolbarToggle.addEventListener('click', () => {
    if (toolbarContent.style.display === 'none') {
      toolbarContent.style.display = 'flex'
      toolbarContent.style.flexDirection = 'column'
      toolbarContent.style.gap = '10px'
      toolbarToggle.textContent = '−'
    } else {
      toolbarContent.style.display = 'none'
      toolbarToggle.textContent = '+'
    }
  })
}

function createButtonToSearchPublicationsDetails () {
  let publicationsIds = []
  let idSkipedDueToErrors = []
  let processedResults = []

  createButtonToSearchPublicationsDetails()

  function createButtonToSearchPublicationsDetails () {
    const buttonToSearchPublicationsDetails = document.createElement('button')
    buttonToSearchPublicationsDetails.id = 'buttonToSearchPublicationsDetails'
    buttonToSearchPublicationsDetails.innerText =
      'Buscar detalles de publicaciones masivamente'
    buttonToSearchPublicationsDetails.style.padding = '10px 12px'
    buttonToSearchPublicationsDetails.style.fontSize = '14px'
    buttonToSearchPublicationsDetails.style.color = 'white'
    buttonToSearchPublicationsDetails.style.backgroundColor = '#9C27B0'
    buttonToSearchPublicationsDetails.style.border = 'none'
    buttonToSearchPublicationsDetails.style.borderRadius = '8px'
    buttonToSearchPublicationsDetails.style.width = '100%'
    buttonToSearchPublicationsDetails.style.boxShadow =
      '0 6px 16px rgba(16,24,40,0.06)'
    buttonToSearchPublicationsDetails.style.fontWeight = '600'
    buttonToSearchPublicationsDetails.onclick =
      createModalToInsertPublicationsIds

    buttonToSearchPublicationsDetails.addEventListener('mouseenter', () => {
      buttonToSearchPublicationsDetails.style.backgroundColor = '#7B1FA2'
    })

    buttonToSearchPublicationsDetails.addEventListener('mouseleave', () => {
      buttonToSearchPublicationsDetails.style.backgroundColor = '#9C27B0'
    })

    const toolbarContent = document.getElementById('toolbarContent')

    if (toolbarContent) {
      toolbarContent.appendChild(buttonToSearchPublicationsDetails)
    } else {
      console.warn(
        'No se encontró la barra de herramientas para agregar el botón.'
      )
      return
    }
  }

  function createModalToInsertPublicationsIds () {
    disableButtonsFromToolbarAndSetCurrentOneAsInProgress(
      document.getElementById('buttonToSearchPublicationsDetails')
    )

    const modal = document.createElement('div')

    modal.id = 'modalToInputPublicationsIds'
    modal.style.position = 'fixed'
    modal.style.top = '0'
    modal.style.left = '0'
    modal.style.width = '100%'
    modal.style.height = '100%'
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.6)'
    modal.style.backdropFilter = 'blur(4px)'
    modal.style.display = 'flex'
    modal.style.alignItems = 'center'
    modal.style.justifyContent = 'center'
    modal.style.zIndex = '9999'

    const modalContent = document.createElement('div')

    modalContent.style.backgroundColor = '#fff'
    modalContent.style.padding = '30px'
    modalContent.style.borderRadius = '12px'
    modalContent.style.width = '550px'
    modalContent.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)'
    modalContent.style.fontFamily =
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"

    modalContent.innerHTML = `
            <h2 style="margin-top: 0; margin-bottom: 10px; color: #333; font-size: 22px;">
                Busca detalles de publicaciones masivamente
            </h2>

            <p style="margin-bottom: 20px; color: #666; font-size: 14px; line-height: 1.5;">
                Copia la columna con los ID de Publicaciones de tu Excel y pégala aquí debajo.
            </p>


            <textarea
                id="publicationsIdTextArea"
                placeholder="MLA123ABCXY / SKU123456"
                style="
                    width: 100%;
                    height: 200px;
                    padding: 12px;
                    border: 1px solid #ddd;
                    border-radius: 6px;
                    font-family: monospace;
                    font-size: 13px;
                    resize: vertical;
                    box-sizing: border-box;
                    outline-color: #9C27B0;
                "
            ></textarea>

            <div style="margin-top: 25px; display: flex; justify-content: flex-end; gap: 12px;">
                <button id="buttonToCloseModalToInputPublicationsIds" style="
                    padding: 10px 20px;
                    background-color: transparent;
                    color: #555;
                    border: 1px solid #ccc;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
                ">
                    Cancelar
                </button>

                <button id="buttonInModalToSearchPublicationsDetails" style="
                    padding: 10px 20px;
                    background-color: #9C27B0;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 600;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                ">
                    Buscar detalles
                </button>
            </div>
        `

    modal.appendChild(modalContent)

    document.body.appendChild(modal)

    const buttonToCloseModal = document.getElementById(
      'buttonToCloseModalToInputPublicationsIds'
    )

    buttonToCloseModal.onclick = () => {
      document.body.removeChild(modal)

      enableButtonsFromToolbar()
    }

    const buttonToSearchPublicationsDetails = document.getElementById(
      'buttonInModalToSearchPublicationsDetails'
    )

    buttonToSearchPublicationsDetails.onclick = () => {
      const publicationsIdTextAreaElement = document.getElementById(
        'publicationsIdTextArea'
      )

      if (
        !publicationsIdTextAreaElement ||
        publicationsIdTextAreaElement instanceof HTMLTextAreaElement === false
      ) {
        console.warn("Error al buscar el elemento 'publicationsIdTextArea'")
        return
      }

      publicationsIds = publicationsIdTextAreaElement.value.split('\n')

      document.body.removeChild(modal)

      processAllPublicationsIds(publicationsIds)
    }
  }

  async function processAllPublicationsIds (publicationsIds) {
    const lengthOfPublicationsIds = publicationsIds.length

    async function processOnePublicationId (publicationId) {
      // Clean and trim publicationId
      publicationId = publicationId.trim()

      try {
        const searchInput = document.querySelector('.andes-form-control__field')

        if (!searchInput || searchInput instanceof HTMLInputElement === false) {
          throw new Error('No se encontró el campo de búsqueda (input)')
        }

        const searchButton = document.querySelector(
          '.sc-input-search__hover-button'
        )

        if (!searchButton) {
          throw new Error('No se encontró el botón de búsqueda')
        }

        // Dirty React hack to set value and dispatch event to make React aware of the change
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          'value'
        ).set
        nativeInputValueSetter.call(searchInput, publicationId)

        const ev2 = new Event('input', { bubbles: true })
        searchInput.dispatchEvent(ev2)

        searchButton.click()

        await new Promise(resolve => setTimeout(resolve, 2000))

        // If .sc-item-rows is missing then the list is empty
        const listOfPublications = document.querySelector(
          'div.sll-list-grid__rows'
        )

        if (!listOfPublications) {
          throw new Error(
            `No se encontraron publicaciones para el ID: ${publicationId}`
          )
        } else if (listOfPublications.children.length > 2) {
          throw new Error(
            `Se encontraron múltiples publicaciones para el ID: ${publicationId}, omitiendo...`
          )
        }

        //There could be many results for a SKU, work over every one.
        //First check if pub has more sale options and if so, ask for them

        const listOfResultsToProcess = []

        for (let i = 0; i < listOfPublications.children.length; i++) {
          listOfResultsToProcess.push(
            processOneResult(listOfPublications.children.item(i))
          )
        }

        const results = await Promise.all(listOfResultsToProcess)

        async function processOneResult (result) {
          await new Promise(resolve => setTimeout(resolve, 1))
          const button = result.querySelector('button.sll-list-expand-button')

          if (button) {
            button.click()
          }

          // Get result main details
          const title =
            result.querySelector('h2.andes-typography.sll-list-row-title')
              ?.innerText ?? 'No disponible'

          let SKU =
            result.querySelector(
              'div.sll-list-copyable-id.sll-list-copyable-identifiers__sku span.sc-copyable-element__text'
            )?.innerText ?? 'No disponible'

          if (SKU.startsWith('SKU ')) {
            SKU = SKU.slice(4)
          }

          let inStoreStock =
            result.querySelector(
              'div.sll-list-stock-description.sll-list-cell-product__stock span.sll-list-stock-description__stock-label'
            )?.innerText ?? 'No disponible'

          if (inStoreStock === 'sin stock') {
            inStoreStock = 0
          } else {
            if (inStoreStock.includes(' u.')) {
              inStoreStock = inStoreStock.slice(0, inStoreStock.indexOf(' u.'))
            }
          }

          let inFULLStock =
            result.querySelector(
              'div.sll-list-stock-description.sll-list-cell-product__stock span:nth-of-type(2) span.sll-list-stock-description__stock-label'
            )?.innerText ?? 0

          if (inFULLStock === 'sin stock') {
            inFULLStock = 0
          } else {
            if (
              typeof inFULLStock === 'string' &&
              inFULLStock.includes(' u.')
            ) {
              inFULLStock = inFULLStock.slice(0, inFULLStock.indexOf(' u.'))
            }
          }

          console.log(inFULLStock)

          await new Promise(resolve => setTimeout(resolve, 2500))

          // Get results sale options details
          const saleOptions = result.querySelectorAll(
            'div.sll-list-grid-row__structure-columns-wrapper'
          )

          const saleOptionsLength = saleOptions.length

          const listOfSaleOptionsData = []

          for (const saleOption of saleOptions.values()) {
            let saleOptionID = saleOption.className
            saleOptionID =
              'MLA' + saleOptionID.slice(saleOptionID.indexOf('--') + 2)

            const price = saleOption.querySelector(
              'div.sll-list-cell-generic.sll-list-cell-price span.sll-list-no-wrap'
            ).innerText

            const numberOfInstallments = saleOption.querySelector(
              'div.sll-list-cell-generic.sll-list-cell-purchase-options span.sll-list-text-line__skeleton-label span'
            ).innerText

            let shippingMethod = saleOption.querySelector(
              'div.sll-list-cell-generic.sll-list-cell-purchase-options div.sll-list-cell-generic__lines'
            ).children[2]

            shippingMethod = shippingMethod.querySelector(
              'span.sll-list-text-line__skeleton-label span'
            ).innerText

            const shippingInfo = saleOption.querySelector(
              'div.sll-list-cell-generic.sll-list-cell-purchase-options div.sll-list-cell-generic__lines'
            ).children[3]

            const shippingConditions = shippingInfo.querySelector(
              'span.sll-list-text-line__skeleton-label span'
            ).innerText

            const shippingAmount = shippingInfo.querySelector(
              'span.sll-list-text-line__skeleton-label span.sll-list-no-wrap'
            ).innerText

            const earnings =
              '$' +
              saleOption.querySelector(
                'div.sll-list-cell-generic.sll-list-cell-earnings span.sll-list-no-wrap'
              ).innerText

            // Its kind of hard and error prone to determine if a pub its listed
            let listingStatus = saleOption.querySelector(
              'div.sll-list-cell-status.sll-list-cell-dynamic-cell p.andes-badge__content span'
            )?.innerText

            const status = saleOption.querySelector(
              'div.sll-list-text-line.sll-list-status-info__title span.sll-list-text-line__skeleton-label span'
            ).innerText

            if (status === 'Estás ganando con otra opción de venta.') {
              listingStatus = 'Si'
            }

            let automaticPrices = !!saleOption.querySelector(
              'span.sll-list-icon-wrapper.sll-list-icon-wrapper--automatic_pricing'
            )

            if (automaticPrices) {
              automaticPrices = 'Si'
            } else {
              automaticPrices = 'No'
            }

            listOfSaleOptionsData.push({
              saleOptionID,
              price,
              numberOfInstallments,
              shippingMethod,
              shippingConditions,
              shippingAmount,
              earnings,
              listingStatus,
              status,
              automaticPrices
            })
          }

          //Refine and add to final
          for (const optionData of listOfSaleOptionsData) {
            processedResults.push({
              title,
              SKU,
              inStoreStock,
              inFULLStock,
              price: optionData.price,
              saleOptionID: optionData.saleOptionID,
              numberOfInstallments: optionData.numberOfInstallments,
              shippingMethod: optionData.shippingMethod,
              shippingConditions: optionData.shippingConditions,
              shippingAmount: optionData.shippingAmount,
              earnings: optionData.earnings,
              listingStatus: optionData.listingStatus,
              status: optionData.status,
              automaticPrices: optionData.automaticPrices
            })
          }
        }

        return
      } catch (error) {
        console.warn(
          `Error procesando ID de publicación ${publicationId}. Error: ${error.message}`
        )
        idSkipedDueToErrors.push({
          saleId: publicationId,
          error: error.message
        })

        try {
          processedResults.push({
            saleId: publicationId || '',
            status: 'ERROR',
            error: error.message
          })
        } catch (e) {
          console.warn('No se pudo registrar resultado de error:', e)
        }
      }
    }

    for (const [index, publicationId] of publicationsIds.entries()) {
      if (index === lengthOfPublicationsIds - 1) {
        if (publicationId === '') {
          console.warn(
            `Error comun de que la última línea esté vacía, omitiendo...`
          )
          continue
        }
      }

      await processOnePublicationId(publicationId)
    }

    // Auto-download CSV with results to avoid losing the report
    try {
      downloadResultsCSV(processedResults, 'publicationsDetails')
    } catch (e) {
      console.warn('Error descargando CSV de resultados:', e)
    }

    showModalWithResultsAndErrors()

    function showModalWithResultsAndErrors () {
      const resultModal = document.createElement('div')
      resultModal.style.position = 'fixed'
      resultModal.style.top = '0'
      resultModal.style.left = '0'
      resultModal.style.width = '100%'
      resultModal.style.height = '100%'
      resultModal.style.backgroundColor = 'rgba(0, 0, 0, 0.6)'
      resultModal.style.backdropFilter = 'blur(4px)'
      resultModal.style.display = 'flex'
      resultModal.style.alignItems = 'center'
      resultModal.style.justifyContent = 'center'
      resultModal.style.zIndex = '9999'

      const resultModalContent = document.createElement('div')
      resultModalContent.style.backgroundColor = '#fff'
      resultModalContent.style.padding = '30px'
      resultModalContent.style.borderRadius = '12px'
      resultModalContent.style.width = '600px'
      resultModalContent.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)'
      resultModalContent.style.fontFamily =
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
      resultModalContent.style.display = 'flex'
      resultModalContent.style.flexDirection = 'column'

      resultModalContent.innerHTML = `
                <h2 style="margin-top: 0; margin-bottom: 10px; color: #333; font-size: 22px;">
                    Proceso finalizado
                </h2>

                <p style="margin-bottom: 15px; color: #666; font-size: 14px;">
                    ${
                      idSkipedDueToErrors.length === 0
                        ? '¡Se encontraron todas las Id de publicaciones exitosamente!'
                        : `Se procesaron ${
                            processedResults.filter(r => r.status === 'OK')
                              .length
                          } publicaciones correctamente, pero hubo ${
                            idSkipedDueToErrors.length
                          } errores que debes revisar:`
                    }
                </p>

                <div style="
                    max-height: 300px;
                    overflow-y: auto;
                    background-color: #f9f9f9;
                    border: 1px solid #eee;
                    border-radius: 6px;
                    padding: 10px;
                ">
                    <ul id="errorList" style="list-style: none; padding: 0; margin: 0;"></ul>
                </div>

                <div style="margin-top: 20px; display: flex; justify-content: flex-end;">
                    <button id="closeResultModal" style="
                        padding: 10px 25px;
                        background-color: #9C27B0;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: 600;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                    ">
                        Terminar
                    </button>
                </div>
            `

      resultModal.appendChild(resultModalContent)
      document.body.appendChild(resultModal)

      const errorList = document.getElementById('errorList')

      if (idSkipedDueToErrors.length === 0) {
        errorList.innerHTML = `
            <li style="
                padding: 15px;
                text-align: center;
                color: #2e7d32;
                font-weight: 500;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            ">
                <span style="font-size: 20px;">✓</span>
                ¡Éxito! Se consiguieron todos los detalles de las publicaciones.
            </li>`
      } else {
        idSkipedDueToErrors.forEach(errorInfo => {
          const skipedPublication = document.createElement('li')
          skipedPublication.style.padding = '12px'
          skipedPublication.style.borderBottom = '1px solid #eee'
          skipedPublication.style.fontSize = '13px'
          skipedPublication.style.lineHeight = '1.4'
          skipedPublication.style.color = '#333'

          const publicationId = errorInfo.saleId || '—'
          const errMsg = errorInfo.error || 'Error desconocido'

          const row = document.createElement('div')
          row.style.display = 'flex'
          row.style.justifyContent = 'space-between'
          row.style.alignItems = 'flex-start'
          row.style.gap = '12px'

          const results = document.createElement('div')
          const modalHeader = document.createElement('div')

          modalHeader.textContent = 'Publicacion ID / SKU'
          modalHeader.style.fontSize = '12px'
          modalHeader.style.color = '#666'

          const publicationIdContainer = document.createElement('div')

          publicationIdContainer.textContent = publicationId
          publicationIdContainer.id = publicationId
          publicationIdContainer.style.fontFamily =
            "ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', monospace"
          publicationIdContainer.style.fontWeight = '700'
          publicationIdContainer.style.marginTop = '4px'
          results.appendChild(modalHeader)
          results.appendChild(publicationIdContainer)

          row.appendChild(results)

          const errDiv = document.createElement('div')
          errDiv.textContent = errMsg
          errDiv.style.color = '#d32f2f'
          errDiv.style.fontSize = '12px'
          errDiv.style.marginTop = '8px'

          skipedPublication.appendChild(row)
          skipedPublication.appendChild(errDiv)

          errorList.appendChild(skipedPublication)
        })
      }

      const closeResultModalButton = document.getElementById('closeResultModal')
      closeResultModalButton.onclick = () => {
        publicationsIds = []
        idSkipedDueToErrors = []
        processedResults = []

        enableButtonsFromToolbar()
        document.body.removeChild(resultModal)
      }
    }
  }
}

function createButtonToAddNotesToSales () {
  let salesIdAndNotes = []
  let idSkipedDueToErrors = []
  let processingResults = []

  const buttonAddNotes = document.createElement('button')
  buttonAddNotes.id = 'buttonAddNotes'
  buttonAddNotes.innerText = 'Añadir notas masivamente'
  buttonAddNotes.style.padding = '10px 12px'
  buttonAddNotes.style.fontSize = '14px'
  buttonAddNotes.style.color = 'white'
  buttonAddNotes.style.border = 'none'
  buttonAddNotes.style.borderRadius = '8px'
  buttonAddNotes.style.width = '100%'
  buttonAddNotes.style.boxShadow = '0 6px 16px rgba(16,24,40,0.06)'
  buttonAddNotes.style.fontWeight = '600'
  buttonAddNotes.style.backgroundColor = '#9C27B0'
  buttonAddNotes.onclick = createModalToInputSaleIdAndCorrespondingNote

  buttonAddNotes.addEventListener('mouseenter', () => {
    buttonAddNotes.style.backgroundColor = '#7B1FA2'
  })

  buttonAddNotes.addEventListener('mouseleave', () => {
    buttonAddNotes.style.backgroundColor = '#9C27B0'
  })

  enableButtonsFromToolbar()

  // Append button inside the toolbar's internal content container if it exists
  const toolbarContent = document.getElementById('toolbarContent')
  if (toolbarContent) {
    toolbarContent.appendChild(buttonAddNotes)
  } else {
    const toolBarFallback = document.getElementById('toolBar')
    if (toolBarFallback) {
      toolBarFallback.appendChild(buttonAddNotes)
    } else {
      console.warn(
        'No se encontró la barra de herramientas para agregar el botón.'
      )
    }
  }

  // document.body.appendChild(buttonAddNotes);

  function createModalToInputSaleIdAndCorrespondingNote () {
    disableButtonsFromToolbarAndSetCurrentOneAsInProgress(buttonAddNotes)

    const modal = document.createElement('div')
    modal.id = 'modalToInputSaleIdAndCorrespondingNote'
    modal.style.position = 'fixed'
    modal.style.top = '0'
    modal.style.left = '0'
    modal.style.width = '100%'
    modal.style.height = '100%'
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.6)'
    modal.style.backdropFilter = 'blur(4px)'
    modal.style.display = 'flex'
    modal.style.alignItems = 'center'
    modal.style.justifyContent = 'center'
    modal.style.zIndex = '9999'

    const modalContent = document.createElement('div')
    modalContent.style.backgroundColor = '#fff'
    modalContent.style.padding = '30px'
    modalContent.style.borderRadius = '12px'
    modalContent.style.width = '550px'
    modalContent.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)'
    modalContent.style.fontFamily =
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"

    modalContent.innerHTML = `
        <h2 style="margin-top: 0; margin-bottom: 10px; color: #333; font-size: 22px;">
            Importar notas masivamente
        </h2>

        <p style="margin-bottom: 20px; color: #666; font-size: 14px; line-height: 1.5;">
            Copia las columnas de tu Excel (ID de Venta y Nota) y pégalas aquí debajo.
        </p>

        <textarea
            id="salesIdAndNotesTextArea"
            placeholder="10000001    Nota para el cliente..."
            style="
                width: 100%;
                height: 200px;
                padding: 12px;
                border: 1px solid #ddd;
                border-radius: 6px;
                font-family: monospace;
                font-size: 13px;
                resize: vertical;
                box-sizing: border-box;
                outline-color: #9C27B0;
            "
        ></textarea>

        <div style="margin-top: 25px; display: flex; justify-content: flex-end; gap: 12px;">
            <button id="buttonToCloseModalToInputSaleIdAndCorrespondingNote" style="
                padding: 10px 20px;
                background-color: transparent;
                color: #555;
                border: 1px solid #ccc;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
            ">
                Cancelar
            </button>

            <button id="buttonToSubmitModalToInputSaleIdAndCorrespondingNote" style="
                padding: 10px 20px;
                background-color: #9C27B0;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 600;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            ">
                Procesar Notas
            </button>
        </div>
    `

    modal.appendChild(modalContent)
    document.body.appendChild(modal)

    document
      .getElementById('buttonToCloseModalToInputSaleIdAndCorrespondingNote')
      .addEventListener('click', () => {
        enableButtonsFromToolbar()
        document.body.removeChild(modal)
      })

    document
      .getElementById('buttonToSubmitModalToInputSaleIdAndCorrespondingNote')
      .addEventListener('click', () => {
        const salesIdAndNotesElement = document.getElementById(
          'salesIdAndNotesTextArea'
        )

        if (
          !salesIdAndNotesElement ||
          salesIdAndNotesElement instanceof HTMLTextAreaElement === false
        ) {
          console.warn("Error al buscar el elemento 'salesIdAndNotesTextArea'")
          return
        }

        salesIdAndNotes = salesIdAndNotesElement.value
          .split('\n')
          .map(line => line.split('\t'))
        document.body.removeChild(modal)

        disableButtonsFromToolbarAndSetCurrentOneAsInProgress(buttonAddNotes)

        processSalesIdAndNotes(salesIdAndNotes)
      })
  }

  /**
   * Main function to process the list of sales ID and corresponding notes, with error handling and final report.
   * @param {Array} salesIdAndNotes
   */
  async function processSalesIdAndNotes (salesIdAndNotes) {
    const lengthOfSales = salesIdAndNotes.length
    processingResults.push({
      saleId: 'Inicio del proceso',
      status: 'INFO',
      note: formatDateForExcel(new Date().toLocaleString())
    })

    async function processaleIdAndNote (saleIdAndNote) {
      const startedAt = new Date()
      try {
        const searchInput = document.querySelector('.andes-form-control__field')

        if (!searchInput || searchInput instanceof HTMLInputElement === false) {
          throw new Error('No se encontró el campo de búsqueda (input)')
        }

        const searchButton = document.querySelector(
          '.andes-form-control__search-icon'
        )

        if (!searchButton) {
          throw new Error('No se encontró el botón de búsqueda')
        }

        // Dirty React hack to set value and dispatch event to make React aware of the change
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          'value'
        ).set
        nativeInputValueSetter.call(searchInput, saleIdAndNote[0])

        const ev2 = new Event('input', { bubbles: true })
        searchInput.dispatchEvent(ev2)

        searchButton.click()

        await new Promise(resolve => setTimeout(resolve, 2000))

        const listOfSales = document.querySelector(
          '.sc-list.sc-list-marketplace'
        )

        if (!listOfSales) {
          throw new Error('No se encontró el listado de ventas')
        }

        if (listOfSales.children.length === 0) {
          throw new Error(
            `No se encontraron ventas para el ID: ${saleIdAndNote[0]}`
          )
        } else if (listOfSales.children.length > 2) {
          throw new Error(
            `Se encontraron multiples ventas para el ID: ${saleIdAndNote[0]}, omitiendo...`
          )
        }

        const menuButton = document.querySelector(
          "button[data-testid='open-floating-menu-without-tooltip']"
        )

        if (!menuButton) {
          throw new Error('No se encontró el botón de menú')
        }

        menuButton.click()

        await new Promise(resolve => setTimeout(resolve, 200))

        const addNoteButton = Array.from(
          document.querySelectorAll('span.andes-button__text')
        ).find(span => span.textContent.trim() === 'Agregar nota')

        if (!addNoteButton) {
          throw new Error("No se encontró el botón de 'Agregar nota'")
        }

        addNoteButton.click()

        await new Promise(resolve => setTimeout(resolve, 200))

        const noteInput = document.querySelector(
          "input[data-testid='noteInput']"
        )

        if (!noteInput || noteInput instanceof HTMLInputElement === false) {
          throw new Error('No se encontró el campo para escribir la nota')
        }

        // Dirty React hack to set value and dispatch event to make React aware of the change
        const nativeInputValueSetterNote = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          'value'
        ).set
        nativeInputValueSetterNote.call(noteInput, saleIdAndNote[1])

        const evNote = new Event('input', { bubbles: true })
        noteInput.dispatchEvent(evNote)

        const saveNoteButton = document.querySelector(
          "button[aria-label='save-note']"
        )

        if (!saveNoteButton) {
          throw new Error("No se encontró el botón de 'Guardar nota'")
        }

        // See if list of sales second child has class .andes-card else the list is empty
        if (!listOfSales.children[1].classList.contains('andes-card')) {
          throw new Error(`No se encontraron ventas para el ID: ${saleId}`)
        }

        // Get price, unidades and sku if exist, if not set as 'No disponible'
        const price = listOfSales.children[1]
          .querySelector('span.price')
          .textContent.trim()
        const unidades =
          listOfSales.children[1]
            .querySelector('span.unit')
            ?.textContent.trim() || '1'
        const sku =
          listOfSales.children[1]
            .querySelector('span.sku')
            ?.textContent.trim() || 'SKU no disponible'

        if (!price) {
          throw new Error('No se pudo obtener el precio de la venta')
        }

        if (!unidades) {
          throw new Error('No se pudo obtener las unidades de la venta')
        }

        if (!sku) {
          throw new Error('No se pudo obtener el SKU de la venta')
        }
        const dateOfSale = listOfSales.querySelector('.left-column__order-date')
        if (!dateOfSale) {
          throw new Error('No se encontró la fecha de la venta en el resultado')
        }

        const dateOfSaleText = dateOfSale.textContent.trim()

        saveNoteButton.click()

        await new Promise(resolve => setTimeout(resolve, 100))

        // Register successful processing for CSV/report
        try {
          processingResults.push({
            saleId: saleIdAndNote[0],
            note: saleIdAndNote[1],
            status: 'OK',
            error: '',
            price,
            unidades,
            sku,
            dateOfSaleText
          })
        } catch (e) {
          console.warn('No se pudo registrar resultado exitoso:', e)
        }
      } catch (error) {
        console.warn(
          `Error procesando venta ID: ${saleIdAndNote[0]} con nota: ${saleIdAndNote[1]}. Error: ${error.message}`
        )
        idSkipedDueToErrors.push({
          saleId: saleIdAndNote[0],
          note: saleIdAndNote[1],
          error: error.message
        })
        try {
          processingResults.push({
            saleId: saleIdAndNote[0] || '',
            note: saleIdAndNote[1] || '',
            status: 'ERROR',
            error: error.message
          })
        } catch (e) {
          console.warn('No se pudo registrar resultado de error:', e)
        }
      }
    }

    for (let [index, saleIdAndNote] of salesIdAndNotes.entries()) {
      if (index === lengthOfSales - 1) {
        if (saleIdAndNote[0] === '' && saleIdAndNote[1] === undefined) {
          console.warn(
            `Error comun de que la última línea esté vacía, omitiendo...`
          )
          continue
        }
      }

      // Remove all whitespace characters from sale ID and trim both sale ID and note
      saleIdAndNote[0] = saleIdAndNote[0]?.trim()
      saleIdAndNote[1] = saleIdAndNote[1]?.trim()

      if (saleIdAndNote[0] === undefined || saleIdAndNote[1] === undefined) {
        console.warn(
          `Formato inválido para ID de venta y nota: ${saleIdAndNote}."`
        )
        idSkipedDueToErrors.push({
          saleId: saleIdAndNote[0] || 'indefinido',
          note: saleIdAndNote[1] || 'indefinido',
          error: 'Formato inválido en la venta o la nota'
        })
        processingResults.push({
          saleId: saleIdAndNote[0] || 'indefinido',
          note: saleIdAndNote[1] || 'indefinido',
          status: 'ERROR',
          error: 'Formato inválido en la venta o la nota'
        })
        continue
      }

      if (
        typeof saleIdAndNote[0] !== 'string' ||
        typeof saleIdAndNote[1] !== 'string'
      ) {
        console.warn(
          `Tipo de dato inválido para ID o nota: ${saleIdAndNote}. Ambos deben ser cadenas de texto.`
        )
        idSkipedDueToErrors.push({
          saleId: saleIdAndNote[0],
          note: saleIdAndNote[1],
          error: 'Tipo de dato inválido, se esperaban textos'
        })
        processingResults.push({
          saleId: saleIdAndNote[0] || '',
          note: saleIdAndNote[1] || '',
          status: 'ERROR',
          error: 'Tipo de dato inválido, se esperaban textos'
        })
        continue
      }

      if (saleIdAndNote[0].trim() === '' || saleIdAndNote[1].trim() === '') {
        console.warn(
          `ID de venta o nota vacíos: ${saleIdAndNote}. Ambos campos son requeridos.`
        )
        idSkipedDueToErrors.push({
          saleId: saleIdAndNote[0],
          note: saleIdAndNote[1],
          error: 'Campos vacíos, ID y Nota son requeridos'
        })
        processingResults.push({
          saleId: saleIdAndNote[0] || '',
          note: saleIdAndNote[1] || '',
          status: 'ERROR',
          error: 'Campos vacíos, ID y Nota son requeridos'
        })
        continue
      }

      if (saleIdAndNote[0].includes(' ') || saleIdAndNote[0].includes('\t')) {
        console.warn(
          `Formato de ID de venta inválido: ${saleIdAndNote[0]}. El ID no debe contener espacios ni tabulaciones.`
        )
        idSkipedDueToErrors.push({
          saleId: saleIdAndNote[0],
          note: saleIdAndNote[1],
          error: 'ID inválido, contiene espacios o tabulaciones'
        })
        processingResults.push({
          saleId: saleIdAndNote[0] || '',
          note: saleIdAndNote[1] || '',
          status: 'ERROR',
          error: 'ID inválido, contiene espacios o tabulaciones'
        })
        continue
      }

      if (saleIdAndNote[0].length < 5 || saleIdAndNote[0].length > 20) {
        if (saleIdAndNote[0].length < 5) {
          console.warn(
            `ID de venta muy corto: ${saleIdAndNote[0]}. Debe tener al menos 5 caracteres.`
          )
          idSkipedDueToErrors.push({
            saleId: saleIdAndNote[0],
            note: saleIdAndNote[1],
            error: 'ID muy corto (mínimo 5 caracteres)'
          })
          processingResults.push({
            saleId: saleIdAndNote[0] || '',
            note: saleIdAndNote[1] || '',
            status: 'ERROR',
            error: 'ID muy corto (mínimo 5 caracteres)'
          })
        } else {
          console.warn(
            `ID de venta muy largo: ${saleIdAndNote[0]}. Debe tener menos de 20 caracteres.`
          )
          idSkipedDueToErrors.push({
            saleId: saleIdAndNote[0],
            note: saleIdAndNote[1],
            error: 'ID muy largo (máximo 20 caracteres)'
          })
          processingResults.push({
            saleId: saleIdAndNote[0] || '',
            note: saleIdAndNote[1] || '',
            status: 'ERROR',
            error: 'ID muy largo (máximo 20 caracteres)'
          })
        }
        continue
      }

      if (saleIdAndNote[1].length < 5 || saleIdAndNote[1].length > 120) {
        if (saleIdAndNote[1].length < 5) {
          console.warn(
            `Nota muy corta para ID: ${saleIdAndNote[0]}. Debe tener al menos 5 caracteres.`
          )
          idSkipedDueToErrors.push({
            saleId: saleIdAndNote[0],
            note: saleIdAndNote[1],
            error: 'Nota muy corta (mínimo 5 caracteres)'
          })
          processingResults.push({
            saleId: saleIdAndNote[0] || '',
            note: saleIdAndNote[1] || '',
            status: 'ERROR',
            error: 'Nota muy corta (mínimo 5 caracteres)'
          })
        } else {
          console.warn(
            `Nota muy larga para ID: ${saleIdAndNote[0]}. Debe tener menos de 120 caracteres.`
          )
          idSkipedDueToErrors.push({
            saleId: saleIdAndNote[0],
            note: saleIdAndNote[1],
            error: 'Nota muy larga (máximo 120 caracteres)'
          })
          processingResults.push({
            saleId: saleIdAndNote[0] || '',
            note: saleIdAndNote[1] || '',
            status: 'ERROR',
            error: 'Nota muy larga (máximo 120 caracteres)'
          })
        }
        continue
      }
      await processaleIdAndNote(saleIdAndNote)
    }

    processingResults.push({
      saleId: 'Fin del proceso',
      status: 'INFO',
      note: formatDateForExcel(new Date().toLocaleString())
    })

    // Auto-download CSV with results to avoid losing the report
    try {
      downloadResultsCSV(processingResults)
    } catch (e) {
      console.warn('Error descargando CSV de resultados:', e)
    }

    showModalWithResultsAndErrors()

    function showModalWithResultsAndErrors () {
      const resultModal = document.createElement('div')
      resultModal.style.position = 'fixed'
      resultModal.style.top = '0'
      resultModal.style.left = '0'
      resultModal.style.width = '100%'
      resultModal.style.height = '100%'
      resultModal.style.backgroundColor = 'rgba(0, 0, 0, 0.6)'
      resultModal.style.backdropFilter = 'blur(4px)'
      resultModal.style.display = 'flex'
      resultModal.style.alignItems = 'center'
      resultModal.style.justifyContent = 'center'
      resultModal.style.zIndex = '9999'

      const resultModalContent = document.createElement('div')
      resultModalContent.style.backgroundColor = '#fff'
      resultModalContent.style.padding = '30px'
      resultModalContent.style.borderRadius = '12px'
      resultModalContent.style.width = '600px'
      resultModalContent.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)'
      resultModalContent.style.fontFamily =
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
      resultModalContent.style.display = 'flex'
      resultModalContent.style.flexDirection = 'column'

      resultModalContent.innerHTML = `
        <h2 style="margin-top: 0; margin-bottom: 10px; color: #333; font-size: 22px;">
            Proceso finalizado
        </h2>

        <p style="margin-bottom: 15px; color: #666; font-size: 14px;">
            Se han procesado todas las notas. A continuación el reporte de estado:
        </p>

        <div style="
            max-height: 300px;
            overflow-y: auto;
            background-color: #f9f9f9;
            border: 1px solid #eee;
            border-radius: 6px;
            padding: 10px;
        ">
            <ul id="errorList" style="list-style: none; padding: 0; margin: 0;"></ul>
        </div>

        <div style="margin-top: 20px; display: flex; justify-content: flex-end;">
            <button id="closeResultModal" style="
                padding: 10px 25px;
                background-color: #9C27B0;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 600;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            ">
                Terminar
            </button>
        </div>
    `

      resultModal.appendChild(resultModalContent)
      document.body.appendChild(resultModal)

      const errorList = document.getElementById('errorList')

      if (idSkipedDueToErrors.length === 0) {
        errorList.innerHTML = `
            <li style="
                padding: 15px;
                text-align: center;
                color: #2e7d32;
                font-weight: 500;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            ">
                <span style="font-size: 20px;">✓</span>
                ¡Éxito! Todas las notas se procesaron correctamente.
            </li>`
      } else {
        idSkipedDueToErrors.forEach(errorInfo => {
          const listItem = document.createElement('li')
          listItem.style.padding = '12px'
          listItem.style.borderBottom = '1px solid #eee'
          listItem.style.fontSize = '13px'
          listItem.style.lineHeight = '1.4'
          listItem.style.color = '#333'

          const saleId = errorInfo.saleId || '—'
          const note = errorInfo.note || '—'
          const errMsg = errorInfo.error || 'Error desconocido'

          const row = document.createElement('div')
          row.style.display = 'flex'
          row.style.justifyContent = 'space-between'
          row.style.alignItems = 'flex-start'
          row.style.gap = '12px'

          const left = document.createElement('div')
          const saleLabel = document.createElement('div')
          saleLabel.textContent = 'Venta'
          saleLabel.style.fontSize = '12px'
          saleLabel.style.color = '#666'
          const saleValue = document.createElement('div')
          saleValue.textContent = saleId
          saleValue.style.fontFamily =
            "ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', monospace"
          saleValue.style.fontWeight = '700'
          saleValue.style.marginTop = '4px'
          left.appendChild(saleLabel)
          left.appendChild(saleValue)

          const right = document.createElement('div')
          right.style.maxWidth = '60%'
          const noteLabel = document.createElement('div')
          noteLabel.textContent = 'Nota'
          noteLabel.style.fontSize = '12px'
          noteLabel.style.color = '#666'
          const noteValue = document.createElement('div')
          noteValue.textContent = note || ''
          noteValue.style.fontSize = '13px'
          noteValue.style.color = '#444'
          noteValue.style.whiteSpace = 'pre-wrap'
          noteValue.style.wordBreak = 'break-word'
          noteValue.style.marginTop = '4px'
          if (note !== '—') noteValue.style.fontStyle = 'italic'
          right.appendChild(noteLabel)
          right.appendChild(noteValue)

          row.appendChild(left)
          row.appendChild(right)

          const errDiv = document.createElement('div')
          errDiv.textContent = errMsg
          errDiv.style.color = '#d32f2f'
          errDiv.style.fontSize = '12px'
          errDiv.style.marginTop = '8px'

          listItem.appendChild(row)
          listItem.appendChild(errDiv)

          errorList.appendChild(listItem)
        })
      }

      document
        .getElementById('closeResultModal')
        .addEventListener('click', () => {
          salesIdAndNotes = []
          idSkipedDueToErrors = []
          processingResults = []

          enableButtonsFromToolbar()
          document.body.removeChild(resultModal)
        })
    }
  }
}

function createButtonToSearchNotes () {
  let salesIds = []
  let idSkipedDueToErrors = []
  let processingResults = []

  const buttonToSearchNotes = document.createElement('button')
  buttonToSearchNotes.id = 'buttonToSearchNotes'
  buttonToSearchNotes.innerText = 'Buscar notas masivamente'
  buttonToSearchNotes.style.padding = '10px 12px'
  buttonToSearchNotes.style.fontSize = '14px'
  buttonToSearchNotes.style.color = 'white'
  buttonToSearchNotes.style.backgroundColor = '#9C27B0'
  buttonToSearchNotes.style.border = 'none'
  buttonToSearchNotes.style.borderRadius = '8px'
  buttonToSearchNotes.style.width = '100%'
  buttonToSearchNotes.style.boxShadow = '0 6px 16px rgba(16,24,40,0.06)'
  buttonToSearchNotes.style.fontWeight = '600'
  buttonToSearchNotes.onclick = createModalToInputSalesIds

  buttonToSearchNotes.addEventListener('mouseenter', () => {
    buttonToSearchNotes.style.backgroundColor = '#7B1FA2'
  })

  buttonToSearchNotes.addEventListener('mouseleave', () => {
    buttonToSearchNotes.style.backgroundColor = '#9C27B0'
  })

  // Append button inside the toolbar's internal content container if it exists
  const toolbarContent = document.getElementById('toolbarContent')

  if (toolbarContent) {
    toolbarContent.appendChild(buttonToSearchNotes)
  } else {
    const toolBarFallback = document.getElementById('toolBar')
    if (toolBarFallback) {
      toolBarFallback.appendChild(buttonToSearchNotes)
    } else {
      console.warn(
        'No se encontró la barra de herramientas para agregar el botón.'
      )
    }
  }

  function createModalToInputSalesIds () {
    disableButtonsFromToolbarAndSetCurrentOneAsInProgress(
      document.getElementById('buttonToSearchNotes')
    )

    const modal = document.createElement('div')
    modal.id = 'modalToInputSalesIds'
    modal.style.position = 'fixed'
    modal.style.top = '0'
    modal.style.left = '0'
    modal.style.width = '100%'
    modal.style.height = '100%'
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.6)'
    modal.style.backdropFilter = 'blur(4px)'
    modal.style.display = 'flex'
    modal.style.alignItems = 'center'
    modal.style.justifyContent = 'center'
    modal.style.zIndex = '9999'

    const modalContent = document.createElement('div')
    modalContent.style.backgroundColor = '#fff'
    modalContent.style.padding = '30px'
    modalContent.style.borderRadius = '12px'
    modalContent.style.width = '550px'
    modalContent.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)'
    modalContent.style.fontFamily =
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"

    modalContent.innerHTML = `
        <h2 style="margin-top: 0; margin-bottom: 10px; color: #333; font-size: 22px;">
            Buscar notas masivamente
        </h2>

        <p style="margin-bottom: 20px; color: #666; font-size: 14px; line-height: 1.5;">
            Copia la columna con los ID de Ventas de tu Excel y pégala aquí debajo.
        </p>
        <p style="margin-bottom: 20px; color: #df1717; font-size: 14px; line-height: 1.5; font-weight: 600;">
            Prestar atencion que el rango de tiempo de busqueada sea el correcto.
        </p>

        <textarea
            id="salesIdTextArea"
            placeholder="10000001"
            style="
                width: 100%;
                height: 200px;
                padding: 12px;
                border: 1px solid #ddd;
                border-radius: 6px;
                font-family: monospace;
                font-size: 13px;
                resize: vertical;
                box-sizing: border-box;
                outline-color: #9C27B0;
            "
        ></textarea>

        <div style="margin-top: 25px; display: flex; justify-content: flex-end; gap: 12px;">
            <button id="buttonToCloseModalToInputSaleIds" style="
                padding: 10px 20px;
                background-color: transparent;
                color: #555;
                border: 1px solid #ccc;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
            ">
                Cancelar
            </button>

            <button id="buttonInModalToSearchNotes" style="
                padding: 10px 20px;
                background-color: #9C27B0;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 600;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            ">
                Buscar notas
            </button>
        </div>
    `

    modal.appendChild(modalContent)
    document.body.appendChild(modal)

    const buttonToCloseModal = document.getElementById(
      'buttonToCloseModalToInputSaleIds'
    )
    buttonToCloseModal.onclick = () => {
      document.body.removeChild(modal)
      enableButtonsFromToolbar()
    }

    const buttonToSearchNotes = document.getElementById(
      'buttonInModalToSearchNotes'
    )
    buttonToSearchNotes.onclick = () => {
      const salesIdTextAreaElement = document.getElementById('salesIdTextArea')

      if (
        !salesIdTextAreaElement ||
        salesIdTextAreaElement instanceof HTMLTextAreaElement === false
      ) {
        console.warn("Error al buscar el elemento 'salesIdTextArea'")
        return
      }

      salesIds = salesIdTextAreaElement.value.split('\n')

      document.body.removeChild(modal)

      processAllSalesIds(salesIds)
    }
  }

  /**
   * Main function to process the list of sales ID and search corresponding notes with error handling and final report.
   * @param {Array} salesIds
   */
  async function processAllSalesIds (salesIds) {
    const lengthOfSaleIds = salesIds.length
    processingResults.push({
      saleId: 'Inicio del proceso',
      status: 'INFO',
      note: formatDateForExcel(new Date().toLocaleString())
    })

    async function processOneSaleId (saleId) {
      try {
        const searchInput = document.querySelector('.andes-form-control__field')

        if (!searchInput || searchInput instanceof HTMLInputElement === false) {
          throw new Error('No se encontró el campo de búsqueda (input)')
        }

        const searchButton = document.querySelector(
          '.andes-form-control__search-icon'
        )

        if (!searchButton) {
          throw new Error('No se encontró el botón de búsqueda')
        }

        // Dirty React hack to set value and dispatch event to make React aware of the change
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          'value'
        ).set
        nativeInputValueSetter.call(searchInput, saleId)

        const ev2 = new Event('input', { bubbles: true })
        searchInput.dispatchEvent(ev2)

        searchButton.click()

        await new Promise(resolve => setTimeout(resolve, 2000))

        const listOfSales = document.querySelector(
          '.sc-list.sc-list-marketplace'
        )

        if (!listOfSales) {
          throw new Error('No se encontró el listado de ventas')
        }
        if (listOfSales.children.length === 0) {
          throw new Error(`No se encontraron ventas para el ID: ${saleId}`)
        } else if (listOfSales.children.length > 2) {
          throw new Error(
            `Se encontraron multiples ventas para el ID: ${saleId}, omitiendo...`
          )
        }

        // See if list of sales second child has class .andes-card else the list is empty
        if (!listOfSales.children[1].classList.contains('andes-card')) {
          throw new Error(`No se encontraron ventas para el ID: ${saleId}`)
        }

        // Get price, unidades and sku if exist, if not set as 'No disponible'
        const price = listOfSales.children[1]
          .querySelector(
            'span.sc-product-data__price span.sc-product-data__value'
          )
          .textContent.trim()
        const unidades =
          listOfSales.children[1]
            .querySelector(
              'span.sc-product-data__qty span.sc-product-data__value'
            )
            ?.textContent.trim() || 'Cantidad no disponible'
        const sku =
          listOfSales.children[1]
            .querySelector(
              'span.sc-product-data__sku span.sc-product-data__value'
            )
            ?.textContent.trim() || 'SKU no disponible'

        if (!price) {
          throw new Error('No se pudo obtener el precio de la venta')
        }

        if (!unidades) {
          throw new Error('No se pudo obtener las unidades de la venta')
        }

        if (!sku) {
          throw new Error('No se pudo obtener el SKU de la venta')
        }
        const dateOfSale = listOfSales.querySelector('.left-column__order-date')
        if (!dateOfSale) {
          throw new Error('No se encontró la fecha de la venta en el resultado')
        }

        const dateOfSaleText = dateOfSale.textContent.trim()

        const note =
          document.querySelector('.read-text')?.textContent.trim() || ''

        try {
          processingResults.push({
            saleId,
            note,
            status: 'OK',
            error: '',
            dateOfSaleText,
            price,
            unidades,
            sku
          })
        } catch (e) {
          console.warn('No se pudo registrar resultado exitoso:', e)
        }
      } catch (error) {
        console.warn(
          `Error procesando venta ID: ${saleId}. Error: ${error.message}`
        )
        idSkipedDueToErrors.push({ saleId, error: error.message })

        try {
          processingResults.push({
            saleId: saleId || '',
            status: 'ERROR',
            error: error.message
          })
        } catch (e) {
          console.warn('No se pudo registrar resultado de error:', e)
        }
      }
    }

    for (let [index, saleId] of salesIds.entries()) {
      if (index === lengthOfSaleIds - 1) {
        if (saleId === '') {
          console.warn(
            `Error comun de que la última línea esté vacía, omitiendo...`
          )
          continue
        }
      }

      // Remove all whitespace characters
      saleId = saleId.trim()

      console.warn(
        `Procesando Id: ${saleId}. ${index + 1} de ${lengthOfSaleIds - 1}`
      )

      if (saleId === undefined) {
        console.warn(`Formato inválido para ID de venta`)
        idSkipedDueToErrors.push({
          saleId: saleId || 'indefinido',
          error: 'Formato inválido en la venta o la nota'
        })
        try {
          processingResults.push({
            saleId: saleId || 'indefinido',
            status: 'ERROR',
            error: 'Formato inválido en la venta o la nota'
          })
        } catch (e) {}
        continue
      }

      if (saleId.trim() === '') {
        console.warn(`ID de venta vacío. El campo de ID es requerido.`)
        idSkipedDueToErrors.push({
          saleId: '',
          error: 'ID de venta vacío. El campo de ID es requerido.'
        })
        try {
          processingResults.push({ saleId: '', status: 'ERROR', error: '' })
        } catch (e) {}
        continue
      }

      if (saleId.includes(' ') || saleId.includes('\t')) {
        console.warn(
          `Formato de ID de venta inválido: ${saleId}. El ID no debe contener espacios ni tabulaciones.`
        )
        idSkipedDueToErrors.push({
          saleId: saleId,
          error: 'ID inválido, contiene espacios o tabulaciones'
        })
        try {
          processingResults.push({
            saleId: saleId,
            status: 'ERROR',
            error: 'ID inválido, contiene espacios o tabulaciones'
          })
        } catch (e) {}
        continue
      }

      if (saleId.length < 5 || saleId.length > 20) {
        if (saleId.length < 5) {
          console.warn(
            `ID de venta muy corto: ${saleId}. Debe tener al menos 5 caracteres.`
          )
          idSkipedDueToErrors.push({
            saleId: saleId,
            error: 'ID muy corto (mínimo 5 caracteres)'
          })
          try {
            processingResults.push({
              saleId: saleId,
              status: 'ERROR',
              error: 'ID muy corto (mínimo 5 caracteres)'
            })
          } catch (e) {}
        } else {
          console.warn(
            `ID de venta muy largo: ${saleId}. Debe tener menos de 20 caracteres.`
          )
          idSkipedDueToErrors.push({
            saleId: saleId,
            error: 'ID muy largo (máximo 20 caracteres)'
          })
          try {
            processingResults.push({
              saleId: saleId,
              status: 'ERROR',
              error: 'ID muy largo (máximo 20 caracteres)'
            })
          } catch (e) {}
        }
        continue
      }

      await processOneSaleId(saleId)
    }
    processingResults.push({
      saleId: 'Fin del proceso',
      status: 'INFO',
      note: formatDateForExcel(new Date().toLocaleString())
    })

    // Auto-download CSV with results to avoid losing the report
    try {
      downloadResultsCSV(processingResults)
    } catch (e) {
      console.warn('Error descargando CSV de resultados:', e)
    }

    showModalWithResultsAndErrors()

    function showModalWithResultsAndErrors () {
      const resultModal = document.createElement('div')
      resultModal.style.position = 'fixed'
      resultModal.style.top = '0'
      resultModal.style.left = '0'
      resultModal.style.width = '100%'
      resultModal.style.height = '100%'
      resultModal.style.backgroundColor = 'rgba(0, 0, 0, 0.6)'
      resultModal.style.backdropFilter = 'blur(4px)'
      resultModal.style.display = 'flex'
      resultModal.style.alignItems = 'center'
      resultModal.style.justifyContent = 'center'
      resultModal.style.zIndex = '9999'

      const resultModalContent = document.createElement('div')
      resultModalContent.style.backgroundColor = '#fff'
      resultModalContent.style.padding = '30px'
      resultModalContent.style.borderRadius = '12px'
      resultModalContent.style.width = '600px'
      resultModalContent.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)'
      resultModalContent.style.fontFamily =
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
      resultModalContent.style.display = 'flex'
      resultModalContent.style.flexDirection = 'column'

      resultModalContent.innerHTML = `
                <h2 style="margin-top: 0; margin-bottom: 10px; color: #333; font-size: 22px;">
                    Proceso finalizado
                </h2>

                <p style="margin-bottom: 15px; color: #666; font-size: 14px;">
                    Se han procesado todos los numero de venta. A continuación el reporte de estado:
                </p>

                <div style="
                    max-height: 300px;
                    overflow-y: auto;
                    background-color: #f9f9f9;
                    border: 1px solid #eee;
                    border-radius: 6px;
                    padding: 10px;
                ">
                    <ul id="errorList" style="list-style: none; padding: 0; margin: 0;"></ul>
                </div>

                <div style="margin-top: 20px; display: flex; justify-content: flex-end;">
                    <button id="closeResultModal" style="
                        padding: 10px 25px;
                        background-color: #9C27B0;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: 600;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                    ">
                        Terminar
                    </button>
                </div>
            `

      resultModal.appendChild(resultModalContent)
      document.body.appendChild(resultModal)

      const errorList = document.getElementById('errorList')

      if (idSkipedDueToErrors.length === 0) {
        errorList.innerHTML = `
            <li style="
                padding: 15px;
                text-align: center;
                color: #2e7d32;
                font-weight: 500;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            ">
                <span style="font-size: 20px;">✓</span>
                ¡Éxito! Se consiguieron todas las notas exitosamente.
            </li>`
      } else {
        idSkipedDueToErrors.forEach(errorInfo => {
          const listItem = document.createElement('li')
          listItem.style.padding = '12px'
          listItem.style.borderBottom = '1px solid #eee'
          listItem.style.fontSize = '13px'
          listItem.style.lineHeight = '1.4'
          listItem.style.color = '#333'

          const saleId = errorInfo.saleId || '—'
          const note = errorInfo.note || '—'
          const errMsg = errorInfo.error || 'Error desconocido'

          const row = document.createElement('div')
          row.style.display = 'flex'
          row.style.justifyContent = 'space-between'
          row.style.alignItems = 'flex-start'
          row.style.gap = '12px'

          const left = document.createElement('div')
          const saleLabel = document.createElement('div')
          saleLabel.textContent = 'Venta'
          saleLabel.style.fontSize = '12px'
          saleLabel.style.color = '#666'
          const saleValue = document.createElement('div')
          saleValue.textContent = saleId
          saleValue.style.fontFamily =
            "ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', monospace"
          saleValue.style.fontWeight = '700'
          saleValue.style.marginTop = '4px'
          left.appendChild(saleLabel)
          left.appendChild(saleValue)

          const right = document.createElement('div')
          right.style.maxWidth = '60%'
          const noteLabel = document.createElement('div')
          noteLabel.textContent = 'Nota'
          noteLabel.style.fontSize = '12px'
          noteLabel.style.color = '#666'
          const noteValue = document.createElement('div')
          noteValue.textContent = note || ''
          noteValue.style.fontSize = '13px'
          noteValue.style.color = '#444'
          noteValue.style.whiteSpace = 'pre-wrap'
          noteValue.style.wordBreak = 'break-word'
          noteValue.style.marginTop = '4px'
          if (note !== '—') noteValue.style.fontStyle = 'italic'
          right.appendChild(noteLabel)
          right.appendChild(noteValue)

          row.appendChild(left)
          row.appendChild(right)

          const errDiv = document.createElement('div')
          errDiv.textContent = errMsg
          errDiv.style.color = '#d32f2f'
          errDiv.style.fontSize = '12px'
          errDiv.style.marginTop = '8px'

          listItem.appendChild(row)
          listItem.appendChild(errDiv)

          errorList.appendChild(listItem)
        })
      }

      const closeResultModalButton = document.getElementById('closeResultModal')
      closeResultModalButton.onclick = () => {
        salesIds = []
        idSkipedDueToErrors = []
        processingResults = []
        enableButtonsFromToolbar()
        document.body.removeChild(resultModal)
      }
    }
  }
}

function formatDateForExcel (dateString) {
  if (!dateString) return ''
  const d = new Date(dateString)
  if (isNaN(d)) return dateString
  const pad = n => String(n).padStart(2, '0')
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
    `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  )
}

function disableButtonsFromToolbarAndSetCurrentOneAsInProgress (
  buttonToSetInProgress
) {
  const toolbar = document.getElementById('toolBar')
  if (!toolbar) {
    console.warn(
      'No se encontró la barra de herramientas para deshabilitar los botones.'
    )
    return
  }

  const buttons = toolbar.querySelectorAll('button')

  buttons.forEach(btn => {
    if (btn.id === 'toolbarToggle') return

    btn.disabled = true
    btn.style.cursor = 'not-allowed'
    btn.style.backgroundColor = '#808080'
    btn.addEventListener('mouseenter', () => {
      btn.style.backgroundColor = '#808080'
    })

    btn.addEventListener('mouseleave', () => {
      btn.style.backgroundColor = '#808080'
    })
  })

  if (buttonToSetInProgress) {
    buttonToSetInProgress.disabled = true
    buttonToSetInProgress.style.cursor = 'not-allowed'
    buttonToSetInProgress.style.backgroundColor = '#FFA500'
    buttonToSetInProgress.addEventListener('mouseenter', () => {
      buttonToSetInProgress.style.backgroundColor = '#FFA500'
    })

    buttonToSetInProgress.addEventListener('mouseleave', () => {
      buttonToSetInProgress.style.backgroundColor = '#FFA500'
    })
  }
}

function enableButtonsFromToolbar () {
  const toolbar = document.getElementById('toolBar')
  if (!toolbar) {
    console.warn(
      'No se encontró la barra de herramientas para habilitar los botones.'
    )
    return
  }

  const buttons = toolbar.querySelectorAll('button')

  buttons.forEach(btn => {
    if (btn.id === 'toolbarToggle') return

    btn.disabled = false
    btn.style.cursor = 'pointer'
    btn.style.backgroundColor = '#9C27B0'
    btn.addEventListener('mouseenter', () => {
      btn.style.backgroundColor = '#7B1FA2'
    })

    btn.addEventListener('mouseleave', () => {
      btn.style.backgroundColor = '#9C27B0'
    })
  })
}

/**
 * Download a report in CSV
 * @param {*} results
 * @param {string} model defaults to nothing, options: publicationsDetails
 */
function downloadResultsCSV (results, model) {
  if (!Array.isArray(results)) return

  const esc = v =>
    '"' +
    String(v === undefined || v === null ? '' : v).replace(/"/g, '""') +
    '"'
  let header = []
  let lines = []

  if (!model) {
    header = [
      'Nro Venta/Tracking',
      'Nota',
      'Estado',
      'Error',
      'Fecha de Venta',
      'Precio',
      'Unidades',
      'SKU'
    ]
    lines = [header.map(esc).join(';')]

    for (const r of results) {
      let saleVal =
        r.saleId === undefined || r.saleId === null ? '' : String(r.saleId)
      let sku = r.sku === undefined || r.sku === null ? '' : String(r.sku)
      let unidades =
        r.unidades === undefined || r.unidades === null
          ? ''
          : String(r.unidades)

      // Trim: " unidad" and " unidades"
      if (unidades.endsWith(' unidad')) {
        unidades = unidades.slice(0, -7).trim()
      } else if (unidades.endsWith(' unidades')) {
        unidades = unidades.slice(0, -9).trim()
      }

      // Trim "SKU: "
      if (sku.startsWith('SKU: ')) {
        sku = sku.slice(5).trim()
      } else if (sku.startsWith('SKU ')) {
        sku = sku.slice(4).trim()
      }

      if (saleVal !== '' && !saleVal.startsWith('#')) saleVal = '#' + saleVal
      lines.push(
        [
          saleVal,
          r.note ?? '-',
          r.status ?? '-',
          r.error ?? '-',
          r.dateOfSaleText ?? '-',
          r.price ?? '-',
          unidades ?? '-',
          sku ?? '-'
        ]
          .map(esc)
          .join(';')
      )
    }
  } else if (model === 'publicationsDetails') {
    header = [
      'Titulo',
      'SKU',
      'Stock en el local',
      'Stock en FULL',
      'Precio',
      'ID Publicacion',
      'Tipo de opcion de venta',
      'Metodo de envio',
      'Condiciones de envio',
      'Monto de envio',
      'Ganancia tras venta',
      'Es catalogo',
      'Estado',
      'Precio automatico'
    ]

    lines = [header.map(esc).join(';')]

    for (const r of results) {
      lines.push(
        [
          r.title,
          r.SKU ?? '-',
          r.inStoreStock ?? '-',
          r.inFULLStock ?? '-',
          r.price ?? '-',
          r.saleOptionID ?? '-',
          r.numberOfInstallments ?? '-',
          r.shippingMethod ?? '-',
          r.shippingConditions ?? '-',
          r.shippingAmount ?? '_',
          r.earnings ?? '-',
          r.listingStatus ?? '-',
          r.status ?? '-',
          r.automaticPrices ?? '-'
        ]
          .map(esc)
          .join(';')
      )
    }
  }

  const csv = lines.join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')
  a.download = `resultados-${timestamp}.csv`
  document.body.appendChild(a)
  a.click()
  setTimeout(() => {
    URL.revokeObjectURL(url)
    try {
      document.body.removeChild(a)
    } catch (e) {}
  }, 1000)
}

function disableButtons (page, listOfButtonsToDisable) {
  const toolbar = document.getElementById('toolBar')

  if (!toolbar) {
    console.warn(
      'No se encontró la barra de herramientas para deshabilitar los botones.'
    )
    return
  }

  const buttons = toolbar.querySelectorAll('button')

  buttons.forEach(btn => {
    btn.disabled = true
    btn.style.cursor = 'not-allowed'
    btn.style.backgroundColor = '#808080'
    btn.addEventListener('mouseenter', () => {
      btn.style.backgroundColor = '#808080'
    })

    btn.addEventListener('mouseleave', () => {
      btn.style.backgroundColor = '#808080'
    })
  })
}


// Boton para copiar el titulo de la publicacion al portapapeles
(() => {
    "use strict";

    const BUTTON_CLASS = "ep-copy-title-btn";

    // Configuración para cada página
    const pages = [
        {
            match: /^\/publicaciones$/,
            rows: ".sll-list-grid__rows",
            item: ":scope > *",
            title: ".sll-list-row-title"
        },
        {
            match: /^\/publicaciones\/listado\/promos$/,
            rows: ".sc-list-grid",
            item: ".sc-list-row",
            title: ".sc-list-description__title"
        },
        {
            match: /^\/ventas\/omni\/listado$/,
            rows: ".sc-list.sc-list-marketplace",
            item: ".sc-row.sc-row-marketplace",
            title: ".description-container .label.bold"
        }
    ];

    function getConfig() {
        const path = window.location.pathname;
        return pages.find(p => p.match.test(path));
    }

    const config = getConfig();

    if (!config) {
        console.log("EP Copy Title: Página no soportada.");
        return;
    }

    function createButton(titleElement) {

        const button = document.createElement("button");

        button.className = BUTTON_CLASS;
        button.type = "button";
        button.textContent = "Copiar título";

        Object.assign(button.style, {
            background: "#9C27B0",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "6px 10px",
            marginTop: "8px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "12px",
            zIndex: "9999",
            boxShadow: "0 4px 10px rgba(0,0,0,.15)"
        });

        button.addEventListener("click", async (e) => {

            e.preventDefault();
            e.stopPropagation();

            try {

                await navigator.clipboard.writeText(titleElement.innerText.trim());

                const txt = button.textContent;

                button.textContent = "¡Copiado!";

                setTimeout(() => {
                    button.textContent = txt;
                }, 2000);

            } catch (err) {
                console.error(err);
            }

        });

        return button;
    }

    function addButtons() {

        const rows = document.querySelector(config.rows);

        if (!rows)
            return;

        const items = rows.querySelectorAll(config.item);

        items.forEach(item => {

            if (!rows.contains(item))
                return;

            if (item.querySelector("." + BUTTON_CLASS))
                return;

            const title = item.querySelector(config.title);

            if (!title)
                return;

            const button = createButton(title);

            if (title.parentElement) {
                title.parentElement.appendChild(button);
            } else {
                item.appendChild(button);
            }

        });

    }

    function cleanupButtons() {

        const rows = document.querySelector(config.rows);

        if (!rows)
            return;

        document.querySelectorAll("." + BUTTON_CLASS).forEach(button => {

            if (!rows.contains(button)) {
                button.remove();
            }

        });

    }

    let observerRows = null;

    function observeRows() {

        const rows = document.querySelector(config.rows);

        if (!rows)
            return;

        if (observerRows)
            observerRows.disconnect();

        observerRows = new MutationObserver((mutations) => {

            let changed = false;

            for (const mutation of mutations) {

                if (mutation.addedNodes.length || mutation.removedNodes.length) {
                    changed = true;
                    break;
                }

            }

            if (!changed)
                return;

            cleanupButtons();
            addButtons();

        });

        observerRows.observe(rows, {
            childList: true,
            subtree: true
        });

        cleanupButtons();
        addButtons();

    }

    // Observa toda la página por si React reemplaza el listado
    const observerPage = new MutationObserver(() => {
        observeRows();
    });

    observerPage.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Primer intento
    observeRows();

})();