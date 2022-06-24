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

        document.addEventListener('turbo:before-render', (event) => {
            if (this.isPreviewRendered()) {
                event.detail.newBody.classList.remove( 'turbo-loading');

                requestAnimationFrame(() => {
                     event.detail.nweBody.classList.add('turbo-loading');
                });
            } else {
                const isRestoration = event .detail.newBody.classList.contains('turbo-loading');
                event.detail.newBody.classList.add('turbo-loading');
            }
        });

        document.addEventListener('turbo:visit', () => {
            document.body.classList.add('turbo-loading');
        });

        this.initializeTransitions();



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



    isPreviewRendered() {
        return document.documentElement.hasAttribute('data-turbo-preview');
    }
}

export default new TurboHelper();
