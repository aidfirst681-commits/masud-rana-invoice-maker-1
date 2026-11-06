const $=id=>document.getElementById(id);
const money=n=>'SAR '+Number(n||0).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
function addItem(desc='',qty=1,price=0){
 const d=document.createElement('div');d.className='item';
 d.innerHTML='<input class="desc" aria-label="Description" placeholder="CCTV camera / service"><input class="qty" aria-label="Quantity" type="number" min="0" step="any"><input class="price" aria-label="Price in SAR" type="number" min="0" step="any"><button class="remove" type="button" title="Remove item" aria-label="Remove item">×</button>';
 d.querySelector('.desc').value=desc;d.querySelector('.qty').value=qty;d.querySelector('.price').value=price;
 d.querySelectorAll('input').forEach(x=>x.addEventListener('input',render));
 d.querySelector('button').onclick=()=>{d.remove();render()};
 $('items').appendChild(d);render();
}
function val(id){return $(id).value}
function render(){
 $('pNumber').textContent=val('number')||'—';$('pDate').textContent=val('date')||'—';$('pDue').textContent=val('due')||'—';
 $('pCustomer').textContent=val('customer')||'Customer name';$('pAddress').textContent=val('address');
 $('previewContact').textContent=val('contact');$('pPayment').textContent=val('payment')||'—';
 $('pNotes').textContent=val('notes')||'Thank you for your business.';
 let subtotal=0;$('previewItems').innerHTML='';
 document.querySelectorAll('.item').forEach(it=>{
  const desc=it.querySelector('.desc').value||'Item',q=Math.max(0,Number(it.querySelector('.qty').value)||0);
  const p=Math.max(0,Number(it.querySelector('.price').value)||0),a=q*p;subtotal+=a;
  const tr=document.createElement('tr');
  [desc,q.toLocaleString('en-US'),money(p),money(a)].forEach((v,i)=>{const td=document.createElement('td');td.textContent=v;if(i)td.className='num';tr.appendChild(td)});
  $('previewItems').appendChild(tr);
 });
 const discount=Math.min(subtotal,Math.max(0,Number(val('discount'))||0));
 const base=Math.max(0,subtotal-discount),vat=base*Math.max(0,Number(val('vat'))||0)/100,total=base+vat;
 $('subtotal').textContent=money(subtotal);$('pDiscount').textContent=money(discount);$('pVat').textContent=money(vat);$('total').textContent=money(total);
}
document.querySelectorAll('input,textarea').forEach(x=>x.addEventListener('input',render));
$('add').onclick=()=>addItem();$('print').onclick=()=>window.print();
const fields=['number','date','due','customer','address','contact','discount','vat','payment','notes'];
$('save').onclick=()=>{
 const data={};fields.forEach(k=>data[k]=val(k));
 data.items=[...document.querySelectorAll('.item')].map(it=>[it.querySelector('.desc').value,it.querySelector('.qty').value,it.querySelector('.price').value]);
 try{localStorage.setItem('masudInvoiceDraft',JSON.stringify(data));alert('Draft saved on this device.')}
 catch(e){alert('Could not save draft. Please check browser storage settings.')}
};
$('load').onclick=()=>{
 try{
  const raw=localStorage.getItem('masudInvoiceDraft');if(!raw){alert('No saved draft on this device.');return}
  const d=JSON.parse(raw);fields.forEach(k=>$(k).value=d[k]??'');
  $('items').innerHTML='';(d.items||[]).forEach(a=>addItem(...a));if(!d.items?.length)addItem();render();
 }catch(e){alert('Could not load the saved draft.')}
};
$('clear').onclick=()=>{
 if(!confirm('Clear all invoice details?'))return;
 fields.forEach(k=>$(k).value='');$('number').value='GDH-0001';$('discount').value='0';$('vat').value='0';$('items').innerHTML='';addItem();render();
};
const now=new Date();$('date').value=[now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),String(now.getDate()).padStart(2,'0')].join('-');
addItem();render();
if('serviceWorker' in navigator && location.protocol!=='file:'){
 window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(err=>console.log('Service worker registration failed:',err)));
}
