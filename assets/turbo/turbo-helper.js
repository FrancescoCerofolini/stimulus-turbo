import {Modal} from "bootstrap";

const TurboHelper = class {
    constructor() {

        document.addEventListener('shown.bs.modal', () => {
            if (document.querySelector('meta[name="turbo-cache-control"]')) {
                // non modificarno altri che fai peggio de meglio
                return;
            }

            const meta = document.createElement('meta');
            meta.name = 'turbo-cache-control';
            meta.content = "no-cache";
            meta.dataset.removablie = true;
            document.querySelector('head').appendChild(meta);

            document.addEventListener('hidden.bs.modal', () => {
                const meta = document.querySelector('meta[name="turbo-cache-control"]')
                if (!meta || !meta.dataset.removable) {
                    return;
                }
                meta.remove();
            })

        })

        document.addEventListener('turbo:before-cache', (event) => {
            this.closeModal();
            this.closeSweetAlert();
        });

        document.addEventListener('turbo:before-render', () => {
            document.querySelector('#weatherwidget-io-js').remove();
        })
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
