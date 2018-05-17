const crypto = require('crypto')

class Signid {
  /**
   * @param {string} secret Secret key
   * @return {Signid}
   */
  constructor (secret) {
    if (typeof secret !== 'string' || !secret) {
      throw new Error('Param "secret" should be not-empty string')
    }
    this.secret = secret
  }
  /**
   * Encode integer identifier as signed string (base 36)
   * @param {number} id Integer identifier
   * @return {string} Signed identifier (example: '1g5477v-kq')
   */
  encode (id) {
    if (!Number.isInteger(id) || id < 0) {
      throw new Error('Param "id" should be positive integer')
    }
    const str = id
      .toString(36)
    const sign = crypto
      .createHash('md5')
      .update(`${id}${this.secret}`)
      .digest('hex')
      .substr(0, 8)
    const sign36 = parseInt(sign, 16)
      .toString(36)
    return sign36 + '-' + str
  }
  /**
   * Decode signed identifier
   * @param {string} str Signed identifier
   * @return {number|null} Integer identifier or NULL - sign mismatch
   */
  decode (str) {
    const [sign36, strInt] = str.split('-')
    // Validate params
    const isValidSign36 = typeof sign36 === 'string' && sign36
    const isValidStrInt = typeof strInt === 'string' && strInt
    if (!(isValidSign36 && isValidStrInt)) {
      throw new Error('Param "str" should be a valid signed identifier ("xxx-yyy")')
    }
    const id = parseInt(strInt, 36)
    const signExpected = parseInt(sign36, 36)
      .toString(16)
      .padStart(8, '0')
    const sign = crypto
      .createHash('md5')
      .update(`${id}${this.secret}`)
      .digest('hex')
      .substr(0, 8)
    if (signExpected !== sign) {
      return null
    }
    return id
  }
}

module.exports = Signid
