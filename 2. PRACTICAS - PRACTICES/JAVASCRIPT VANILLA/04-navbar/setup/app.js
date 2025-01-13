// classList - shows/gets all classes
// contains - checks classList for specific class
// add - add class
// remove - remove class
// toggle - toggles class
const navButton = document.querySelector('.nav-toggle')
const links = document.querySelector('.links')
navButton.addEventListener('click', () => {
    const classes = links.classList
    classes.toggle('show-links')
    /* if (classes.contains('show-links')) {
        classes.remove('show-links')
    } else {
        classes.add('show-links')
    } */    
})
