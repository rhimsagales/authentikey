const burgerBtn = document.getElementById('burger-btn');
const sidebar = document.getElementById('sidebar');
const navLinksButton = document.querySelectorAll('.desk-nav-btn');

const mobNavButton = document.querySelectorAll('.mob-nav-btn');

const myAccount = document.getElementById('my-account');
const myAccountTwo = document.getElementById('my-account-two');

const myAccountMenu = document.querySelector('.my-account-menu');
const myAccountMenuTwo = document.querySelector('.my-account-menu-two');

burgerBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    event.preventDefault();

    sidebar.classList.toggle('expand');
    burgerBtn.classList.toggle('show-sidebar')
});


navLinksButton.forEach(button => {
    button.addEventListener('click', (event) => {
        event.preventDefault();

        // Ensure the clicked element is the button itself
        const clickedButton = event.currentTarget;

        // Reset all nav buttons to 'btn-ghost'
        navLinksButton.forEach(btn => btn.classList.replace('btn-primary', 'btn-ghost'));

        // Set the clicked button to 'btn-primary'
        clickedButton.classList.replace('btn-ghost', 'btn-primary');

        // Sync with mobile navigation buttons
        const clickedText = clickedButton.innerText.trim();
        mobNavButton.forEach(btn => {
            btn.classList.toggle('selected', btn.innerText.trim() === clickedText);
        });
    });
});




mobNavButton.forEach(button => {
    button.addEventListener('click',(event) => {
        event.preventDefault();

        const clickedButton = event.currentTarget;

        mobNavButton.forEach(button => {
            if(button.classList.contains('selected')) {
                button.classList.remove('selected');
            }
            
        });

        clickedButton.classList.add('selected');

        navLinksButton.forEach(btn => {
            btn.classList.replace('btn-primary', 'btn-ghost');
        });

        navLinksButton.forEach(btn => {
            if(clickedButton.innerText == btn.innerText) {
                btn.classList.replace('btn-ghost', 'btn-primary');
            }
        })

        
    })
})


myAccount.addEventListener('click', (event) => {
    event.preventDefault();

    if(myAccountMenu.classList.contains('hidden')) {
        myAccountMenu.classList.replace('hidden', 'flex');
        myAccount.classList.add('open-modal');
    }
    else {
        myAccountMenu.classList.replace('flex', 'hidden');
        myAccount.classList.remove('open-modal');

    }
})

myAccountTwo.addEventListener('click', (event) => {
    event.preventDefault();

    if(myAccountMenuTwo.classList.contains('hidden')) {
        myAccountMenuTwo.classList.replace('hidden', 'flex');
        myAccountTwo.classList.add('open-modal');
    }
    else {
        myAccountMenuTwo.classList.replace('flex', 'hidden');
        myAccountTwo.classList.remove('open-modal');

    }
})