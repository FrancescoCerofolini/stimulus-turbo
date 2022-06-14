import {Modal} from "bootstrap";

const TurboHelper = class {
    constructor() {

        document.addEventListener('turbo:before-cache', (event) => {
            this.closeModal();
            this.closeSweetAlert();
        });
    }

    closeModal() {
        if (document.body.classList.contains('modal-open')) {
            const modalEl = Modal.getInstance(document.querySelector('.modal'));
            const modal = Modal.getInstance(modalEl);
            modalEl.classList.remove('fade');
            modal._backdrop._config.isAnimated = false;
            modal.hide();
            modal.dispose();
        }
    }

    closeSweetAlert() {
        // internal way to see if sweetalert2 has been imported yet
        if (__webpack_modules__[require.resolveWeak('sweetalert2')]) {
            // because we know it's been imported, this will run synchronously
            import(/* webpackMode: 'weak' */'sweetalert2').then((Swal) => {
                if (Swal.isVisible()) {
                    Swal.getPopup().style.animationDuration = '0ms';
                    Swal.close();
                }
            })
        }
    }
}

export default new TurboHelper();
