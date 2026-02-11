// --- Data ---
const categories = [
    { id: 'automobiles', label: 'AUTOMOBILES', icon: 'ri-motorbike-line' },
    { id: 'watches', label: 'WATCHES', icon: 'ri-time-line' },
    { id: 'electronics', label: 'ELECTRONICS', icon: 'ri-macbook-line' },
    { id: 'home-appliances', label: 'HOME APPLIANCES', icon: 'ri-fridge-line' },
    { id: 'bags-footwear', label: 'BAGS and FOOTWEAR', icon: 'ri-handbag-line' },
    { id: 'home-decor', label: 'HOME DECOR', icon: 'ri-home-smile-line' },
    { id: 'fitness', label: 'FITNESS', icon: 'ri-run-line' },
    { id: 'sports', label: 'SPORTS', icon: 'ri-basketball-line' },
    { id: 'kids-toddlers', label: 'KIDS AND TODDLERS', icon: 'ri-bear-smile-line' },
    { id: 'pet-supplies', label: 'PET SUPPLIES', icon: 'ri-baidu-line' },
    { id: 'men', label: 'MEN', icon: 'ri-men-line' },
    { id: 'women', label: 'WOMEN', icon: 'ri-women-line' }
];
const subcategories = {
    'automobiles': ['bikes', 'cars', 'helmets', 'bike accessories', 'car accessories', 'EV'],
    'watches': ['smart watch', 'analog watch', 'digital watch', 'digi log watch', 'vintage series'],
    'electronics': ['television', 'mobile', 'laptop', 'gaming', 'camera', 'headphones', 'monitor', 'speaker'],
    'home-appliances': ['refrigerator', 'AC', 'washing machine', 'dish washer', 'air fryer', 'kitchen supplies', 'air purifier'],
    'bags-footwear': ['womens footwear', 'mens footwear', 'kids footwear', 'women bags', 'men bags', 'travel bags and luggage'],
    'home-decor': ['wood furniture', 'kitchen and storage', 'home textile', 'bedroom accessories'],
    'fitness': ['treadmill', 'fitness bike', 'walking pods', 'weights', 'home gym', 'gym accessories'],
    'sports': ['cricket', 'football', 'badminton', 'swimming', 'table tennis', 'boxing'],
    'kids-toddlers': ['girls clothing', 'boys clothing', 'baby care', 'kids toys'],
    'pet-supplies': ['dog food', 'cat food', 'birds', 'aquarium'],
    'men': ['top wear', 'bottom wear', 'inner wear', 'ethnic wear', 'sports wear', 'winter wear', 'accessories'],
    'women': ['top wear', 'bottom wear', 'inner wear', 'ethnic wear', 'sports wear', 'accessories']
};
// --- References ---
const sidebarList = document.getElementById('sidebar-categories');
const contentArea = document.getElementById('contentArea');
const themeToggle = document.getElementById('themeToggle');
const toggleIcon = themeToggle.querySelector('i');
const searchInput = document.getElementById('searchInput');
let currentCatId = null;
// --- Initialization ---
initTheme();
renderSidebar();
// --- Theme Logic ---
function initTheme() {
    const saved = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    updateToggleIcon(saved);
    themeToggle.addEventListener('click', (e) => {
        createRipple(e);
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateToggleIcon(next);
    });
}
function updateToggleIcon(theme) {
    // Simple rotation/morph
    toggleIcon.style.opacity = 0;
    setTimeout(() => {
        toggleIcon.className = theme === 'dark' ? 'ri-moon-line' : 'ri-sun-line';
        toggleIcon.style.opacity = 1;
    }, 200);
}
// --- Search Logic ---
searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (!query) {
        if (currentCatId) {
            renderSubcategories(currentCatId);
        } else {
            contentArea.innerHTML = ''; // Or welcome message
        }
        return;
    }
    let results = [];
    // Iterate all categories
    Object.keys(subcategories).forEach(catId => {
        const subs = subcategories[catId];
        const matches = subs.filter(s => s.toLowerCase().includes(query));
        if (matches.length > 0) {
            const catLabel = categories.find(c => c.id === catId)?.label || catId;
            matches.forEach(m => results.push({ sub: m, catId: catId, catLabel: catLabel }));
        }
    });
    renderSearchResults(results, query);
});
function renderSearchResults(results, query) {
    if (results.length === 0) {
        contentArea.innerHTML = `<div class="card animate-in"><div class="card-content"><h3>No Items Found</h3><p>No matches for "${query}"</p></div></div>`;
        return;
    }
    document.getElementById('pageTitle').textContent = `Search Results`;
    document.getElementById('breadcrumb').textContent = `SEARCH / "${query}"`;
    let html = '<div class="subgrid">';
    results.forEach((item, i) => {
        html += `
        <div class="card animate-in" style="animation-delay: ${i * 50}ms" data-sub="${item.sub}" data-cat="${item.catId}">
            <div class="card-content">
                <div class="badge" style="background:var(--accent); color:white; margin-bottom:8px">${item.catLabel}</div>
                <div class="title">${item.sub}</div>
                <div class="meta">View Top Products</div>
            </div>
        </div>`;
    });
    html += '</div><div id="productsHolder"></div>';
    contentArea.innerHTML = html;
    // Add Handlers
    contentArea.querySelectorAll('.card').forEach(card => {
        addTiltEffect(card);
        card.addEventListener('click', (e) => {
            createRipple(e);
            showProducts(card.dataset.sub);
        });
    });
}
// --- Rendering ---
function renderSidebar() {
    sidebarList.innerHTML = categories.map((c, i) => `
    <div class="cat animate-in" style="animation-delay: ${i * 40}ms" data-id="${c.id}">
        <i class="${c.icon}"></i> ${c.label}
    </div>
`).join('');
    sidebarList.querySelectorAll('.cat').forEach(cat => {
        cat.addEventListener('click', (e) => {
            createRipple(e);
            // Active class
            sidebarList.querySelectorAll('.cat').forEach(x => x.classList.remove('active'));
            cat.classList.add('active');
            currentCatId = cat.dataset.id;
            searchInput.value = ''; // Clear search on cat switch
            renderSubcategories(currentCatId);
        });
    });
}
function renderSubcategories(catId, filter = '') {
    const cat = categories.find(c => c.id === catId);
    document.getElementById('pageTitle').textContent = cat.label;
    document.getElementById('breadcrumb').textContent = `HOME / ${cat.label}`;
    let subs = subcategories[catId] || [];
    // Filter
    if (filter) {
        subs = subs.filter(s => s.toLowerCase().includes(filter));
    }
    if (subs.length === 0) {
        contentArea.innerHTML = `<div class="card animate-in"><div class="card-content"><h3>No Items Found</h3><p>Try a different search term.</p></div></div>`;
        return;
    }
    let html = '<div class="subgrid">';
    subs.forEach((s, i) => {
        html += `
        <div class="card animate-in" style="animation-delay: ${i * 50}ms" data-sub="${s}">
            <div class="card-content">
                <div class="title">${s}</div>
                <div class="meta">View Top Products</div>
            </div>
        </div>`;
    });
    html += '</div><div id="productsHolder"></div>';
    contentArea.innerHTML = html;
    // Add 3D Tilt and Click handlers
    contentArea.querySelectorAll('.card').forEach(card => {
        addTiltEffect(card);
        card.addEventListener('click', (e) => {
            createRipple(e);
            showProducts(card.dataset.sub);
        });
    });
}
function showProducts(sub) {
    const holder = document.getElementById('productsHolder');
    // Logic: Show exactly 2 products: Sponsored & Top Rated
    const products = [
        { type: 'sponsored', label: 'Sponsored', name: `${sub} - Premium Choice`, price: '₹' + (Math.random() * 5000 + 2000).toFixed(0) },
        { type: 'top-rated', label: 'Top Rated Product', name: `${sub} - Best Seller`, price: '₹' + (Math.random() * 3000 + 1000).toFixed(0) }
    ];
    let html = `<h2 class="animate-in" style="margin-top:40px; margin-bottom: 20px;">${sub}</h2><div class="products">`;
    products.forEach((p, i) => {
        html += `
        <div class="card animate-in" style="animation-delay: ${i * 80}ms">
            <div class="card-content">
                <div class="badge ${p.type}">${p.label}</div>
                <div style="height:180px; background:rgba(0,0,0,0.1); border-radius:12px; margin-bottom:12px; display:flex; align-items:center; justify-content:center;">
                   <i class="ri-shopping-bag-3-line" style="font-size:4rem; opacity:0.5"></i>
                </div>
                <div class="title" style="font-size:1.4rem">${p.name}</div>
                <div style="color:var(--accent); font-weight:bold; font-size:1.2rem">${p.price}</div>
                <div class="meta" style="margin-top:8px">★★★★★ (4.9)</div>
            </div>
        </div>`;
    });
    html += '</div>';
    holder.innerHTML = html;
    holder.scrollIntoView({ behavior: 'smooth', block: 'start' });
    holder.querySelectorAll('.card').forEach(c => {
        addTiltEffect(c);
    });
}
// --- Effects ---
// 3D Tilt
function addTiltEffect(card) {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
}
// Ripple
function createRipple(event) {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    const rect = button.getBoundingClientRect();
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - rect.left - radius}px`;
    circle.style.top = `${event.clientY - rect.top - radius}px`;
    circle.classList.add('ripple');
    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) ripple.remove();
    button.appendChild(circle);
}
