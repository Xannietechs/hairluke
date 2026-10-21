export function verifiedCustomerEmail(user){return user?.email_confirmed_at&&typeof user.email==='string'?user.email.trim().toLowerCase():null}
export function escapeLikeLiteral(value){return value.replace(/[\\%_]/g,c=>'\\'+c)}
