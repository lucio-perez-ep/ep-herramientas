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

            if (item.querySelector("." + BUTTON_CLASS))
                return;

            const title = item.querySelector(config.title);

            if (!title)
                return;

            const button = createButton(title);

            // Boton cerca del título
            if (title.parentElement) {

                title.parentElement.appendChild(button);

            } else {

                item.appendChild(button);

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

        observerRows = new MutationObserver(() => {

            addButtons();

        });

        observerRows.observe(rows, {

            childList: true,
            subtree: true

        });

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