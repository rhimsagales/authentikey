// Admin Tour Script for Desktop and Mobile

function forceScrollTop() {
    window.scrollTo(0, 0);
}


function enableScrollLock() {
    window.addEventListener("scroll", forceScrollTop);
}


function disableScrollLock() {
    window.removeEventListener("scroll", forceScrollTop);
}

const deskTopNavLinks = {
    homepage: document.querySelector('.tour-homepage'),
    analytics: document.querySelector('.tour-analytics'),
    import: document.querySelector('.tour-import'),
    correction: document.querySelector('.tour-correction'),
    logs: document.querySelector('.tour-logs'),
    deleteLogs: document.querySelector('.tour-delete-logs'),
    bug: document.querySelector('.tour-bug'),
    roleManagementOpenClose : document.querySelector('.tour-role'),
    activityLogOpen : document.querySelector('.tour-activity'),
    activityLogClose : document.querySelector('.tour-activity-close'),
    changePasswordOpen : document.querySelector('.tour-change-password'),
    changePasswordClose : document.querySelector('.tour-change-password-close')


}

const navMobile = document.querySelector('.admin-nav-mobile');
const navMobileButton = document.querySelector('#mobile-menu-btn');

const adminModals = ['.activity-remove-blur', '.role-remove-blur', '.change-remove-blur'];

const adminTourAnchor = document.querySelector('.start-admin-tour');
const adminTourAnchorMobile = document.querySelector('.start-admin-tour-mobile');
const driver = window.driver.js.driver;

const nextSvg = "⏭";
const previousSvg = "⏮";
const closeSvg = "✖";

