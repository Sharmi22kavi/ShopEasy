// Product List

const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 1999,
        rating: "⭐⭐⭐⭐☆",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"
    },

    {
        id: 2,
        name: "Smart Watch",
        price: 2999,
        rating: "⭐⭐⭐⭐⭐",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"
    },

    {
        id: 3,
        name: "Laptop",
        price: 55999,
        rating: "⭐⭐⭐⭐⭐",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500"
    },

    {
        id: 4,
        name: "Gaming Mouse",
        price: 899,
        rating: "⭐⭐⭐⭐☆",
        image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=500"
    },

    {
        id: 5,
        name: "Bluetooth Speaker",
        price: 1499,
        rating: "⭐⭐⭐⭐☆",
        image: "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=500"
    },

    {
        id: 6,
        name: "Keyboard",
        price: 999,
        rating: "⭐⭐⭐⭐☆",
        image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500"
    }
];


// Display Products

function displayProducts(data) {

    const container = document.getElementById("product-container");

    if (!container) return;

    container.innerHTML = "";

    data.forEach(product => {

        container.innerHTML += `

<div class="card">

<img src="${product.image}">

<div class="card-body">

<h3>${product.name}</h3>

<p class="price">₹${product.price}</p>

<p class="rating">${product.rating}</p>

<button onclick="addToCart(${product.id})">

Add to Cart

</button>

</div>

</div>

`;

    });

}

displayProducts(products);


// Search

const search = document.getElementById("search");

if (search) {

    search.addEventListener("keyup", () => {

        const value = search.value.toLowerCase();

        const filter = products.filter(item =>

            item.name.toLowerCase().includes(value)

        );

        displayProducts(filter);

    });

}

// -------------------------
// CART FUNCTIONS
// -------------------------

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Update Cart Count
function updateCartCount() {
    const count = document.getElementById("cart-count");

    if (count) {
        count.innerText = cart.length;
    }
}

updateCartCount();

// Add to Cart
function addToCart(id) {

    const product = products.find(item => item.id === id);

    cart.push(product);

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();

    alert(product.name + " added to cart!");
}

// Display Cart Items
function displayCart() {

    const cartContainer = document.getElementById("cart-items");

    if (!cartContainer) return;

    cartContainer.innerHTML = "";

    let total = 0;

    if (cart.length === 0) {

        cartContainer.innerHTML =
            "<h2 style='text-align:center'>🛒 Your Cart is Empty</h2>";

        const totalPrice = document.getElementById("total-price");

        if (totalPrice) {
            totalPrice.innerHTML = "₹0";
        }

        return;
    }

    cart.forEach((item, index) => {

        total += item.price;

        cartContainer.innerHTML += `

        <div class="cart-item">

            <img src="${item.image}" alt="${item.name}">

            <div class="cart-info">

                <h3>${item.name}</h3>

                <p class="cart-price">₹${item.price}</p>

                <p>${item.rating}</p>

            </div>

            <button
                class="remove-btn"
                onclick="removeItem(${index})">

                Remove

            </button>

        </div>

        `;

    });

    const totalPrice = document.getElementById("total-price");

    if (totalPrice) {
        totalPrice.innerHTML = "₹" + total;
    }
}

displayCart();

// Remove Item
function removeItem(index) {

    cart.splice(index, 1);

    localStorage.setItem("cart", JSON.stringify(cart));

    displayCart();

    updateCartCount();

}

// Clear Cart
function clearCart() {

    cart = [];

    localStorage.removeItem("cart");

    displayCart();

    updateCartCount();

}

// -------------------------
// CHECKOUT & ORDERS
// -------------------------

let orders = JSON.parse(localStorage.getItem("orders")) || [];

// Go to Checkout
function checkout() {

    if (cart.length === 0) {

        alert("Your cart is empty!");

        return;
    }

    window.location.href = "checkout.html";
}

// Go to Payment
function proceedToPayment() {

    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;

    if (!name || !phone || !address) {
        alert("Please fill all details.");
        return;
    }

    localStorage.setItem("customerName", name);
    localStorage.setItem("customerPhone", phone);
    localStorage.setItem("customerAddress", address);

    window.location.href = "payment.html";
}// Place Order
async function placeOrder() {
    const payment = document.getElementById("paymentMethod");

    if (!payment || payment.value === "") {
        alert("Please select a payment method.");
        return;
    }
    const currentUser =
    JSON.parse(localStorage.getItem("currentUser"));

    const order = {

        
        userId: currentUser.id,
        customer: localStorage.getItem("customerName"),
        phone: localStorage.getItem("customerPhone"),
        address: localStorage.getItem("customerAddress"),
        payment: payment.value,
        items: cart,
        total: cart.reduce((sum, item) => sum + item.price, 0),
        date: new Date().toLocaleString(),
        status: "Order Confirmed"
    };

    try {
        const response = await fetch("http://localhost:5000/api/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(order)
        });

        const data = await response.json();

        if (response.ok) {
            alert("🎉 Order Placed Successfully!");

            localStorage.removeItem("cart");
            cart = [];

            window.location.href = "orders.html";
        } else {
            alert("Order failed: " + data.message);
        }
    } catch (error) {
        console.error("Error placing order:", error);
        alert("Something went wrong while placing order.");
    }
}

