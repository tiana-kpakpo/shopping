// localStorage.removeItem('customer_token')
// localStorage.removeItem('customer_id')

window.addEventListener('load', async () => {

    //get all products
    const products = await fetch(`http://localhost:7070/product/v1/products`);
    console.log('products')
    let productItem = await products.json();
    console.log(productItem)
    
    const productWrapper = document.querySelector('.product-wrapper')
    
    const productList = document.createElement('div');
    productList.classList.add('product-container');
    
      let market = '';
      productItem.forEach(product => {
        market += `
        <div class="product" id=${product.id}>
        <img src=${product.image} alt="Product 2">
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        <p class="price">${product.price}</p>
        <button class="add-to-cart" id=${product.id}>Add to Cart</button>
        </div>
        `;
    })
    
    
    productList.innerHTML = market;
    productWrapper.appendChild(productList)
    
    //add to cart
    const addToCartBtn = document.querySelectorAll('.add-to-cart');
    addToCartBtn.forEach(btn => {
    
    btn.addEventListener('click', async (e) => {
            e.preventDefault();
            //code 
            let product_id = btn.id;
            console.log('product id')
            console.log(product_id)
            console.log("customer_id")
            let customer_id = localStorage.getItem('customer_id');
            console.log(customer_id)
            console.log('product price')
            let mainEL = e.target.parentElement;
            const price = mainEL.querySelector('p.price')
            const priceVal = price.innerHTML;
            console.log(priceVal)
    
    
            alert('attempting to add new item to shopping cart' + product_id)
       
    
            const newOrder = fetch('http://localhost:7070/product/v1/order', {
                method: 'POST',
                headers: {
                    "content-type" : "application/json "
                },
                body: JSON.stringify({
                    product_id: +product_id,
                    customer_id: +customer_id,
                    price: +priceVal
                })
    
            }) 
            if(newOrder.status == 200){
                let res = newOrder.json();
                console.log(res)
          
            }
        })
    })
    
    
    });
    
    //self invoking function 
    const createNewCustomerId = async () => {
        
    
    //get customer token
    let customer_token = localStorage.getItem('customer_token');
    
    if (!customer_token){
        customer_token = Math.random() +  new Date().toLocaleDateString()
        console.log("customer token")
        console.log(customer_token)
        //create new customer
    
    const url = 'http://localhost:7070/product/v1/customer';
     const result = await fetch(url, {
        method: 'POST',
        headers: {
            "content-type" : "application/json"
        },
        body: JSON.stringify({
            name: "Jane Doe",
            city: "Random city",
            token: customer_token
        })
     })
    
      if(result.status == 200){
        localStorage.setItem('customer_token', customer_token)
      }
    
    }
    console.log('customer already created')
    }
    
    createNewCustomerId();
    
    const cartNumber = async (customer_token) => {
    console.log("getting cart items list")
    //get cart items number
    // setInterval(() => {
      const result =  await  fetch('http://localhost:7070/product/v1/customer-with-token',{
        method: 'POST',
        headers: {
                    "content-type" : "application/json"
                },
                body: JSON.stringify({
                    token : customer_token
                })
      })
      if(result.status == 200){
        let response = await result.json();
        console.log(response)
        console.log("response id")
        const id = response[0].id;
        console.log(id) 
    
        //store customer id in localstorage
       let customer_id = localStorage.getItem('customer_id');
    
       if(!customer_id){
        localStorage.setItem('customer_id', id);
       }
    
        
        //get orders with customer id 
    
        const rs = await fetch('http://localhost:7070/product/v1/orders-with-customerId',{
            method: 'POST',
            headers: {
                "content-type" : "application/json"
            },
            body: JSON.stringify({
                customer_id : id
            })
    
            });
    
        if(rs.status == 200){
            let orders = await rs.json();
            console.log(orders)
            const {order } = orders;
            const orderCount = order.reduce((count, items)=> {
                return count + 1;
            }, 0)
    
            console.log(orderCount)
            
            const cList = document.querySelector('.cart-number')
            cList.innerHTML = orderCount;
        }
    
    
    
      }
        
    // }, 1500);
    }
    
    // setInterval(() => {
        
    
    let customerToken = localStorage.getItem('customer_token')
    cartNumber(customerToken);
    
    // }, 2000);