// localStorage.removeItem('customer_token')
// localStorage.removeItem('customer_id')

document.addEventListener('DOMContentLoaded', () => {
    // Your code here
 
window.addEventListener('load', async () => {
    console.log('store.js is working')


    //getting all the prducts 

    async function getProducts() {
        const url = 'http://localhost:7070/product/v1/products';

        try {
            const result = await fetch(url);
            const response = await result.json();
            console.log(response);

            // Get the product list container
            const productList = document.querySelector('.product_list')

            // Populate the product list in the DOM
            response.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.className = 'product';
                productDiv.innerHTML = `
      <img src="${product.image}" alt="image" class="pdt_img">
      <div class="pdt_title">${product.name}</div>
      <div class="rating-con">
        <span class="material-icons-outlined">star_border</span>
        <span class="material-icons-outlined">star_border</span>
        <span class="material-icons-outlined">star_border</span>
        <span class="material-icons-outlined">star_border</span>
        <span class="material-icons-outlined">star_border</span>
        <span class="material-icons-outlined">expand_more</span>
      </div>
      <div class="pdt_price">$${product.price}</div>
      <div class="pdt_description">${product.description}</div>
      <span class="material-icons-outlined addToCart" id=${product.id}>add_shopping_cart</span>
      `;
       

                productList.appendChild(productDiv);
            });


        }
        catch (error) {
            console.error('error fetching data:', error);
        }
    }

    getProducts();

    //  add to cart
    document.addEventListener('click', async (event) => {

        // if (event.target.classList.contains('addToCart'))
        if (event.target && event.target.classList && event.target.classList.contains('addToCart')) {
            event.preventDefault();
            const productId = event.target.id;
            console.log('Adding product to cart. Product ID:', productId);
            
            let product_id = productId;
            let customer_id = localStorage.getItem('customer_id');
            console.log(customer_id)
            console.log('product price')
            let mainEL = event.target.parentElement;
            const price = mainEL.querySelector('.pdt_price')
            const priceVal = price.innerHTML;
            console.log(priceVal)

            alert('attempting to add new item to shopping cart' + product_id)


                    const newOrder = fetch('http://localhost:7070/shop/v1/order', {
                        method: 'POST',
                        headers: {
                            "content-type": "application/json "
                        },
                        body: JSON.stringify({
                            product_id: +product_id,
                            customer_id: +customer_id,
                            price: +priceVal
                        })

                       
        
                    })
                    console.log((await newOrder).json())

                    if(newOrder.status == 200){
                        let res = newOrder.json();
                        console.log(res)
                  
                    }
       
        }
    })


    // const addToCartBtn = document.querySelectorAll('.pdtCart');

    // addToCartBtn.forEach(btn => {

    //     btn.addEventListener('click', async (e) => {
    //         e.preventDefault();
    //         // alert("hello");

    //         alert('button id ' + btn.id)
    //         //code 
    //         let product_id = btn.id;
    //         console.log('product id')
    //         console.log(product_id)
    //         console.log("customer_id")
    //         let customer_id = localStorage.getItem('customer_id');
    //         console.log(customer_id)
    //         console.log('product price')
    //         let mainEL = e.target.parentElement;
    //         const price = mainEL.querySelector('.pdt_price')
    //         const priceVal = price.innerHTML;
    //         console.log(priceVal)


    //         alert('attempting to add new item to shopping cart' + product_id)


    //         const newOrder = fetch('http://localhost:7070/product/v1/order', {
    //             method: 'POST',
    //             headers: {
    //                 "content-type": "application/json "
    //             },
    //             body: JSON.stringify({
    //                 product_id: +product_id,
    //                 customer_id: +customer_id,
    //                 price: +priceVal
    //             })

    //         })

    //         if ((await newOrder).status == 409) {
    //             alert('item has already been added to cart')
    //         }
    //         if (newOrder.status == 200) {
    //             let res = newOrder.json();
    //             console.log(res)

    //         }
    //     })
    // })
})

//self invoking function 
const createNewCustomerId = async () => {


    //get customer token
    let customer_token = localStorage.getItem('customer_token');

    if (!customer_token) {
        customer_token = Math.random() + new Date().toLocaleDateString()
        console.log("customer token")
        console.log(customer_token)
        //create new customer

        const url = 'http://localhost:7070/shop/v1/customer';
        const result = await fetch(url, {
            method: 'POST',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                name: "Jane Doe",
                city: "Random city",
                token: customer_token
            })
        })

        if (result.status == 200) {
            localStorage.setItem('customer_token', customer_token)
        }

    }
    // console.log('customer already created')
}

createNewCustomerId();

const cartNumber = async (customer_token) => {
    // console.log("getting cart items list")
    const url = 'http://localhost:7070/shop/v1/customer-with-token'
    //get cart items number
    // setInterval(() => {
    const result = await fetch(url, {
        method: 'POST',
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            token: customer_token
        })
    })
    if (result.status == 200) {
        let response = await result.json();
        console.log(response)
        // console.log("response id")
        const id = response[0].id;
        // console.log(id) 

        //store customer id in localstorage
        let customer_id = localStorage.getItem('customer_id');

        if (!customer_id) {
            localStorage.setItem('customer_id', id);
        }


        //get orders with customer id 

        const rs = await fetch('http://localhost:7070/shop/v1/orders-with-customerId', {
            method: 'POST',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                customer_id: id
            })

        });

        if (rs.status == 200) {
            let orders = await rs.json();
            console.log(orders)
            const { order } = orders;
            const orderCount = order.reduce((count, items) => {
                return count + 1;
            }, 0)

            console.log(orderCount)

            const cList = document.querySelector('.pdtCount')
            cList.innerHTML = orderCount;
        }



    }

    // }, 1500);
}

// setInterval(() => {


let customerToken = localStorage.getItem('customer_token')
cartNumber(customerToken);

// }, 2000);

});