// Element.getBoundingClientRect() method returns the size of an element and its position relative to the viewport.
// pageYOffset is a read - only window property that returns the number of pixels the document has been scrolled vertically.
// slice extracts a section of a string without modifying original string
//offsetTop - A Number, representing the top position of the element, in pixels

// ********** set date ************
const date = document.getElementById('date')
date.innerHTML = new Date().getFullYear();
// ********** close links ************
const linksContainer = document.querySelector('.links-container')
const links = document.querySelector('.links')
const toggleBtn = document.querySelector('.nav-toggle')

toggleBtn.addEventListener('click', () => {
    const containerHeight = linksContainer.getBoundingClientRect().height//Tamaño del elemento.
    const linksHeight = links.getBoundingClientRect().height

    if (containerHeight === 0) {
        linksContainer.style.height = `${linksHeight}px`
    } else {
        linksContainer.style.height = 0
    }//Asignacion dinámica de altura.

    /* linksContainer.classList.toggle('show-links') */
})
// ********** fixed navbar ************
const navbar = document.getElementById('nav')
const topLink = document.querySelector('.top-link')
window.addEventListener('scroll', () => {
    const scrollHeight = window.pageYOffset
    const navbarHeight = navbar.getBoundingClientRect().height
    if ( scrollHeight > navbarHeight) {
        navbar.classList.add('fixed-nav')
    } else {
        navbar.classList.remove('fixed-nav')
    }
    if (scrollHeight > 500) {
        topLink.classList.add('show-link')
    } else {
        topLink.classList.remove('show-link')
    }
})
// ********** smooth scroll ************
// select links
const scrollLinks = document.querySelectorAll('.scroll-link') 
scrollLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault()
        const id = e.currentTarget.getAttribute('href').slice(1)
        const element = document.getElementById(id)
        
        //calculate the heights
        const navbarHeight = navbar.getBoundingClientRect().height
        const containerHeight = linksContainer.getBoundingClientRect().height
        const fixedNav = navbar.classList.contains('fixed-nav')
        let position = element.offsetTop - navbarHeight
        if (!fixedNav) {
            position = position - navbarHeight
        }
        if (navbarHeight > 82) {
            position = position + containerHeight
        }
        window.scrollTo({
            left: 0, 
            top: position
        })
        linksContainer.style.height = 0;

    })
})


