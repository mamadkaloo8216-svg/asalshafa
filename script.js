const BASE_URL = 'https://asalshafa-backend.onrender.com';

const productsContainer = document.getElementById('products-container');
const cartCountElement = document.getElementById('cart-count');

let cart = [];
let totalPrice = 0;

// ۱. دریافت محصولات از سرور آنلاین
fetch(`${BASE_URL}/api/products`)
    .then(response => response.json())
    .then(products => {
        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.className = 'product';
            productDiv.innerHTML = `
                <h3>${product.name}</h3>
                <p>قیمت: ${product.price} تومان</p>
                <button class="add-to-cart-btn" onclick="addToCart('${product.name}', ${product.price})">افزودن به سبد خرید</button>
            `;
            productsContainer.appendChild(productDiv);
        });
    })
    .catch(error => {
        productsContainer.innerHTML = '<p style="color:red;">خطا در دریافت اطلاعات از سرور آنلاین.</p>';
    });

// تابع افزودن به فاکتور
function addToCart(productName, productPrice) {
    cart.push({ name: productName, price: productPrice });
    totalPrice = totalPrice + productPrice;

    cartCountElement.innerText = cart.length;

    const cartItemsList = document.getElementById('cart-items');
    cartItemsList.innerHTML += `<li style="padding: 10px 0; border-bottom: 1px solid #eee;">${productName} <span style="float: left;">${productPrice} تومان</span></li>`;

    document.getElementById('total-price').innerText = totalPrice;
}

// ۲. ثبت نهایی سفارش به سرور آنلاین
document.getElementById('submit-order-btn').addEventListener('click', () => {
    const orderMessage = document.getElementById('order-message');
    
    if (cart.length === 0) {
        orderMessage.style.color = 'red';
        orderMessage.innerText = 'سبد خرید شما خالی است!';
        return;
    }
    
    orderMessage.style.color = 'blue';
    orderMessage.innerText = 'در حال ارسال سفارش...';

    fetch(`${BASE_URL}/api/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart: cart, total: totalPrice })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            orderMessage.style.color = 'green';
            orderMessage.innerText = data.message;
            
            cart = [];
            totalPrice = 0;
            document.getElementById('cart-count').innerText = 0;
            document.getElementById('cart-items').innerHTML = '';
            document.getElementById('total-price').innerText = 0;
        } else {
            orderMessage.style.color = 'red';
            orderMessage.innerText = 'خطا در ثبت سفارش.';
        }
    })
    .catch(error => {
        orderMessage.style.color = 'red';
        orderMessage.innerText = 'خطا در ارتباط با سرور.';
    });
});

// ۳. فرم ثبت‌نام و ارسال ایمیل از سرور آنلاین
const step1Div = document.getElementById('step-1-email');
const step2Div = document.getElementById('step-2-code');
const emailInput = document.getElementById('register-email');
const codeInput = document.getElementById('verify-code');
const sendCodeBtn = document.getElementById('send-code-btn');
const verifyBtn = document.getElementById('verify-btn');
const registerMessage = document.getElementById('register-message');

let userEmail = '';

sendCodeBtn.addEventListener('click', () => {
    userEmail = emailInput.value;
    
    if (!userEmail) {
        registerMessage.style.color = 'red';
        registerMessage.innerText = 'لطفاً ایمیل خود را وارد کنید.';
        return;
    }

    registerMessage.style.color = 'blue';
    registerMessage.innerText = 'در حال ارسال کد به ایمیل شما...';

    fetch(`${BASE_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            registerMessage.innerText = '';
            step1Div.style.display = 'none';
            step2Div.style.display = 'block';
        } else {
            registerMessage.style.color = 'red';
            registerMessage.innerText = data.message;
        }
    })
    .catch(error => {
        registerMessage.style.color = 'red';
        registerMessage.innerText = 'خطا در ارتباط با سرور.';
    });
});

verifyBtn.addEventListener('click', () => {
    const userCode = codeInput.value;

    if (!userCode) {
        registerMessage.style.color = 'red';
        registerMessage.innerText = 'لطفاً کد ۶ رقمی را وارد کنید.';
        return;
    }

    registerMessage.style.color = 'blue';
    registerMessage.innerText = 'در حال بررسی کد...';

    fetch(`${BASE_URL}/api/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, code: userCode })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            registerMessage.style.color = 'green';
            registerMessage.innerText = data.message;
            step2Div.style.display = 'none';
        } else {
            registerMessage.style.color = 'red';
            registerMessage.innerText = data.message;
        }
    })
    .catch(error => {
        registerMessage.style.color = 'red';
        registerMessage.innerText = 'خطا در ارتباط با سرور.';
    });
});
