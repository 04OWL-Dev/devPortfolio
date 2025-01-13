const sidebarToggle = document.querySelector('.sidebar-toggle')
const closeBtn = document.querySelector('.close-btn')
const sidebar = document.querySelector('.sidebar')
const sidebarClasses = sidebar.classList
sidebarToggle.addEventListener('click', () => {
    sidebarClasses.toggle('show-sidebar')
})
closeBtn.addEventListener('click', () => {
    sidebarClasses.toggle('show-sidebar')
})