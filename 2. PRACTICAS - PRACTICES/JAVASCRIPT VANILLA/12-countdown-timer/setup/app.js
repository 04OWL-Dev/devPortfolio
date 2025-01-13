const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const deadline = document.querySelector('.deadline')
const giveaway = document.querySelector('.giveaway')
const items = document.querySelectorAll('.deadline-format h4')

let tempDate = new Date()
let tempYear = tempDate.getFullYear()
let tempMonth = tempDate.getMonth()
let tempDay = tempDate.getDate()

const futureDate = new Date(tempYear, tempMonth, tempDay+10, 8, 30, 0)
const year = futureDate.getFullYear()
const hour = futureDate.getHours()
const minutes = futureDate.getMinutes()
const month = futureDate.getMonth()
const day = futureDate.getDay()
const date = futureDate.getDate()


giveaway.textContent = `Giveaway ends on ${weekdays[day]} ${months[month]} ${date} ${year} ${hour}:${minutes}am`

//future time in ms
const futureTime = futureDate.getTime()
const currentTime = new Date().getTime()
const getRemainingTime = (currentTime, futureTime, countdown) => {
  const remaining = futureTime - currentTime

  const oneDay = 24 * 60 * 60 * 1000
  const oneHour = 60 * 60000
  const oneMinute = 60000

  let days = Math.floor(remaining/oneDay)
  let hours = Math.floor((remaining%oneDay)/oneHour)
  let minutes = Math.floor((remaining % oneHour) / oneMinute)
  let seconds = Math.floor((remaining % oneMinute) / 1000) 
  
  const values = [days, hours, minutes, seconds]

  const format = (item) => {
    if (item < 10) {
      return item = `0${item}`
    }
    return item
  }

  items.forEach((item, index) => {
    item.innerHTML = format(values[index])
  })
  if (remaining < 0) {
    clearInterval(countdown);
    deadline.innerHTML = `<h4 class="expired">Sorry, this giveaway has expired</h4>`
  }
}

//countdown
let countdown = setInterval(getRemainingTime, 1000)
getRemainingTime(currentTime, futureTime, countdown)
