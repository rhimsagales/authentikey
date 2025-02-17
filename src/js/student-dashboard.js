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


function filterTable(searchInput, table) {

    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.toLowerCase(); 
        const rows = table.querySelectorAll('tbody > tr');
    
        rows.forEach(row => {
            const cells = row.querySelectorAll('td'); 
            let match = false;
    
            cells.forEach(cell => {
            const cellText = cell.textContent.trim().toLowerCase();
    
            
            if (isValidDate(cellText)) {
                const date = parseDate(cellText); 
                if (date && date.includes(searchTerm)) {
                match = true;
                }
            } 
            else if (cellText.includes(searchTerm)) {
                match = true;
            }
        });
  
        
        if (match) {
            row.style.display = ''; 
            table.style.height ='auto'; 
        } 
        else {
            row.style.display = 'none'; 
        }
        });
    });
}
function isValidDate(dateStr) {
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    return regex.test(dateStr);
}

function parseDate(dateStr) {
    const [day, month, year] = dateStr.split('/'); 
    return `${day}/${month}/${year}`; 
}




const table = document.querySelector('table');
const search = document.querySelector('.search')
filterTable(search, table)