const BASE_URL = 'https://asalshafa-backend.onrender.com';

// لیست محصولات با تصاویر و جزئیات جذاب
const defaultProducts = [
    {
        id: 1,
        name: "عسل طبیعی کوهستان سبلان (یک کیلو)",
        price: 350000,
        oldPrice: 420000,
        discount: 16,
        rating: 4.8,
        reviewsCount: 34,
        image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&auto=format&fit=crop&q=60"
    },
    {
        id: 2,
        name: "عسل چهل گیاه خوانسار درجه یک",
        price: 280000,
        oldPrice: 310000,
        discount: 10,
        rating: 4.6,
        reviewsCount: 19,
        image: "https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=500&auto=format&fit=crop&q=60"
    },
    {
        id: 3,
        name: "عسل آویشن طبیعی با برگه آزمایش",
        price: 490000,
        oldPrice: 580000,
        discount: 15,
        rating: 4.9,
        reviewsCount: 42,
        image: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=500&auto=format&fit=crop&q=60"
    },
    {
        id: 4,
        name: "ژل رویال اصل و ارگانیک (۵۰ گرم)",
        price: 650000,
        oldPrice: 750000,
        discount: 13,
        rating: 5.0,
        reviewsCount: 15,
        image: "https://images.unsplash.com/photo-1579272613974-94edc38869b2?w=500&auto=format&fit=crop&q=60"
    }
];

const productsContainer = document.getElementById('products-container');
const cartCountElement = document.getElementById('cart-count');
const cartItemsContainer = document.getElementById('cart-items');
const totalPriceElement = document.getElementById('total-price');

const cartDrawer = document.getElementById('cart-drawer');
const overlay = document.getElementById('overlay');
const openCartBtn = document.getElementById('open-cart-btn');
const closeCartBtn = document.getElementById('close-cart-btn');

let cart = [];
let totalPrice = 0;

// باز و بسته کردن سایدبار سبد خرید
openCartBtn.addEventListener('click', () => {
    cartDrawer.classList.add('open');
    overlay.classList.add('open');
});

closeCartBtn.addEventListener('click', () => {
    cartDrawer.classList.remove('open');
    overlay.classList.remove('open');
});

overlay.addEventListener('click', () => {
    cartDrawer.classList.remove('open');
    overlay.classList.remove('open');
});

