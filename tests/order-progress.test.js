import test from 'node:test';import assert from 'node:assert/strict';import {orderProgress} from '../src/order-progress.js';
test('unpaid orders never show completed payment or delivery',()=>{assert.equal(orderProgress({status:'pending'}).some(s=>s.done),false)});
test('paid orders confirm payment without promising preparation',()=>{assert.deepEqual(orderProgress({status:'paid'}).map(s=>s.done),[true,false,false,false])});
test('delivery completes the customer journey',()=>{assert.equal(orderProgress({status:'delivered'}).every(s=>s.done),true)});
