// import "Authentikey/";
function forceScrollTop() {
    window.scrollTo(0, 0);
}


function enableScrollLock() {
    window.addEventListener("scroll", forceScrollTop);
}


function disableScrollLock() {
    window.removeEventListener("scroll", forceScrollTop);
}

const tourAnchor = document.querySelector('.start-tour');


const driver = window.driver.js.driver;

const nextSvg = "⏭";     // Double right arrow  
const previousSvg = "⏮"; // Double left arrow  
const closeSvg = "✖";   // Close (X) icon  



const tourDetails = {
    popoverClass: 'driverjs-theme',
    animate: true,
    showProgress: true,
    showButtons: ['next', 'previous', 'close'],
    nextBtnText: nextSvg,
    prevBtnText: previousSvg,
    doneBtnText: closeSvg,
    steps: [
        {
            element: ".tour-logo",
            popover: {
                title: "👋 Welcome to Authentikey!",
                description: "Hey there! Authentikey helps ICCT Antipolo students manage their computer usage with ease. Click \"⏭\" to check it out!",
                side: "bottom",
                align: "center",
                onNextClick: () => {
                    document.querySelector("#my-account").click();
                    driverObj.moveNext();
                }
            }
        },
        {
            element: ".tour-nav",
            popover: {
                title: "🧭 Navigation Bar",
                description: "This is your go-to panel for navigating the site. Explore away!",
                side: "bottom",
                align: "center",
                onNextClick: () => {
                    document.querySelector(".tour-dashboard").click();
                    driverObj.moveNext();
                },
            },
            
        },
        {
            element: ".tour-dashboard",
            popover: {
                title: "📊 Dashboard",
                description: "Here’s where all your computer usage data lives. Stay informed!",
                side: "bottom",
                align: "center",
                
            }
        },
        {
            element: ".tour-total-logins",
            popover: {
                title: "📊 Total Logins",
                description: "Check out your total logins for this week and last week. Stay on top of your activity!",
                side: "bottom",
                align: "center"
            },
        },
        {
            element: ".tour-recent-used",
            popover: {
                title: "🖥️ Last Used PC",
                description: "See the last computer you used and when you last logged in. Handy, right?",
                side: "bottom",
                align: "center"
            },
        },
        {
            element: ".tour-pending-request",
            popover: {
                title: "⏳ Pending Requests",
                description: "This shows how many correction requests you’ve submitted. Click here to check your requests!",
                side: "bottom",
                align: "center"
            },
        },
        {
            element: ".tour-search-bar",
            popover: {
                title: "🔍 Search Bar",
                description: "Need to find something fast? Use this search bar to filter the table like a pro!",
                side: "bottom",
                align: "center"
            },
        },
        {
            element: ".tour-download-excel",
            popover: {
                title: "📥 Export Data",
                description: "Want to download your logs? Click here to export the table!<br/><br/> <strong>Pro tip:</strong> Use the search bar first to filter only what you need.",
                side: "bottom",
                align: "center"
            },
        },
        {
            element: ".tour-table",
            popover: {
                title: "📄 Computer Usage Logs",
                description: "Here’s a detailed table of all your computer usage logs. Keep track of everything right here!",
                side: "right",
                align: "center"
            },
        },
        {
            element: ".tour-graph",
            popover: {
                title: "📈 Login Trends",
                description: "Check out this bar chart to see your login activity over the past two months and this month!",
                side: "left",
                align: "center",
                onPrevClick: () => {
                    document.querySelector(".tour-dashboard").click();
                    driverObj.movePrevious();
                },
                onNextClick: () => {
                    document.querySelector(".tour-correction").click();
                    driverObj.moveNext();
                }
            },
        },
        {
            element: ".tour-correction",
            popover: {
                title: "✏️ Correction Requests",
                description: "Found something off in your logs? No worries! You can request a fix right here.",
                side: "bottom",
                align: "center",
                onPrevClick: () => {
                    document.querySelector(".tour-dashboard").click();
                    driverObj.movePrevious();
                },
            }
        },
        {
            element: ".tour-request-correction",
            popover: {
                title: "✏️ Request a Correction",
                description: "Spotted a mistake in your logs? No worries! Fill out this form to request a fix from the admins. ✅",
                side: "top",
                align: "center",
                
                onNextClick: () => {
                    document.querySelector(".tour-contact").click();
                    driverObj.moveNext();
                }
            },
        },        
        {
            element: ".tour-contact",
            popover: {
                title: "🐞 Report an Issue",
                description: "Spotted a bug? Let our dev team know, and we’ll squash it! 🚀",
                side: "bottom",
                align: "center",
                onPrevClick: () => {
                    document.querySelector(".tour-correction").click();
                    driverObj.movePrevious();
                },
                // onNextClick: () => {
                //     document.querySelector(".tour-contact").click();
                //     driverObj.moveNext();
                // }
            }
        },
        {
            element: ".tour-contact-dev",
            popover: {
                title: "✉️ Contact the Dev Team",
                description: "Got a bug? Fill out this form to send a report straight to the dev team. We'll fix it ASAP! 🛠️",
                side: "top",
                align: "center",
                onPrevClick: () => {
                    document.querySelector("#my-account").click();
                    driverObj.movePrevious();
                },
                onNextClick: () => {
                    document.querySelector("#my-account").click();
                    driverObj.moveNext();
                }
            },
        },        
        {
            element: ".tour-my-acc-btn",
            popover: {
                title: "👤 My Account",
                description: "Tap this to access your account settings and options.",
                side: "bottom",
                align: "end"
            }
        },
        {
            element: ".tour-my-acc-menu",
            popover: {
                title: "⚙️ Account Menu",
                description: "Manage your account, tweak settings, and explore options right here!",
                side: "bottom",
                align: "end"
            }
        },
        {
            element: ".tour-theme-mode",
            popover: {
                title: "🎨 Theme Mode",
                description: "Light or dark? Switch between themes and set the vibe that suits you best!",
                side: "left",
                align: "center"
            }
        },
        {
            element: ".tour-personal-info-anchor",
            popover: {
                title: "👤 Personal Info",
                description: "Manage your details and tweak your account settings right here!",
                side: "left",
                align: "center"
            }
        },
        {
            element: ".tour-qr-code-anchor",
            popover: {
                title: "📲 QR Code",
                description: "View and export your unique ID QR code with just a click!",
                side: "left",
                align: "center"
            }
        },
        {
            element: ".tour-show-me-around-anchor",
            popover: {
                title: "🗺️ Show Me Around",
                description: "New here? Click this for a guided tour and get the full breakdown of all the features!",
                side: "left",
                align: "center"
            }
        },
        {
            element: ".tour-sign-out-anchor",
            popover: {
                title: "🚪 Sign Out",
                description: "Done for now? Click here to log out safely.",
                side: "left",
                align: "center"
            },
            
        },
        
    ],
    onDestroyStarted: () => {
        if (!driverObj.hasNextStep() || confirm("Are you sure?")) {
            console.log('Close Button Clicked-2');
            disableScrollLock();
            driverObj.destroy();
        }
    },
}

// {
//     element: ".",
//     popover: {
//         title: "",
//         description: "",
//         side: "left",
//         align: "center"
//     }
// },

const driverObj = driver(tourDetails);


tourAnchor.addEventListener('click', (event) => {
    event.stopPropagation();
    event.preventDefault();

    enableScrollLock();
    
    
    driverObj.drive()

})