// تابع رندر کردن محصولات روی صفحه
function renderProducts(productsList) {
    productsContainer.innerHTML = '';
    productsList.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div>
                <div class="product-image-wrap">
                    <span class="discount-badge">${product.discount}% تخفیف</span>
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div class="product-rating">
                        <i class="fa-solid fa-star"></i> ${product.rating}
                        <span>(${product.reviewsCount} نظر)</span>
                    </div>
                </div>
            </div>
            
            <div>
                <div class="price-box">
                    <div class="old-price">${product.oldPrice.toLocaleString('fa-IR')} تومان</div>
                    <div class="current-price">${product.price.toLocaleString('fa-IR')} تومان</div>
                </div>
                <button class="add-btn" onclick="addToCart('${product.name}', ${product.price})">
                    <i class="fa-solid fa-cart-plus"></i> افزودن به سبد
                </button>
            </div>
        `;
        productsContainer.appendChild(card);
    });
}

// لود اولیه محصولات
renderProducts(defaultProducts);

// دریافت محصولات هماهنگ شده از سرور آنلاین Render
fetch(`${BASE_URL}/api/products`)
    .then(res => res.json())
    .then(backendProducts => {
        // در صورت برقراری اتصال با سرور، لیست محصولات هماهنگ می‌شود
        console.log("محصولات از سرور آنلاین دریافت شد:", backendProducts);
    })
    .catch(err => {
        console.log("استفاده از محصولات پیش‌فرض (سرور در حالت خواب است)");
    });

// تابع افزودن به سبد خرید
function addToCart(name, price) {
    cart.push({ name, price });
    totalPrice += price;
    updateCartUI();

    // باز کردن موقت کشو برای نشان دادن ثبت کالا
    cartDrawer.classList.add('open');
    overlay.classList.add('open');
}

// بروزرسانی ظاهر سبد خرید
function updateCartUI() {
    cartCountElement.innerText = cart.length;
    totalPriceElement.innerText = totalPrice.toLocaleString('fa-IR');

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-msg">سبد خرید شما در حال حاضر خالی است.</p>';
        return;
    }

    cartItemsContainer.innerHTML = '';
    cart.forEach((item, index) => {
        const row = document.createElement('div');
        row.className = 'cart-item-row';
        row.innerHTML = `
            <div>
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">${item.price.toLocaleString('fa-IR')} تومان</div>
            </div>
            <button onclick="removeFromCart(${index})" style="background:none; border:none; color:#ef4444; cursor:pointer;">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        `;
        cartItemsContainer.appendChild(row);
    });
}

// حذف آیتم از سبد
function removeFromCart(index) {
    totalPrice -= cart[index].price;
    cart.splice(index, 1);
    updateCartUI();
}

// ثبت نهایی سفارش به سرور ابری Render
document.getElementById('submit-order-btn').addEventListener('click', () => {
    const orderMessage = document.getElementById('order-message');

    if (cart.length === 0) {
        orderMessage.style.color = '#ef4444';
        orderMessage.innerText = 'سبد خرید شما خالی است!';
        return;
    }

    orderMessage.style.color = '#2563eb';
    orderMessage.innerText = 'در حال ارسال فاکتور به سرور...';

    fetch(`${BASE_URL}/api/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart: cart, total: totalPrice })
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === 'success') {
            orderMessage.style.color = '#16a34a';
            orderMessage.innerText = data.message;
            cart = [];
            totalPrice = 0;
            updateCartUI();
        } else {
            orderMessage.style.color = '#ef4444';
            orderMessage.innerText = 'خطا در ثبت سفارش.';
        }
    })
    .catch(() => {
        orderMessage.style.color = '#ef4444';
        orderMessage.innerText = 'سرور در دسترس نیست یا در حال بیدار شدن است.';
    });
});

// احراز هویت با ایمیل
const step1Div = document.getElementById('step-1-email');
const step2Div = document.getElementById('step-2-code');
const emailInput = document.getElementById('register-email');
const codeInput = document.getElementById('verify-code');
const sendCodeBtn = document.getElementById('send-code-btn');
const verifyBtn = document.getElementById('verify-btn');
const registerMessage = document.getElementById('register-message');

let userEmail = '';

sendCodeBtn.addEventListener('click', () => {
    userEmail = emailInput.value.trim();

    if (!userEmail) {
        registerMessage.style.color = '#ef4444';
        registerMessage.innerText = 'لطفاً ایمیل خود را وارد کنید.';
        return;
    }

    registerMessage.style.color = '#2563eb';
    registerMessage.innerText = 'در حال ارسال کد به ایمیل شما...';

    fetch(`${BASE_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail })
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === 'success') {
            registerMessage.innerText = '';
            step1Div.style.display = 'none';
            step2Div.style.display = 'flex';
        } else {
            registerMessage.style.color = '#ef4444';
            registerMessage.innerText = data.message;
        }
    })
    .catch(() => {
        registerMessage.style.color = '#ef4444';
        registerMessage.innerText = 'خطا در ارسال درخواست به سرور.';
    });
});

verifyBtn.addEventListener('click', () => {
    const userCode = codeInput.value.trim();

    if (!userCode) {
        registerMessage.style.color = '#ef4444';
        registerMessage.innerText = 'لطفاً کد تایید را وارد کنید.';
        return;
    }

    registerMessage.style.color = '#2563eb';
    registerMessage.innerText = 'در حال بررسی...';

    fetch(`${BASE_URL}/api/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, code: userCode })
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === 'success') {
            registerMessage.style.color = '#16a34a';
            registerMessage.innerText = data.message;
            step2Div.style.display = 'none';
        } else {
            registerMessage.style.color = '#ef4444';
            registerMessage.innerText = data.message;
        }
    })
    .catch(() => {
        registerMessage.style.color = '#ef4444';
        registerMessage.innerText = 'خطا در ارتباط با سرور.';
    });
});
