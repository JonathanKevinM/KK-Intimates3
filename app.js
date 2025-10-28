/* Demo product dataset (in a real app get from backend) */
const products = [
  {id:1,title:'Signature Perfume - Rose',category:'female,perfume',price:1200, img:'/mnt/data/be54f498-20d9-4cc6-878f-122ce9b1c697.jpg',desc:'A sensual floral perfume for evening wear.'},
  {id:2,title:'Men Cologne - Night',category:'male,perfume',price:1500,img:'https://picsum.photos/400/300?random=11',desc:'A bold woody cologne.'},
  {id:3,title:'Lipstick Velvet',category:'female,cosmetics',price:450,img:'https://picsum.photos/400/300?random=12',desc:'Creamy velvet finish lipstick.'},
  {id:4,title:'Gold Plated Necklace',category:'female,jewelry',price:2200,img:'https://picsum.photos/400/300?random=13',desc:'Elegant statement necklace.'},
  {id:5,title:'Scented Candle',category:'all,cosmetics',price:350,img:'https://picsum.photos/400/300?random=14',desc:'Hand-poured scented candle.'},
  {id:6,title:'Unisex Body Oil',category:'all,cosmetics',price:800,img:'https://picsum.photos/400/300?random=15',desc:'Lightweight nourishing oil.'},
  {id:7,title:'Silver Ring',category:'female,jewelry',price:600,img:'https://picsum.photos/400/300?random=16',desc:'Minimalist silver ring.'},
  {id:8,title:'Aftershave Balm',category:'male,cosmetics',price:500,img:'https://picsum.photos/400/300?random=17',desc:'Soothing aftershave balm.'}
];

const productsArea = document.getElementById('productsArea');
function renderProducts(list){
  productsArea.innerHTML='';
  list.forEach(p=>{
    const card = document.createElement('div');card.className='card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.title}" />
      <h4>${p.title}</h4>
      <p>${p.desc}</p>
      <div class="meta">
        <div>KES ${p.price.toFixed(2)}</div>
        <button class="btn add" data-id="${p.id}">Add to cart</button>
      </div>
    `;
    productsArea.appendChild(card);
  })
}
renderProducts(products);

/* Filters & search */
document.getElementById('filters').addEventListener('click', e=>{
  if(!e.target.classList.contains('filter')) return;
  document.querySelectorAll('.filter').forEach(f=>f.classList.remove('active'));
  e.target.classList.add('active');
  applyFilters();
});
document.getElementById('searchBtn').addEventListener('click', applyFilters);
document.getElementById('searchInput').addEventListener('keyup', e=>{ if(e.key==='Enter') applyFilters(); });

function applyFilters(){
  const active = document.querySelector('.filter.active').dataset.filter;
  const q = document.getElementById('searchInput').value.trim().toLowerCase();
  let list = products.filter(p=>{
    const matchFilter = (active==='all')?true: p.category.includes(active);
    const matchQuery = q? (p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)) : true;
    return matchFilter && matchQuery;
  });
  renderProducts(list);
}

/* Cart logic (localStorage) */
let cart = JSON.parse(localStorage.getItem('kk_cart')||'[]');
function saveCart(){ localStorage.setItem('kk_cart', JSON.stringify(cart)); updateCartUI(); }
function updateCartUI(){
  document.getElementById('cartCount').innerText = cart.reduce((s,i)=>s+i.qty,0);
  const area = document.getElementById('cartItems'); area.innerHTML='';
  let total=0;
  cart.forEach(i=>{
    const prod = products.find(p=>p.id===i.id) || {};
    total += (prod.price || 0) * i.qty;
    const div = document.createElement('div');div.className='cart-item';
    div.innerHTML = `<img src="${prod.img}" alt="${prod.title}" /><div style='flex:1'><strong>${prod.title}</strong><div>KES ${prod.price?.toFixed(2)}</div></div><div>Qty: ${i.qty}</div>`;
    area.appendChild(div);
  });
  document.getElementById('cartTotal').innerText = `Total: KES ${total.toFixed(2)}`;
}
updateCartUI();

productsArea.addEventListener('click', e=>{
  if(e.target.matches('.add')){
    const id = Number(e.target.dataset.id);
    const existing = cart.find(c=>c.id===id);
    if(existing) existing.qty++;
    else cart.push({id,qty:1});
    saveCart();
  }
});

/* cart drawer toggle */
document.getElementById('cartIconBtn').addEventListener('click', ()=>{
  const d = document.getElementById('cartDrawer'); d.style.display = d.style.display==='block'?'none':'block';
});

/* pay button (demo) */
document.getElementById('payBtn').addEventListener('click', ()=>{
  if(cart.length===0){alert('Cart is empty');return}
  // In production: POST cart to backend /api/checkout to create payment session
  alert('Demo payment: this would call your server to process payment.');
});

/* Day-of-week dynamic text */
function updateDayText(){
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const now = new Date();
  const day = days[now.getDay()];
  document.getElementById('dayText').innerText = `It's a ${day}`;
}
updateDayText();

/* Search UI toggle */
document.getElementById('searchIconBtn').addEventListener('click', ()=>{
  const sa = document.getElementById('searchArea');
  sa.style.display = sa.style.display==='block'? 'none':'block';
});

/* Pause slides when hover */
const slidesEl = document.getElementById('slides');
slidesEl.addEventListener('mouseenter', ()=>slidesEl.style.animationPlayState='paused');
slidesEl.addEventListener('mouseleave', ()=>slidesEl.style.animationPlayState='running');

/* keyboard shortcut */
window.addEventListener('keydown', e=>{ if(e.key==='c') document.getElementById('cartIconBtn').click(); });
