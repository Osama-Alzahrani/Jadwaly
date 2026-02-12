class message {
    static #counter = 0;
    static success(msg, delay = 3000) {
        let id = `notification-content-${message.#counter}`;
       $("#notifications").append(`
            <div
                id= "${id}"
                class="flex m-4 rounded-lg px-4 py-3 bg-lime-700 text-white shadow-lg animate-slide-fade transition-discrete"
                style="align-items: center;"
                role="alert"
            >
                <svg class="w-6 h-6 text-gray-800 dark:text-white mx-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 11.917 9.724 16.5 19 7.5"/>
                </svg>

                <span id="notification-message" class="text-sm">${msg}</span>
            </div>
            `);
        message.#counter++;
        setTimeout(() => {
            new message().#controlNotification($(`#${id}`)[0]);
        }, delay);
    }

    static error(msg, delay = 3000) {
        let id = `notification-content-${message.#counter}`;
       $("#notifications").append(`
            <div
                id= "${id}"
                class="flex m-4 rounded-lg px-4 py-3 bg-red-700 text-white shadow-lg animate-slide-fade transition-discrete align-middle"\
                style="align-items: center;"
                role="alert"
            >
                <svg class="w-6 h-6 text-gray-800 dark:text-white mx-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v5a1 1 0 1 0 2 0V8Zm-1 7a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H12Z" clip-rule="evenodd"/>
                </svg>
                <span id="notification-message" class="text-sm">${msg}</span>
            </div>
            `);
        message.#counter++;
        setTimeout(() => {
            new message().#controlNotification($(`#${id}`)[0]);
        }, delay);
    }

    #controlNotification(el) {
        const animation = el.animate(
            [
                { opacity: '0' },
            ],
            {
                duration: 500,
            }
        )

        animation.onfinish = () => el.remove()
    }
}
