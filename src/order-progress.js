export function orderProgress(order){
 const steps=['Payment confirmed','Preparing','Dispatched','Delivered'];
 const current={pending:-1,paid:0,processing:1,shipped:2,delivered:3}[order.status]??-1;
 return steps.map((label,index)=>({label,done:index<=current,current:index===current}));
}
