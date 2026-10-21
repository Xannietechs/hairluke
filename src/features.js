export function selectProducts(products,{category='All',search='',texture='All',sort='featured',inStock=false,savedOnly=false,favourites=[]}={}){
 const query=search.trim().toLowerCase();
 const list=products.filter(p=>(category==='All'||p.category===category)&&(texture==='All'||p.texture===texture)&&(!inStock||p.stock>0)&&(!savedOnly||favourites.includes(p.id))&&[p.name,p.texture,p.length,p.colour,p.category].join(' ').toLowerCase().includes(query));
 if(sort==='price-low')list.sort((a,b)=>a.price_cents-b.price_cents);
 if(sort==='price-high')list.sort((a,b)=>b.price_cents-a.price_cents);
 if(sort==='name')list.sort((a,b)=>a.name.localeCompare(b.name));
 return list;
}
export function dashboardStats(products,orders){
 const real=orders.filter(o=>o.payment_mode==='live');
 const paid=real.filter(o=>['paid','shipped','delivered'].includes(o.status));
 return {revenue:paid.reduce((sum,o)=>sum+o.total_cents,0),paidOrders:paid.length,toShip:real.filter(o=>o.status==='paid').length,lowStock:products.filter(p=>p.active&&p.stock<=5),pending:orders.filter(o=>o.status==='pending').length,testOrders:orders.filter(o=>o.payment_mode==='test').length};
}
export function csvCell(value){let s=String(value??'');if(/^[\s]*[=+\-@]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"'}
export function ordersCsv(orders){return '\ufeff'+[['Order reference','Date','Customer','Email','Status','Payment mode','Total ZAR'],...orders.map(o=>[o.id,o.created_at,o.customer.name,o.customer.email,o.status,o.payment_mode||'',(o.total_cents/100).toFixed(2)])].map(row=>row.map(csvCell).join(',')).join('\r\n')}
export function productPayload(p){return Object.fromEntries(['id','name','category','texture','length','colour','price_cents','stock','image_url','description','active'].map(k=>[k,p[k]]))}
