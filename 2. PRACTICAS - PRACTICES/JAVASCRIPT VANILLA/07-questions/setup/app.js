//using selectors inside the element
const questions = document.querySelectorAll('.question')

questions.forEach(question => {
    const btn = question.querySelector('.question-btn')
    btn.addEventListener('click', () => {
        const questionClasses = question.classList
        questions.forEach(item => {
            if (item !== question) {
                item.classList.remove('show-text')
            }
        })
        questionClasses.toggle('show-text')
    })
})

// traversing the dom

/* const questionBtn = document.querySelectorAll('.question-btn')
questionBtn.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const question = e.currentTarget.parentElement.parentElement 
        const questionClasses = question.classList
        questionClasses.toggle('show-text')
    })
}) */



