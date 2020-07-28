let addToy = false;


document.addEventListener("DOMContentLoaded", ()=> {
    const cardBody = document.getElementsByClassName('card-body')
    const cardH = document.getElementsByClassName('card h-100')
    const col = document.getElementsByClassName("col-md-4 mb-5")
    const itemsContainer = document.getElementById("items-container")
    const itemsUrl = "http://localhost:3000/api/v1/items"
    const addButton = document.getElementById("add-button")
    const formDiv = document.querySelector('.col-lg-7')
    const form = document.querySelector('form')
   

   

    // HIDDEN FORM 

    addButton.addEventListener("click", () => {
      // hide & seek with the form
      addToy = !addToy;
      if (addToy) {
        formDiv.style.display = "block";
      } else {
        formDiv.style.display = "none";
      }
    });

    // END OF HIDDEN FORM

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
      itemCard.innerHTML = `
        <div class="card h-100">
          <div class="card-body">
           
            <h2 class="card-title">${item.name}</h2>
            <p class="card-text">${item.description}</p>
            <p class="card-text">${item.price}</p>
          </div>
          <div class="card-footer">
            <a href="#" class="btn btn-primary btn-sm">More Info</a>
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
                user_id: 4

            })
        })
        .then(resp => resp.json())
        .then(data => {
            renderOneItem(data)
            form.reset();
        })
        
    })



    fetchItems()
})