adminTourAnchor.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();

    enableScrollLock();
    forceScrollTop();
    
    adminModals.forEach((modal) => {
        document.querySelector(modal).classList.remove('backdrop-blur-sm')
    });

    const adminTourDetails = {
        overlayColor: "#ffffff00ff",
        popoverClass: 'driverjs-theme',
        animate: true,
        showProgress: true,
        showButtons: ['next', 'previous', 'close'],
        nextBtnText: nextSvg,
        prevBtnText: previousSvg,
        doneBtnText: closeSvg,
        steps: [
            {
                element: ".admin-logo", // logo or brand
                popover: {
                    title: "👋 Welcome Admin!",
                    description: "This is the Authentikey admin dashboard. Let's take a quick tour!",
                    side: "bottom",
                    align: "center"
                }
            },
            {
                element: ".admin-nav", // desktop nav bar
                popover: {
                    title: "🧭 Navigation Bar",
                    description: "Use these links to switch between admin tools and sections.",
                    side: "bottom",
                    align: "center",
                    onNextClick : () => {
                        deskTopNavLinks.homepage.click();
                        adminDriverObj.moveNext();
                    }
                }
            },
            {
                element: ".admin-homepage", // homepage section
                popover: {
                    title: "🏠 Homepage",
                    description: "Quick actions and an overview of your admin tools.",
                    side: "bottom",
                    align: "center",
                    onNextClick : () => {
                        deskTopNavLinks.analytics.click();
                        adminDriverObj.moveNext();
                    }
                }
            },
            {
                element: ".admin-analytics-section",
                popover: {
                    title: "📊 Analytics",
                    description: "Visualize system stats and trends here.",
                    side: "bottom",
                    align: "center",
                    onNextClick : () => {
                        deskTopNavLinks.import.click();
                        adminDriverObj.moveNext();
                    },
                    onPrevClick: () => {
                        deskTopNavLinks.homepage.click();
                        adminDriverObj.movePrevious();
                    }
                }
            },
            {
                element: ".admin-import-section",
                popover: {
                    title: "📥 Import Eligible Students",
                    description: "Upload XLSX files to add eligible students.",
                    side: "bottom",
                    align: "center",
                    onNextClick : () => {
                        deskTopNavLinks.correction.click();
                        adminDriverObj.moveNext();
                    },
                    onPrevClick: () => {
                        deskTopNavLinks.analytics.click();
                        adminDriverObj.movePrevious();
                    }
                }
            },
            {
                element: ".admin-correction-section",
                popover: {
                    title: "✏️ Correction Requests",
                    description: "Review and manage student correction requests.",
                    side: "bottom",
                    align: "center",
                    onNextClick : () => {
                        deskTopNavLinks.logs.click();
                        adminDriverObj.moveNext();
                    },
                    onPrevClick: () => {
                        deskTopNavLinks.import.click();
                        adminDriverObj.movePrevious();
                    }
                }
            },
            {
                element: ".admin-logs-section",
                popover: {
                    title: "📂 Retrieve Logs",
                    description: "Filter and view logs based on your criteria.",
                    side: "bottom",
                    align: "center",
                    onNextClick : () => {
                        deskTopNavLinks.deleteLogs.click();
                        adminDriverObj.moveNext();
                    },
                    onPrevClick: () => {
                        deskTopNavLinks.correction.click();
                        adminDriverObj.movePrevious();
                    }
                }
            },
            {
                element: ".admin-delete-logs-section",
                popover: {
                    title: "🗑️ Delete Logs",
                    description: "Delete logs in bulk. Use filters to target specific records.",
                    side: "bottom",
                    align: "center",
                    onNextClick : () => {
                        deskTopNavLinks.bug.click();
                        adminDriverObj.moveNext();
                    },
                    onPrevClick: () => {
                        deskTopNavLinks.logs.click();
                        adminDriverObj.movePrevious();
                    }
                }
            },
            {
                element: ".admin-bug-section",
                popover: {
                    title: "🐞 Report Bug",
                    description: "Found an issue? Submit a bug report to the dev team.",
                    side: "bottom",
                    align: "center",
                    onNextClick : () => {
                        deskTopNavLinks.roleManagementOpenClose.click();
                        adminDriverObj.moveNext();
                    },
                    onPrevClick: () => {
                        deskTopNavLinks.deleteLogs.click();
                        adminDriverObj.movePrevious();
                    }
                }
                
            },
            {
                element: ".admin-role-section", // Only for Super Admins
                popover: {
                    title: "🛡️ Role Management",
                    description: "Manage admin accounts and roles here. <br><br> <strong>Note:</strong> Only Super Admins can access this section. If you don't see this, you may not have the required permissions.",
                    side: "bottom",
                    align: "center",
                    onNextClick : () => {
                        deskTopNavLinks.roleManagementOpenClose.click();
                        deskTopNavLinks.activityLogOpen.click();
                        adminDriverObj.moveNext();
                    },
                    onPrevClick: () => {
                        deskTopNavLinks.roleManagementOpenClose.click();
                        deskTopNavLinks.bug.click();
                        adminDriverObj.movePrevious();
                    }
                }
            },
            {
                element: ".admin-activity-log-section",
                popover: {
                    title: "📜 Activity Log",
                    description: "View all admin activities for auditing.",
                    side: "bottom",
                    align: "center",
                    onNextClick : () => {
                        deskTopNavLinks.activityLogClose.click();
                        deskTopNavLinks.changePasswordOpen.click();
                        adminDriverObj.moveNext();
                    },
                    onPrevClick: () => {
                        deskTopNavLinks.activityLogClose.click();
                        deskTopNavLinks.roleManagementOpenClose.click();
                        adminDriverObj.movePrevious();
                    }
                }
            },
            {
                element: ".admin-change-password-section",
                popover: {
                    title: "🔑 Change PC Password",
                    description: "Change the Authentikey device password securely.",
                    side: "bottom",
                    align: "center",
                    onNextClick : () => {
                        deskTopNavLinks.changePasswordClose.click();
                        deskTopNavLinks.homepage.click();
                        adminDriverObj.moveNext();
                    },
                    onPrevClick: () => {
                        deskTopNavLinks.changePasswordClose.click();
                        deskTopNavLinks.activityLogOpen.click();
                        adminDriverObj.movePrevious();
                    }
                }
            },
            {
                element: ".done",
                popover: {
                    title: "🎉 Tour Complete!",
                    description: "You’ve explored all the admin features. Happy managing!",
                    side: "left",
                    align: "center",
                    onPrevClick: () => {
                        deskTopNavLinks.changePasswordOpen.click();
                        adminDriverObj.movePrevious();
                    }
                }
            }
        ],
        onDestroyStarted: () => {
            if (!adminDriverObj.hasNextStep() || confirm("Are you sure?")) {
                adminModals.forEach((modal) => {
                    document.querySelector(modal).classList.add('backdrop-blur-sm')
                });
                disableScrollLock();
                adminDriverObj.destroy();
            }
        },
    };

    const adminDriverObj = driver(adminTourDetails);
    adminDriverObj.drive();
});


