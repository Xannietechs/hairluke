export function verifiedCustomerEmail(user){return user?.email_confirmed_at&&typeof user.email==='string'?user.email.trim().toLowerCase():null}
export function escapeLikeLiteral(value){return value.replace(/[\\%_]/g,c=>'\\'+c)}

export function checkoutCustomer(customer,user){if(!user)return {...customer,email:customer.email.trim().toLowerCase()};const email=verifiedCustomerEmail(user);if(!email)throw Error('Confirm your account email before checkout.');return {...customer,email}}
