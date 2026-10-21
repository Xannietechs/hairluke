import test from 'node:test';
import assert from 'node:assert/strict';
import {verifiedCustomerEmail,escapeLikeLiteral} from '../server/customer-access.js';
test('order access requires confirmed email from authenticated user',()=>{
 assert.equal(verifiedCustomerEmail(null),null);
 assert.equal(verifiedCustomerEmail({email:'owner@example.com'}),null);
 assert.equal(verifiedCustomerEmail({email:' Owner@Example.com ',email_confirmed_at:'2026-01-01'}),'owner@example.com');
});
test('email matching escapes SQL LIKE wildcard characters',()=>{
 assert.equal(escapeLikeLiteral('a_%@example.com'),'a\\_\\%@example.com');
});

import {checkoutCustomer} from '../server/customer-access.js';
test('checkout email is bound to the verified session instead of an editable form',()=>{const input={name:'Customer',email:'other@example.com'};assert.equal(checkoutCustomer(input,{email:'owner@example.com',email_confirmed_at:'2026-01-01'}).email,'owner@example.com');assert.equal(input.email,'other@example.com');assert.throws(()=>checkoutCustomer(input,{email:'owner@example.com'}));assert.equal(checkoutCustomer({...input,email:' Guest@Example.com '},null).email,'guest@example.com')});
