const colors = ["green", "red", "rgba(133,122,200)", "#f15025"];
const btn = document.getElementById('btn')
const color = document.querySelector('.color')

btn.addEventListener('click', () => {
    //get random number between 0-3 because of the array.
    const randonNumber = getRandomNumber()
    document.body.style.backgroundColor = colors[randonNumber]
    color.textContent = colors[randonNumber]
})

const getRandomNumber = () => {
    return Math.floor(Math.random() * colors.length)
}

