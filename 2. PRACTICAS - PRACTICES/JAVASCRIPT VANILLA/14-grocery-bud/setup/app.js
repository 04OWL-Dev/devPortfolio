// ****** SELECT ITEMS **********
const alert = document.querySelector('.alert')
const form = document.querySelector('.grocery-form')
const grocery = document.getElementById('grocery')
const submitBtn = document.querySelector('.submit-btn')
const container = document.querySelector('.grocery-container')
const list = document.querySelector('.grocery-list')
const clearBtn = document.querySelector('.clear-btn')
// edit option
let editElement;
let editFlag = false;
let editID = '';
// ****** EVENT LISTENERS **********
const addItem = (e) => {
    e.preventDefault()
    const value = grocery.value
    const id = new Date().getTime().toString()
    if(value && !editFlag){
        createListItem(id, value)
        displayAlert('Item added to the list', 'success')
        container.classList.add('show-container')
        //add to local storage
        addToLocalStorage(id, value)
        //set to default
        setBackToDefault()
    }else if(value && editFlag) {
        editElement.innerHTML = value
        displayAlert('Value changed', 'sucess')
        submitBtn.textContent = 'Submit'
        grocery.value = ''
        //edit local storage
        editLocalStorage(editID, value)
        setBackToDefault()
        
    }else{
        displayAlert('Please enter value', 'danger')
    }
}
form.addEventListener('submit', addItem)//¿por que tiene que ir esto despues?

// ****** FUNCTIONS **********

//load content

const setupItems = () => {
    let items = getLocalStorage()
    if (items.length > 0) {
        items.forEach(item => {
            createListItem(item.id, item.value)
        })
        container.classList.add('show-container')
    }
}

window.addEventListener('DOMContentLoaded',setupItems)


//clear all items
const clearItems = () => {
    const items = document.querySelectorAll('.grocery-item')
    if (items.length > 0) {
        items.forEach(item => {
            list.removeChild(item)
        })
    }
    container.classList.remove('show-container')
    displayAlert('Empty list', 'danger')
    setBackToDefault()
    localStorage.removeItem('list')
}
clearBtn.addEventListener('click', clearItems)

const createListItem = (id, value) => {
    const element = document.createElement('article')
        element.classList.add('grocery-item')
        const attr = document.createAttribute('data-id')
        attr.value = id;
        element.setAttributeNode(attr)
        element.innerHTML =
            `<p class="title">${value}</p>
            <div class="btn-container">
                <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
                </button>
                <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
                </button>
            </div>` 
        const deleteBtn = element.querySelector('.delete-btn')//Se busca la clase dentro de todo el elemento.
        const editBtn = element.querySelector('.edit-btn')
        deleteBtn.addEventListener('click', deleteItem)
        editBtn.addEventListener('click', editItem)
        list.appendChild(element)
}

//display alert
const displayAlert = (text, action) => {
    alert.textContent = text
    alert.classList.add(`alert-${action}`)
    //Remove alert
    setTimeout(() => {
        alert.classList.remove(`alert-${action}`)
        alert.textContent = ''
    }, 2000)
}

//set back to default
const setBackToDefault = () => {
    grocery.value = ''
    editFlag = false
    editID = ''
    submitBtn.textContent = 'Submit'
}

//delete function
const deleteItem = (e) => {
    const element = e.currentTarget.parentElement.parentElement
    const id = element.dataset.id
    list.removeChild(element)
    if (list.children.length === 0) {
        container.classList.remove('show-container')
    }
    displayAlert('Item removed', 'danger')
    setBackToDefault()
    //remove from localStorage
    removeFromLocaStorage(id)
    
}
//edit function
const editItem = (e) => {
    const element = e.currentTarget.parentElement.parentElement
    //set edit item
    editElement = e.currentTarget.parentElement.previousElementSibling
    //set form value
    grocery.value = editElement.innerHTML
    editFlag = true
    editID = element.dataset.id
    submitBtn.textContent = 'Edit'
}

// ****** LOCAL STORAGE **********
const addToLocalStorage = (id, value) => {
    const grocery = { id, value }
    let items = getLocalStorage()
    items.push(grocery)
    localStorage.setItem('list', JSON.stringify(items))
}

const removeFromLocaStorage = (id) => {
    let items = getLocalStorage()
    items = items.filter((item) => {
        if (item.id !== id) {
            return item
        }
    })
    localStorage.setItem('list', JSON.stringify(items))
}

const editLocalStorage = (id, value) => {
    let items = getLocalStorage()
    items = items.map((item) => {
        if (item.id === id) {
            item.value = value
        }
        return item
    })
    localStorage.setItem('list', JSON.stringify(items))
}

const getLocalStorage = () => {
    return localStorage.getItem('list') ? JSON.parse(localStorage.getItem('list')) : [];
}
// ****** SETUP ITEMS **********