// Display Orders
// Display Orders
async function displayOrders() {
    const container = document.getElementById("orders-container");

    if (!container) return;

    container.innerHTML = "<h2 style='text-align:center'>Loading orders...</h2>";

    try {
        const response = await fetch("http://localhost:5000/api/orders");
        const orders = await response.json();

        const currentUser =
JSON.parse(localStorage.getItem("currentUser"));

const myOrders =
orders.filter(order =>
   String(order.user_id) === String(currentUser.id)
);

        if (orders.length === 0) {
            container.innerHTML =
                "<h2 style='text-align:center'>No Orders Found</h2>";
            return;
        }

        container.innerHTML = "";

        myOrders
.filter(order => order.status !== "Cancelled")
.forEach(order => {

            container.innerHTML += `
                <div class="order-card">
                    <h2>Order ID : ${order.id}</h2>
                    <p><b>Name:</b> ${order.name}</p>
                    <p><b>Phone:</b> ${order.phone}</p>
                    <p><b>Address:</b> ${order.address}</p>
                    <button onclick="cancelOrder(${order.id})">
   Cancel Order
</button>
                </div>
            `;

        });

    } catch (error) {
        console.error("Error fetching orders:", error);
        container.innerHTML =
            "<h2 style='text-align:center;color:red;'>Failed to load orders</h2>";
    }
}

displayOrders();

fetch("http://localhost:5000")
    .then(response => response.text())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.log(error);
    });  


    async function cancelOrder(id) {

    const confirmCancel =
        confirm("Are you sure you want to cancel this order?");

    if (!confirmCancel) return;

    try {

        await fetch(
            `http://localhost:5000/api/orders/cancel/${id}`,
            {
                method: "PUT"
            }
        );

        alert("Order Cancelled");

        displayOrders();

    } catch (error) {

        console.log(error);

        alert("Cancel Failed");

    }
}



async function register() {
    alert("Register Function Running");
    return;
    


const name = document.getElementById("name").value;
const email = document.getElementById("email").value;
const password = document.getElementById("password").value;

alert(email);
alert("Validation Check");

if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert("Enter Valid Email Address");
    return;
}

if (password.length < 6) {
    alert("Password must be at least 6 characters");
    return;
}


if (!name || !email || !password) {
    alert("Please fill all fields");
    return;
}

try {

    const response = await fetch(
        "http://localhost:5000/api/users/register",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password
            })
        }
    );

    const data = await response.json();

    if (response.ok) {
        alert("Registered Successfully");
        window.location.href = "login.html";
    } else {
        alert(data.message);
    }

} catch (error) {

    console.log(error);
    alert("Registration Failed");

}


}

async function login() {


const email = document.getElementById("email").value;
const password = document.getElementById("password").value;

if (!email || !password) {
    alert("Please fill all fields");
    return;
}

try {

    const response = await fetch(
        "http://localhost:5000/api/users/login",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        }
    );

    const data = await response.json();

    if (response.ok) {

        localStorage.setItem("userId", data.id);
        localStorage.setItem("userName", data.name);
        localStorage.setItem(
    "currentUser",
    JSON.stringify(data)
);

        alert("Login Successful");

        window.location.href = "index.html";

    } else {

        alert("Invalid Email or Password");

    }

} catch (error) {

    console.log(error);
    alert("Login Failed");

}


}

async function register() {


const name = document.getElementById("name").value;
const email = document.getElementById("email").value;
const password = document.getElementById("password").value;

if (!name || !email || !password) {
    alert("Please fill all fields");
    return;
}

try {

    const response = await fetch(
        "http://localhost:5000/api/users/register",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password
            })
        }
    );

    const data = await response.json();

    if (response.ok) {

        localStorage.setItem(
    "currentUser",
    JSON.stringify(data)
);

        alert("Registered Successfully");
        window.location.href = "login.html";

    } else {

        alert(data.message);

    }

} catch (error) {

    console.log(error);
    alert("Registration Failed");

}


}

const currentUser =
JSON.parse(localStorage.getItem("currentUser"));

if (currentUser) {


const userName =
    document.getElementById("user-name");

if (userName) {
    userName.innerText =
        currentUser.name;
}


}

function logout() {


localStorage.removeItem("currentUser");
localStorage.removeItem("userId");
localStorage.removeItem("userName");

alert("Logged Out");

window.location.href = "index.html";


}


const userName = localStorage.getItem("userName");

const loginBtn = document.getElementById("login-btn");
const registerBtn = document.getElementById("register-btn");
const userMenu = document.querySelector(".user-menu");

if (userName) {


document.getElementById("user-name").innerText = userName;

if (loginBtn) loginBtn.style.display = "none";
if (registerBtn) registerBtn.style.display = "none";


} else {


if (userMenu) userMenu.style.display = "none";


}




const profileName =
document.getElementById("profile-name");

const profileEmail =
document.getElementById("profile-email");

if (profileName && profileEmail) {

    const user =
    JSON.parse(localStorage.getItem("currentUser"));

    if (user) {

        profileName.innerText = user.name;
        profileEmail.innerText = user.email;

    }

}

if (window.location.pathname.includes("profile.html")) {

    const profileName =
    document.getElementById("profile-name");

    const profileEmail =
    document.getElementById("profile-email");

    const user =
    JSON.parse(localStorage.getItem("currentUser"));

    if (user) {

        profileName.innerText = user.name;
        profileEmail.innerText = user.email;

    }

}

async function editProfile() {

    const user =
    JSON.parse(localStorage.getItem("currentUser"));

    const newName =
    prompt("Enter New Name", user.name);

    if (!newName) return;

    const response = await fetch(
        `http://localhost:5000/api/users/update/${user.id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: newName
            })
        }
    );

    const data = await response.json();

    localStorage.setItem(
        "currentUser",
        JSON.stringify(data)
    );

    alert("Profile Updated");

    location.reload();
}



if (window.location.pathname.includes("profile.html")) {

    const user =
    JSON.parse(localStorage.getItem("currentUser"));

    if (user) {

        document.getElementById("profile-name").innerText =
        user.name;

        document.getElementById("profile-email").innerText =
        user.email;

    }

}
