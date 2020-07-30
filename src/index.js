//let addProduct = false;


document.addEventListener("DOMContentLoaded", ()=> {
    const cardBody = document.getElementsByClassName('card-body')
    const cardH = document.getElementsByClassName('card h-100')
    const col = document.getElementsByClassName("col-md-4 mb-5")
    const itemsContainer = document.getElementById("items-container")
    const itemsUrl = "http://localhost:3000/api/v1/items"
    const addButton = document.getElementById("add-button")
    const formDiv = document.querySelector('.col-lg-7')
    const form = document.querySelector('form')
    const myItemsBtn = document.querySelector('#my-items-button')
    const cartItemsUrl = "http://localhost:3000/api/v1/cart_items/"

    // console.log(myItemsBtn)
   

    // HIDDEN FORM 

    function addButtonListener () {
        const addButton = document.getElementById("add-button")
        let addProduct = false;
        addButton.addEventListener("click", () => {
            addProduct = !addProduct;
            if (addProduct) {
                formDiv.style.display = "block";
            } else {
                formDiv.style.display = "none";
            }
            });
        }

    // END OF HIDDEN FORM

    //MY ITEMS
    myItemsBtn.addEventListener("click", (e) => {
        fetch(itemsUrl)
            .then(resp => resp.json())
            .then(items => {
                renderUserItems(items)
                renderAddItemButton()
                addButtonListener()
            })
    })

    function renderAddItemButton(){
        const navBar = document.getElementById("nav-bar-container")
        const addItemButton = document.createElement("button")
        addItemButton.type = "button"
        addItemButton.id = "add-button"
        addItemButton.className = "btn btn-outline-light text-dark"
        addItemButton.innerText = "Add Product"
        navBar.insertBefore(addItemButton, myItemsBtn)
    }

    function renderUserItems(items){
        itemsContainer.innerHTML = ""
        items.forEach(item => {
            if (item.user_id === 1){
                renderOneUserItem(item);
            }
        })
    }

    function renderOneUserItem(item){
        const itemCard = document.createElement("div")
        itemCard.className = "col-md-4 mb-5"
        itemCard.dataset.userId = `${item.user_id}` 
        itemCard.innerHTML = `
          <div class="card h-100">
            <div class="card-body">
             
              <h2 class="card-title">${item.name}</h2>
              <img src="${item.image}" alt="..." class="img-thumbnail">
              <p class="card-text">${item.description}</p>
              <p class="card-text">${item.price}</p>
            </div>
            <div class="card-footer">
              <a href="#" data-id=${item.id} id="edit-item-button" class="btn btn-primary btn-sm">Edit Item</a>
              <a href="#" data-id=${item.id} id="delete-item-button" class="btn btn-primary btn-sm">Delete Item</a>
            </div>
          </div>`
          itemsContainer.append(itemCard)
          itemCard.addEventListener("click", e => {
            if (e.target.id === "delete-item-button"){
              const id = e.target.dataset.id
              deleteItem(itemCard, id)
            }
            if (e.target.id === "edit-item-button"){
              const id = e.target.dataset.id
              updateForm(item, itemCard, id)
            }
          })
        }

       function deleteItem (itemCard, id){
           fetch (`${itemsUrl}/${id}`,{
           method: "DELETE"
          })
           itemCard.remove()
        }
       
        function updateForm(item, itemCard, id){
          itemCard.innerHTML = `<div class="card h-100">
          <div class="card-body">
          <h3>Update Item:</h3>
          <form id="update-item-form">
          <input type="text" name="name" value="${item.name}" id = 'item-name' class="input-text"/>
        <br />
        <input type="text" name="image" value="${item.image}" id = 'item-image' class="input-text"/>
        <br />
        <input type="number" name="price" value="${item.price}" id = 'item-price' class="input-text"/>
        <br />
        <input type="text" name="description" value="${item.description}" id = 'item-description' class="input-text"/>
        <br />
        <input type="number" name="quantity" value="${item.quantity}" id = 'item-quantity' class="input-text"/>
        <br />
        <br />
        <input type="submit" name="submit" id="submitButton" value="Update" class="submit"/>
        </form>
        </div>
        </div>`
         
        const form = document.querySelector('#update-item-form')
        form.addEventListener('submit', (e) =>{
          
          e.preventDefault();

          fetch(`${itemsUrl}/${item.id}`,{
            method: "PATCH",
            headers: {
                "content-type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify({
                name: e.target.name.value,
                description: e.target.description.value,
                price: e.target.price.value,
                image: e.target.image.value,
                quantity: e.target.quantity.value,
                user_id: 1
            })
        })
        .then(resp => resp.json())
        .then(data => {
          itemCard.remove()
          renderOneUserItem(data)})

        })
        }

      //END MY ITEMS
    

    function fetchItems(){
    fetch(itemsUrl)
    .then(resp => resp.json())
    .then(items => renderItems(items))
    }

    function renderItems(items){
      items.forEach(item => renderOneItem(item))
    }

    function renderOneItem(item){
      const itemCard = document.createElement("div")
      itemCard.className = "col-md-4 mb-5"
      itemCard.dataset.userId = `${item.user_id}` 
      itemCard.innerHTML = `
        <div class="card h-100">
          <div class="card-body">
           
            <h2 class="card-title">${item.name}</h2>
            <img src="${item.image}" alt="..." class="img-thumbnail">
            <p class="card-text">${item.description}</p>
            <p class="card-text">${item.price}</p>
          </div>
          <div class="card-footer">
            <a href="#/" data-item-id= ${item.id} class="btn btn-primary btn-sm">Add to Cart</a>
          </div>
        </div>`
        itemsContainer.append(itemCard)
    }


    form.addEventListener("submit", (e) =>{
        e.preventDefault();
        // console.log("in event",form.name.value)
        
        fetch(itemsUrl,{
            method: "POST",
            headers: {
                "content-type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify({
                name: form.name.value,
                description: form.description.value,
                price: form.price.value,
                image: form.image.value,
                quantity: form.quantity.value,
                user_id: 1

            })
        })
        .then(resp => resp.json())
        .then(data => {
            renderOneItem(data)
            form.reset();
        })
        
    })

    //TOGGLE CART CODE

    //Add to cart code 

    document.addEventListener("click", e=>{
        if(e.target.innerText === "Add to Cart"){
            fetch(`${itemsUrl}/${e.target.dataset.itemId}`)
                .then(resp => resp.json())
                .then(item => fetchCart(item))
        }
        if(e.target.id === "cart-delete"){
          fetch(cartItemsUrl + e.target.dataset.id, {
          method: "DELETE"
          })
          const li = e.target.closest("li")
          li.remove()
        }
    })

    function fetchCart(item) {
        fetch(cartItemsUrl,{
            method: "POST",
            headers: {
                "content-type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify({
                item_id: item.id,
                cart_id: 1
            })
        })
        .then(resp => resp.json())
        .then(data => addToCart(data.item))
    }

    function addToCart(item){
        const cartUl = document.getElementById("cart-drop-down")
        const cartLi = document.createElement('li')
        cartLi.innerHTML = `
            <span class="item">
                <span class="item-left">
                    <span class="item-info">
                        <span>${item.name}</span>
                        <span>$ ${item.price}</span>
                    </span>
                </span>
                <span class="item-right">
                    <button data-id= ${item.id} id= "cart-delete" class="btn btn-xs btn-danger pull-right">x</button>
                </span>
            </span>
        `
        cartUl.prepend(cartLi)  
    }

    const dropDown = document.getElementById("cart-items-dropdown")
    dropDown.addEventListener("click", e => {
        if (e.target.dataset.toggle === "dropdown"){
            renderCartItems()
        }
            
    })

    function renderCartItems(){
        fetch("http://localhost:3000/api/v1/cart_items/")
            .then(resp => resp.json())
            .then(data => data.forEach(function(data){
                addToCart(data.item)
            }))
    }

    
    //Add to cart close 
   
    //<img src=${item.image} alt="" /> 


    fetchItems()
})