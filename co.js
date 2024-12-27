class Cart {
    constructor() {
        this.items = [];
    }

    addItem(candy) {
        const existingItem = this.items.find(item => item.id === candy.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({ ...candy, quantity: 1 });
        }
        this.updateUI();
    }

    removeItem(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.updateUI();
    }

    updateQuantity(id, quantity) {
        if (quantity === 0) {
            this.removeItem(id);
            return;
        }
        const item = this.items.find(item => item.id === id);
        if (item) {
            item.quantity = quantity;
            this.updateUI();
        }
    }

    getTotal() {
        return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }

    updateUI() {
        const cartCount = document.getElementById('cartCount');
        const itemCount = this.items.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = itemCount;

        const cartItems = document.getElementById('cartItems');
        cartItems.innerHTML = this.items.length === 0 
            ? '<p class="text-center">Your cart is empty</p>'
            : this.items.map(item => this.createCartItemHTML(item)).join('');


        const cartTotal = document.getElementById('cartTotal');
        cartTotal.textContent = `₹${this.getTotal().toFixed(2)}`;
    }

    createCartItemHTML(item) {
        return `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <p>₹${item.price}</p>
                    <div class="cart-item-controls">
                        <button class="quantity-btn" onclick="cart.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="cart.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                        <button class="remove-btn" onclick="cart.removeItem(${item.id})">Remove</button>
                    </div>
                </div>
            </div>
        `;
    }
}


const candyData = [
    {
        id: 1,
        name: "Chocolate Truffles",
        description: "Luxurious dark chocolate truffles with a smooth ganache center",
        price: 120.99,
        category: "chocolate",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&q=80&w=1000"
    },
    {
        id: 2,
        name: "Rainbow Gummy Bears",
        description: "Colorful and chewy gummy bears in assorted fruit flavors",
        price: 50.99,
        category: "gummies",
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&q=80&w=1000"
    },
    {
        id: 3,
        name: "Artisan Lollipops",
        description: "Handcrafted gourmet lollipops with natural flavors",
        price: 30.99,
        category: "lollipops",
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1575224300306-1b8da36134ec?auto=format&fit=crop&q=80&w=1000"
    },
    {
        id: 4,
        name: "Peppermint Sticks",
        description: "Traditional red and white striped peppermint candy sticks",
        price: 40.99,
        category: "hard candy",
        rating: 4.3,
        image: "https://images.unsplash.com/photo-1481391319762-47dff72954d9?auto=format&fit=crop&q=80&w=1000"
    },
    {
        id: 5,
        name: "Sea Salt Caramels",
        description: "Smooth caramel covered in dark chocolate with sea salt",
        price: 140.99,
        category: "chocolate",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&q=80&w=1000"
    },
    {
        id: 6,
        name: "Sour Worms",
        description: "Tangy and sweet sour gummy worms in vibrant colors",
        price: 400.99,
        category: "gummies",
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1499195333224-3ce974eecb47?auto=format&fit=crop&q=80&w=1000"
    },
    {
        id: 7,
        name: "Fruit Lollipops",
        description: "Assorted fruit-flavored spiral lollipops",
        price: 200.99,
        category: "lollipops",
        rating: 4.4,
        image: "https://images.unsplash.com/photo-1499195333224-3ce974eecb47?auto=format&fit=crop&q=80&w=1000"
    },
    {
        id: 8,
        name: "Butterscotch Discs",
        description: "Classic butterscotch hard candies",
        price: 300.99,
        category: "hard candy",
        rating: 4.2,
        image: "https://images.unsplash.com/photo-1600359746315-119f1360d663?auto=format&fit=crop&q=80&w=1000"
    }
];

const cart = new Cart();

const candyGrid = document.getElementById('candyGrid');
const cartModal = document.getElementById('cartModal');
const cartBtn = document.getElementById('cartBtn');
const closeCart = document.getElementById('closeCart');
const searchInput = document.getElementById('searchInput');
const categoryBtns = document.querySelectorAll('.category-btn');

let currentCategory = 'all';
let searchQuery = '';


cartBtn.addEventListener('click', () => cartModal.classList.add('active'));
closeCart.addEventListener('click', () => cartModal.classList.remove('active'));
cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) cartModal.classList.remove('active');
});

searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase();
    renderCandies();
});

categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.dataset.category;
        renderCandies();
    });
});


function renderCandies() {
    const filteredCandies = candyData.filter(candy => 
        (currentCategory === 'all' || candy.category === currentCategory) &&
        (candy.name.toLowerCase().includes(searchQuery) ||
         candy.description.toLowerCase().includes(searchQuery))
    );

    candyGrid.innerHTML = filteredCandies.map(candy => {
        const candyJson = JSON.stringify(candy).replace(/"/g, '&quot;');
        return `
            <div class="candy-card">
                <img src="${candy.image}" alt="${candy.name}" class="candy-image">
                <div class="candy-info">
                    <div class="candy-header">
                        <h3 class="candy-name">${candy.name}</h3>
                        <span class="candy-rating">⭐ ${candy.rating}</span>
                    </div>
                    <p class="candy-description">${candy.description}</p>
                    <div class="candy-footer">
                        <span class="candy-price">₹${candy.price}</span>
                        <button class="add-to-cart" onclick="cart.addItem(${candyJson})">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}


renderCandies();
