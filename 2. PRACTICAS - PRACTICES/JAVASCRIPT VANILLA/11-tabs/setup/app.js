const about = document.querySelector('.about')
const btns = document.querySelectorAll('.tab-btn')
const article = document.querySelectorAll('.content')

about.addEventListener('click', (e) => {
    /*  e.target// elemento especifico dentro de un elemento padre. */
    const id = e.target.dataset.id
    if (id){
        btns.forEach(btn => {
            btn.classList.remove('active')
            e.target.classList.add('active')        
        })
        article.forEach(item => {
            item.classList.remove('active')
            const element = document.getElementById(id)
            element.classList.add('active')
        })
    }
})
