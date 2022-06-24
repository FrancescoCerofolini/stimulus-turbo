import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
    connect() {
        if (typeof __weatherwidget_init === 'function') {
            __weatherwidget_init();
        } else {
            this.initializeScriptTag(document, 'script', 'weatherwdiget-io-js');
        }
    }

    initializeScriptTag (d,s, id) {
        let js, fjs = d.getElementsByTagName(s)[0];
        if (!d.getElementById(id)) {
            js = d.createElement(s);
            js.id = id;
            js.src = "https://weatherwidget.io/js/widget.min.js";
            fjs.parentNode.insertBefore(js, fjs);
        }
    };
}