adminTourAnchorMobile.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();

    enableScrollLock();
    forceScrollTop();
    
    adminModals.forEach((modal) => {
        document.querySelector(modal).classList.remove('backdrop-blur-sm')
    });

    const adminTourDetailsMobile = {
        overlayColor: "#ffffff00ff",
        popoverClass: 'driverjs-theme',
        animate: true,
        showProgress: true,
        showButtons: ['next', 'previous', 'close'],
        nextBtnText: nextSvg,
        prevBtnText: previousSvg,
        doneBtnText: closeSvg,
        steps: [
            {
                element: ".admin-logo", // logo or brand
                popover: {
                    title: "👋 Welcome Admin!",
                    description: "This is the Authentikey admin dashboard. Let's take a quick tour!",
                    side: "bottom",
                    align: "center"
                }
            },
            {
                element: ".admin-nav-mobile", // desktop nav bar
                popover: {
                    title: "🧭 Navigation Bar",
                    description: "Use these links to switch between admin tools and sections.",
                    side: "bottom",
                    align: "center",
                    onNextClick : () => {
                        navMobileButton.click();
                        deskTopNavLinks.homepage.click();
                        adminDriverObjMobile.moveNext();
                    }
                }
            },
            {
                element: ".admin-homepage", // homepage section
                popover: {
                    title: "🏠 Homepage",
                    description: "Quick actions and an overview of your admin tools.",
                    side: "bottom",
                    align: "center",
                    onNextClick : () => {
                        deskTopNavLinks.analytics.click();
                        adminDriverObjMobile.moveNext();
                    },
                    onPrevClick: () => {
                        navMobileButton.click();
                        adminDriverObjMobile.movePrevious();
                    }
                }
            },
            {
                element: ".admin-analytics-section",
                popover: {
                    title: "📊 Analytics",
                    description: "Visualize system stats and trends here.",
                    side: "bottom",
                    align: "center",
                    onNextClick : () => {
                        deskTopNavLinks.import.click();
                        adminDriverObjMobile.moveNext();
                    },
                    onPrevClick: () => {
                        deskTopNavLinks.homepage.click();
                        adminDriverObjMobile.movePrevious();
                    }
                }
            },
            {
                element: ".admin-import-section",
                popover: {
                    title: "📥 Import Eligible Students",
                    description: "Upload XLSX files to add eligible students.",
                    side: "bottom",
                    align: "center",
                    onNextClick : () => {
                        deskTopNavLinks.correction.click();
                        adminDriverObjMobile.moveNext();
                    },
                    onPrevClick: () => {
                        deskTopNavLinks.analytics.click();
                        adminDriverObjMobile.movePrevious();
                    }
                }
            },
            {
                element: ".admin-correction-section",
                popover: {
                    title: "✏️ Correction Requests",
                    description: "Review and manage student correction requests.",
                    side: "bottom",
                    align: "center",
                    onNextClick : () => {
                        deskTopNavLinks.logs.click();
                        adminDriverObjMobile.moveNext();
                    },
                    onPrevClick: () => {
                        deskTopNavLinks.import.click();
                        adminDriverObjMobile.movePrevious();
                    }
                }
            },
            {
                element: ".admin-logs-section",
                popover: {
                    title: "📂 Retrieve Logs",
                    description: "Filter and view logs based on your criteria.",
                    side: "bottom",
                    align: "center",
                    onNextClick : () => {
                        deskTopNavLinks.deleteLogs.click();
                        adminDriverObjMobile.moveNext();
                    },
                    onPrevClick: () => {
                        deskTopNavLinks.correction.click();
                        adminDriverObjMobile.movePrevious();
                    }
                }
            },
            {
                element: ".admin-delete-logs-section",
                popover: {
                    title: "🗑️ Delete Logs",
                    description: "Delete logs in bulk. Use filters to target specific records.",
                    side: "bottom",
                    align: "center",
                    onNextClick : () => {
                        deskTopNavLinks.bug.click();
                        adminDriverObjMobile.moveNext();
                    },
                    onPrevClick: () => {
                        deskTopNavLinks.logs.click();
                        adminDriverObjMobile.movePrevious();
                    }
                }
            },
            {
                element: ".admin-bug-section",
                popover: {
                    title: "🐞 Report Bug",
                    description: "Found an issue? Submit a bug report to the dev team.",
                    side: "bottom",
                    align: "center",
                    onNextClick : () => {
                        deskTopNavLinks.roleManagementOpenClose.click();
                        adminDriverObjMobile.moveNext();
                    },
                    onPrevClick: () => {
                        deskTopNavLinks.deleteLogs.click();
                        adminDriverObjMobile.movePrevious();
                    }
                }
                
            },
            {
                element: ".admin-role-section", // Only for Super Admins
                popover: {
                    title: "🛡️ Role Management",
                    description: "Manage admin accounts and roles here. <br><br> <strong>Note:</strong> Only Super Admins can access this section. If you don't see this, you may not have the required permissions.",
                    side: "bottom",
                    align: "center",
                    onNextClick : () => {
                        deskTopNavLinks.roleManagementOpenClose.click();
                        deskTopNavLinks.activityLogOpen.click();
                        adminDriverObjMobile.moveNext();
                    },
                    onPrevClick: () => {
                        deskTopNavLinks.roleManagementOpenClose.click();
                        deskTopNavLinks.bug.click();
                        adminDriverObjMobile.movePrevious();
                    }
                }
            },
            {
                element: ".admin-activity-log-section",
                popover: {
                    title: "📜 Activity Log",
                    description: "View all admin activities for auditing.",
                    side: "bottom",
                    align: "center",
                    onNextClick : () => {
                        deskTopNavLinks.activityLogClose.click();
                        deskTopNavLinks.changePasswordOpen.click();
                        adminDriverObjMobile.moveNext();
                    },
                    onPrevClick: () => {
                        deskTopNavLinks.activityLogClose.click();
                        deskTopNavLinks.roleManagementOpenClose.click();
                        adminDriverObjMobile.movePrevious();
                    }
                }
            },
            {
                element: ".admin-change-password-section",
                popover: {
                    title: "🔑 Change PC Password",
                    description: "Change the Authentikey device password securely.",
                    side: "bottom",
                    align: "center",
                    onNextClick : () => {
                        deskTopNavLinks.changePasswordClose.click();
                        deskTopNavLinks.homepage.click();
                        adminDriverObjMobile.moveNext();
                    },
                    onPrevClick: () => {
                        deskTopNavLinks.changePasswordClose.click();
                        deskTopNavLinks.activityLogOpen.click();
                        adminDriverObjMobile.movePrevious();
                    }
                }
            },
            {
                element: ".done",
                popover: {
                    title: "🎉 Tour Complete!",
                    description: "You’ve explored all the admin features. Happy managing!",
                    side: "left",
                    align: "center",
                    onPrevClick: () => {
                        deskTopNavLinks.changePasswordOpen.click();
                        adminDriverObjMobile.movePrevious();
                    }
                }
            }
        ],
        onDestroyStarted: () => {
            if (!adminDriverObjMobile.hasNextStep() || confirm("Are you sure?")) {
                adminModals.forEach((modal) => {
                    document.querySelector(modal).classList.add('backdrop-blur-sm')
                });
                disableScrollLock();
                adminDriverObjMobile.destroy();
            }
        },
    };

    const adminDriverObjMobile = driver(adminTourDetailsMobile);
    adminDriverObjMobile.drive();
});

