const products = [
  {id:'lamp',name:'The Little Glow Lamp',category:'Home',price:48,badge:'BEST SELLER',rating:'★★★★★  4.9',image:'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80'},
  {id:'bottle',name:'Everywhere Water Bottle',category:'On the go',price:32,badge:'EVERYDAY HERO',rating:'★★★★★  4.8',image:'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80'},
  {id:'speaker',name:'Pocket Sound Speaker',category:'Tech',price:59,badge:'A CLEVER FIND',rating:'★★★★★  4.9',image:'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80'},
  {id:'organizer',name:'The Tidy Desk Organizer',category:'Home',price:36,badge:'GOOD DESIGN',rating:'★★★★★  4.7',image:'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=800&q=80'},
  {id:'mug',name:'Slow Morning Ceramic Set',category:'Kitchen',price:28,badge:'GIFT FAVORITE',rating:'★★★★★  4.9',image:'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=800&q=80'},
  {id:'charger',name:'Anytime Wireless Charger',category:'Tech',price:42,badge:'MADE EASY',rating:'★★★★★  4.8',image:'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=800&q=80'},
  {id:'tote',name:'The Carry-All Everyday Tote',category:'On the go',price:39,badge:'READY TO GO',rating:'★★★★★  4.8',image:'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80'},
  {id:'board',name:'Sunday Prep Cutting Board',category:'Kitchen',price:34,badge:'KITCHEN FAVORITE',rating:'★★★★★  4.9',image:'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=800&q=80'}
];
const money = amount => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(amount);
let activeCategory='All';
let cart=loadCart();
const productGrid=document.querySelector('#products');
const searchInput=document.querySelector('#product-search');
const toast=document.querySelector('#toast');
let toastTimer;
function loadCart(){try{return JSON.parse(localStorage.getItem('daily-clever-cart'))||[]}catch{return []}}
function saveCart(){try{localStorage.setItem('daily-clever-cart',JSON.stringify(cart))}catch{} renderCart()}
function renderProducts(){
  const term=searchInput.value.trim().toLowerCase();
  const shown=products.filter(p=>(activeCategory==='All'||p.category===activeCategory)&&(!term||`${p.name} ${p.category}`.toLowerCase().includes(term)));
  productGrid.innerHTML=shown.map(p=>`<article class="product-card"><div class="product-image-wrap"><img src="${p.image}" alt="${p.name}" loading="lazy"><span class="product-badge">${p.badge}</span><button class="quick-add" data-add="${p.id}" aria-label="Add ${p.name} to bag">Add to bag <span aria-hidden="true">+</span></button></div><div class="product-meta"><div><p class="product-name">${p.name}</p><p class="product-category">${p.category}</p></div><p class="product-price">${money(p.price)}</p></div><div class="product-rating" aria-label="Rated highly by customers">${p.rating}</div></article>`).join('');
  document.querySelector('#empty-state').hidden=shown.length>0;
}
function renderCart(){
  const count=cart.reduce((sum,item)=>sum+item.quantity,0);
  document.querySelector('#cart-count').textContent=count;
  document.querySelector('#drawer-count').textContent=`(${count})`;
  const items=cart.map(item=>({...products.find(p=>p.id===item.id),quantity:item.quantity})).filter(p=>p.id);
  document.querySelector('#cart-items').innerHTML=items.map(p=>`<div class="cart-item"><img src="${p.image}" alt="" loading="lazy"><div><h3>${p.name}</h3><p>${money(p.price)}</p><div class="quantity-control"><button data-quantity="${p.id}" data-change="-1" aria-label="Remove one ${p.name}">−</button><span>${p.quantity}</span><button data-quantity="${p.id}" data-change="1" aria-label="Add one ${p.name}">+</button></div></div><div><span class="cart-item-price">${money(p.price*p.quantity)}</span><button class="remove-item" data-remove="${p.id}">Remove</button></div></div>`).join('');
  document.querySelector('#cart-empty').hidden=items.length>0;
  document.querySelector('#cart-footer').hidden=items.length===0;
  document.querySelector('#cart-subtotal').textContent=money(items.reduce((sum,p)=>sum+p.price*p.quantity,0));
}
function showToast(message){toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2300)}
function openCart(){document.querySelector('#drawer-backdrop').hidden=false;document.querySelector('#cart-drawer').classList.add('open');document.querySelector('#cart-drawer').setAttribute('aria-hidden','false');document.body.style.overflow='hidden';document.querySelector('#close-cart').focus()}
function closeCart(){document.querySelector('#drawer-backdrop').hidden=true;document.querySelector('#cart-drawer').classList.remove('open');document.querySelector('#cart-drawer').setAttribute('aria-hidden','true');document.body.style.overflow=''}
function addToCart(id){const item=cart.find(p=>p.id===id);if(item)item.quantity++;else cart.push({id,quantity:1});saveCart();const product=products.find(p=>p.id===id);showToast(`${product.name} added to your bag`)}
document.addEventListener('click',event=>{
  const add=event.target.closest('[data-add]');if(add){addToCart(add.dataset.add);return}
  const filter=event.target.closest('[data-category]');if(filter){activeCategory=filter.dataset.category;document.querySelectorAll('.filter-chip').forEach(button=>button.classList.toggle('active',button===filter));renderProducts();return}
  const navCategory=event.target.closest('[data-nav-category]');if(navCategory){activeCategory=navCategory.dataset.navCategory;document.querySelectorAll('.filter-chip').forEach(button=>button.classList.toggle('active',button.dataset.category===activeCategory));renderProducts();return}
  const quantity=event.target.closest('[data-quantity]');if(quantity){const item=cart.find(p=>p.id===quantity.dataset.quantity);if(item){item.quantity+=Number(quantity.dataset.change);if(item.quantity<1)cart=cart.filter(p=>p.id!==item.id);saveCart()}return}
  const remove=event.target.closest('[data-remove]');if(remove){cart=cart.filter(p=>p.id!==remove.dataset.remove);saveCart();return}
});
searchInput.addEventListener('input',renderProducts);
document.querySelector('#open-cart').addEventListener('click',openCart);
document.querySelector('#close-cart').addEventListener('click',closeCart);
document.querySelector('#drawer-backdrop').addEventListener('click',closeCart);
document.querySelector('#continue-shopping').addEventListener('click',closeCart);
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeCart()});
document.querySelector('.search-toggle').addEventListener('click',()=>{document.querySelector('#shop').scrollIntoView({behavior:'smooth'});setTimeout(()=>searchInput.focus(),450)});
document.querySelector('#newsletter-form').addEventListener('submit',event=>{event.preventDefault();document.querySelector('#form-message').textContent='You’re on the list — keep an eye on your inbox!';event.currentTarget.reset()});
document.querySelector('#checkout-button').addEventListener('click',()=>showToast('Thanks for shopping! Checkout is coming soon.'));
document.querySelector('#year').textContent=new Date().getFullYear();
renderProducts();renderCart();
