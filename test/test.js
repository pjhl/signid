/* global describe, it */
const assert = require('assert')
const Signid = require('../src/index')

function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}

describe('Signid', () => {
  describe('constructor', () => {
    it('should create object', () => {
      const signid = new Signid('QWERTYasdfgh!@#$%^&*()')
      assert.strictEqual(typeof signid, 'object')
      assert.strictEqual(typeof signid.encode, 'function')
      assert.strictEqual(typeof signid.decode, 'function')
    })
    it('should throw error on bad secret', () => {
      assert.throws(() => {
        new Signid() // eslint-disable-line no-new
      })
      assert.throws(() => {
        new Signid('') // eslint-disable-line no-new
      })
      assert.throws(() => {
        new Signid(5) // eslint-disable-line no-new
      }, undefined, 'Do not allow numbers')
    })
  })
  describe('#encode()', () => {
    const signid = new Signid('secret')

    it('should encode positive integers and zero', () => {
      assert.strictEqual(typeof signid.encode(0), 'string')
      assert.strictEqual(typeof signid.encode(1), 'string')
      assert.strictEqual(typeof signid.encode(1000), 'string')
      assert.strictEqual(typeof signid.encode(Number.MAX_SAFE_INTEGER), 'string')
    })
    it('should validate param "id"', () => {
      assert.throws(() => { signid.encode() })
      assert.throws(() => { signid.encode(-1) })
      assert.throws(() => { signid.encode(-10000) })
      assert.throws(() => { signid.encode(-Number.MAX_SAFE_INTEGER) })
      assert.throws(() => { signid.encode('123') })
      assert.throws(() => { signid.encode('') })
      assert.throws(() => { signid.encode(null) })
      assert.throws(() => { signid.encode(true) })
    })
  })
  describe('#decode()', () => {
    const signid = new Signid('secret')

    it('should decode signed', () => {
      assert.strictEqual(signid.decode('1lm7zvl-0'), 0)
      assert.strictEqual(signid.decode('1ds7h3s-1'), 1)
      assert.strictEqual(signid.decode('8o8sfp-2'), 2)
      assert.strictEqual(signid.decode('bjbjmd-2s'), 100)
      assert.strictEqual(signid.decode('1nufxvf-rs'), 1000)
    })
    it('should validate param "str"', () => {
      assert.throws(() => { signid.decode() })
      assert.throws(() => { signid.decode('') })
      assert.throws(() => { signid.decode('a') })
      assert.throws(() => { signid.decode('abcd') })
      assert.throws(() => { signid.decode('a-') })
      assert.throws(() => { signid.decode('-b') })
      assert.throws(() => { signid.decode(123) })
      assert.throws(() => { signid.decode(null) })
      assert.throws(() => { signid.decode(true) })
    })
    it('should return NULL on identifier validation failed', () => {
      assert.strictEqual(signid.decode('a-0'), null)
      assert.strictEqual(signid.decode('1lm7zv-0'), null)
      assert.strictEqual(signid.decode('lm7zvl-0'), null)
      assert.strictEqual(signid.decode('000000-2s'), null)
    })
  })
  describe('detailed', () => {
    const secret = Date.now().toString()
    const signid = new Signid(secret)

    it('should be valid for numbers 0-1000', () => {
      for (let num = 0; num <= 1000; num++) {
        const str = signid.encode(num)
        assert.strictEqual(signid.decode(str), num)
      }
    })
    it('should ba valid for 1000 random numbers', () => {
      let i = 0
      while (++i <= 1000) {
        const num = getRandomInt(1, Number.MAX_SAFE_INTEGER)
        const str = signid.encode(num)
        assert.strictEqual(signid.decode(str), num)
      }
    })
    it('should support max integer', () => {
      const str = signid.encode(Number.MAX_SAFE_INTEGER)
      assert.strictEqual(signid.decode(str), Number.MAX_SAFE_INTEGER)
    })
  })
})
