// Copy all the JavaScript from the script tag in the original HTML file
// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.style.background = 'rgba(255,0,0,0.9)';
    } else {
        nav.style.background = '#ff0000';
    }
});

// Cart functionality
const cartIcon = document.getElementById('cartIcon');
const cartMenu = document.getElementById('cartMenu');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutModal = document.getElementById('checkoutModal');
const closeCheckoutModal = checkoutModal.querySelector('.close');

let cart = [];

function saveLoginState(isLoggedIn) {
    localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
}

function getLoginState() {
    return JSON.parse(localStorage.getItem('isLoggedIn')) || false;
}

let isUserLoggedIn = getLoginState();

cartIcon.addEventListener('click', () => {
    if (isLoggedIn()) {
        cartMenu.classList.add('open');
    } else {
        showLoginModal();
    }
});

closeCart.addEventListener('click', () => {
    cartMenu.classList.remove('open');
});

function addToCart(id, name, price, image) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ id, name, price, quantity: 1, image });
    }
    updateCart();
    alert(`${name} has been added to your cart!`);
}

function updateCart() {
    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" width="50" height="50">
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p>$${item.price} x ${item.quantity}</p>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn minus" data-id="${item.id}">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn plus" data-id="${item.id}">+</button>
            </div>
        `;
        cartItems.appendChild(itemElement);
        total += item.price * item.quantity;
    });
    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

cartItems.addEventListener('click', (e) => {
    if (e.target.classList.contains('quantity-btn')) {
        const id = e.target.dataset.id;
        const item = cart.find(item => item.id === id);
        if (e.target.classList.contains('plus')) {
            item.quantity++;
        } else if (e.target.classList.contains('minus')) {
            item.quantity--;
            if (item.quantity === 0) {
                cart = cart.filter(cartItem => cartItem.id !== id);
            }
        }
        updateCart();
    }
});

// Login and Register Modal functionality
const loginBtn = document.getElementById('loginBtn');
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const switchToRegister = document.getElementById('switchToRegister');
const switchToLogin = document.getElementById('switchToLogin');
const closeLoginModal = loginModal.querySelector('.close');
const closeRegisterModal = registerModal.querySelector('.close');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const registerNowBtn = document.getElementById('registerNowBtn');

function showLoginModal() {
    loginModal.style.display = 'block';
}

function hideLoginModal() {
    loginModal.style.display = 'none';
}

function showRegisterModal() {
    registerModal.style.display = 'block';
}

function hideRegisterModal() {
    registerModal.style.display = 'none';
}

loginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (isUserLoggedIn) {
        // If user is logged in, log them out
        isUserLoggedIn = false;
        saveLoginState(false);
        loginBtn.textContent = 'Login';
        alert('You have been logged out.');
    } else {
        // If user is not logged in, show login modal
        showLoginModal();
    }
});

closeLoginModal.addEventListener('click', hideLoginModal);
closeRegisterModal.addEventListener('click', hideRegisterModal);

switchToRegister.addEventListener('click', (e) => {
    e.preventDefault();
    hideLoginModal();
    showRegisterModal();
});

switchToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    hideRegisterModal();
    showLoginModal();
});

registerNowBtn.addEventListener('click', (e) => {
    e.preventDefault();
    showRegisterModal();
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    // Here you would typically validate the login credentials
    // For this example, we'll just log the user in
    isUserLoggedIn = true;
    saveLoginState(true);
    hideLoginModal();
    loginBtn.textContent = 'Logout';
    alert('You have been logged in successfully!');
});

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    // Here you would typically send this data to your server to create a new user
    // For this example, we'll just log the user in
    isUserLoggedIn = true;
    saveLoginState(true);
    hideRegisterModal();
    loginBtn.textContent = 'Logout';
    alert('You have been registered and logged in successfully!');
});

// Update login button text on page load
if (isUserLoggedIn) {
    loginBtn.textContent = 'Logout';
}

// Function to check if user is logged in
function isLoggedIn() {
    return isUserLoggedIn;
}

// Add to cart functionality for store items
const addToCartButtons = document.querySelectorAll('.add-to-cart');
addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (isLoggedIn()) {
            const id = button.dataset.id;
            const name = button.dataset.name;
            const price = parseFloat(button.dataset.price);
            const image = button.closest('.product-card').querySelector('img').src;
            addToCart(id, name, price, image);
        } else {
            showLoginModal();
        }
    });
});

// Checkout functionality
checkoutBtn.addEventListener('click', () => {
    if (cart.length > 0) {
        checkoutModal.style.display = 'block';
    } else {
        alert('Your cart is empty!');
    }
});

closeCheckoutModal.addEventListener('click', () => {
    checkoutModal.style.display = 'none';
});

const checkoutForm = document.getElementById('checkoutForm');
checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('checkoutName').value;
    const email = document.getElementById('checkoutEmail').value;
    // Here you would typically process the payment and send order details
    // For this example, we'll just simulate sending an email
    sendOrderConfirmationEmail(name, email);
    alert('Thank you for your purchase! An order confirmation has been sent to your email.');
    cart = [];
    updateCart();
    checkoutModal.style.display = 'none';
    cartMenu.classList.remove('open');
});

function sendOrderConfirmationEmail(name, email) {
    // This is a mock function. In a real application, you would send this data to your server
    // to process the email sending.
    console.log(`Sending order confirmation to ${name} at ${email}`);
    console.log('Order details:');
    cart.forEach(item => {
        console.log(`${item.name} - Quantity: ${item.quantity} - Price: $${item.price * item.quantity}`);
    });
    console.log(`Total: $${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}`);
}

// Gym Plans
const plans = [
    { 
        name: "Basic", 
        price: 29.99, 
        features: ["Access to gym equipment", "Locker room access", "Free water refills"],
        description: "Perfect for beginners who want to start their fitness journey with essential gym access."
    },
    { 
        name: "Standard", 
        price: 49.99, 
        features: ["All Basic plan features", "Group fitness classes", "Fitness assessment"],
        description: "Ideal for those who want to mix individual workouts with group classes for added motivation."
    },
    { 
        name: "Premium", 
        price: 79.99, 
        features: ["All Standard plan features", "Personal trainer sessions (2x/month)", "Sauna access"],
        description: "For dedicated fitness enthusiasts who want personalized guidance and premium amenities."
    },
    { 
        name: "Elite", 
        price: 99.99, 
        features: ["All Premium plan features", "Nutrition consultation", "24/7 gym access", "Guest passes (2/month)"],
        description: "The ultimate fitness experience with round-the-clock access and exclusive perks."
    },
    { 
        name: "Corporate", 
        price: 199.99, 
        features: ["All Elite plan features", "Team building sessions", "Office gym setup", "Wellness workshops"],
        description: "Tailored for businesses looking to boost employee wellness and team cohesion."
    }
];

function renderGymPlans() {
    const planGrid = document.getElementById('planGrid');
    planGrid.innerHTML = '';
    plans.forEach(plan => {
        const planCard = document.createElement('div');
        planCard.classList.add('plan-card');
        planCard.innerHTML = `
            <h3>${plan.name}</h3>
            <div class="price">$${plan.price}/month</div>
            <p>${plan.description}</p>
            <ul>
                ${plan.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
            <button class="btn add-to-cart" data-id="${plan.name}" data-name="${plan.name} Plan" data-price="${plan.price}">Add to Cart</button>
        `;
        planGrid.appendChild(planCard);
    });
}

renderGymPlans();

function addToCartListeners() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (isLoggedIn()) {
                const id = button.dataset.id;
                const name = button.dataset.name;
                const price = parseFloat(button.dataset.price);
                const image = "/placeholder.svg?height=100&width=100"; // placeholder image for plans
                addToCart(id, name, price, image);
            } else {
                showLoginModal();
            }
        });
    });
}

addToCartListeners();

// Contact form submission
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // Here you would typically send this data to your server
    // For this example, we'll just log it to the console
    console.log('Contact form submission:');
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);
    
    alert('Thank you for your message. We will get back to you soon!');
    contactForm.reset();
});

// Admin functionality
const adminBtn = document.getElementById('adminBtn');
const adminLoginModal = document.getElementById('adminLoginModal');
const adminLoginForm = document.getElementById('adminLoginForm');
const closeAdminLoginModal = adminLoginModal.querySelector('.close');

adminBtn.addEventListener('click', (e) => {
    e.preventDefault();
    adminLoginModal.style.display = 'block';
});

closeAdminLoginModal.addEventListener('click', () => {
    adminLoginModal.style.display = 'none';
});

adminLoginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    // Here you would typically validate admin credentials
    // For this example, we'll use a simple check
    if (email === 'admin@example.com' && password === 'admin123') {
        adminLoginModal.style.display = 'none';
        // Redirect to admin page
        window.location.href = 'admin.html';
    } else {
        alert('Invalid admin credentials');
    }
});
// Replace any hardcoded URLs with Django URL tags, e.g.:
// document.getElementById('adminBtn').href = "{% url 'admin_panel' %}";