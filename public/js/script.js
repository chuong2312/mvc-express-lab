// --- 1. SLIDER LOGIC (GIỮ NGUYÊN) ---
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;

function showSlide(index) {
    const sliderContainer = document.querySelector('.slider-container');
    if (!sliderContainer) return; // <--- Mới thêm: Kiểm tra để tránh lỗi nếu không tìm thấy slider
    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;
    currentSlide = index;
    sliderContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
}

// Tự động chuyển slide sau 5s
setInterval(() => showSlide(currentSlide + 1), 5000);

// Click vào dot
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => showSlide(index));
});

// --- 2. SCROLL ANIMATION (GIỮ NGUYÊN) ---
window.addEventListener('scroll', () => {
    const reveals = document.querySelectorAll('.reveal');
    const windowHeight = window.innerHeight;
    
    reveals.forEach(reveal => {
        const revealTop = reveal.getBoundingClientRect().top;
        if (revealTop < windowHeight - 100) {
            reveal.classList.add('active');
        }
    });
});

// --- 3. SHOPPING CART LOGIC (GIỮ NGUYÊN) ---
let cart = [];
const cartCountDom = document.getElementById('cartCount');
const cartItemsDom = document.getElementById('cartItems');
const cartTotalDom = document.getElementById('cartTotal');

// Hàm thêm vào giỏ
document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const name = e.target.dataset.name;
        const price = parseInt(e.target.dataset.price);
        
        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ name, price, quantity: 1 });
        }
        
        updateCart();
        
        // Hiệu ứng nút
        const originalText = e.target.textContent;
        e.target.textContent = "✔";
        e.target.style.background = "#2e7d32";
        setTimeout(() => {
            e.target.textContent = originalText;
            e.target.style.background = "";
        }, 800);
    });
});

function updateCart() {
    if(!cartCountDom) return; // <--- Mới thêm: Check lỗi null
    cartCountDom.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cart.length === 0) {
        cartItemsDom.innerHTML = "<p style='text-align:center; color:#888'>Giỏ hàng trống trơn...</p>";
        cartTotalDom.textContent = "0đ";
        return;
    }
    
    let html = "";
    let total = 0;
    
    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        html += `
            <div class="cart-item-row">
                <div>
                    <strong>${item.name}</strong> <br>
                    <small>${item.price.toLocaleString()}đ x ${item.quantity}</small>
                </div>
                <div>
                    <span>${(item.price * item.quantity).toLocaleString()}đ</span>
                    <span class="remove-btn" onclick="removeItem(${index})">🗑</span>
                </div>
            </div>
        `;
    });
    
    cartItemsDom.innerHTML = html;
    cartTotalDom.textContent = total.toLocaleString() + "đ";
}

window.removeItem = (index) => {
    cart.splice(index, 1);
    updateCart();
};

const checkoutBtn = document.getElementById('checkoutBtn');
if (checkoutBtn) { // <--- Mới thêm: Check lỗi null
    checkoutBtn.addEventListener('click', () => {
        if (cart.length > 0) {
            alert("Cảm ơn bạn! Đơn hàng đã được gửi đi 🚀");
            cart = [];
            updateCart();
            document.getElementById('cartModal').classList.remove('active');
        } else {
            alert("Bạn chưa chọn món nào cả!");
        }
    });
}

// --- 4. MODAL LOGIC (CÓ SỬA CHÚT ÍT ĐỂ TRÁNH LỖI) ---
const openModal = (btnId, modalId) => {
    const btn = document.getElementById(btnId);
    if(btn) { // <--- Mới thêm: Chỉ gán sự kiện nếu nút tồn tại (Tránh lỗi console)
        btn.addEventListener('click', () => {
            document.getElementById(modalId).classList.add('active');
        });
    }
};

const closeModal = (closeId, modalId) => {
    const closeBtn = document.getElementById(closeId);
    if(closeBtn) { // <--- Mới thêm: Chỉ gán sự kiện nếu nút tồn tại
        closeBtn.addEventListener('click', () => {
            document.getElementById(modalId).classList.remove('active');
        });
    }
};

openModal('cartBtn', 'cartModal');
closeModal('closeCart', 'cartModal');

openModal('signupBtn', 'signupModal');
closeModal('closeSignup', 'signupModal');


// --- 5. FORM SIGNUP SUBMIT (ĐÂY LÀ PHẦN THAY ĐỔI CHÍNH) ---
// <--- MỚI SỬA: Thay thế toàn bộ đoạn code cũ bằng đoạn code async/await này -->
document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Chặn load lại trang

    // <--- MỚI THÊM: Lấy dữ liệu input -->
    const inputs = e.target.querySelectorAll('input');
    const name = inputs[0].value;
    const email = inputs[1].value;
    const phone = inputs[2].value;

    try {
        // <--- MỚI THÊM: Dùng fetch để gửi dữ liệu về Server Node.js -->
        const response = await fetch('/api/customers/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, phone }) // Đóng gói cục dữ liệu JSON
        });

        const data = await response.json();

        // <--- MỚI THÊM: Xử lý phản hồi từ Server -->
        if (data.success) {
            alert("🎉 " + data.message); // Server báo thành công
            document.getElementById('signupModal').classList.remove('active');
            e.target.reset(); // Xóa trắng form
        } else {
            alert("⚠️ " + data.message); // Server báo lỗi (ví dụ trùng email)
        }
    } catch (err) {
        console.error("Lỗi:", err);
        alert("❌ Lỗi kết nối server! Bạn đã bật 'node server.js' chưa?");
    }
});
// <--- KẾT THÚC PHẦN MỚI SỬA -->


// Click outside to close (GIỮ NGUYÊN)
window.onclick = (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
};