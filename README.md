Signid
======

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Node.js version](https://img.shields.io/node/v/signid.svg)](https://nodejs.org/en/download/)

Signid is a tiny [node.js](http://nodejs.org/) server-side library for signing
and verifying integer identifiers.
Identifiers can be signed to prevent a prediction of next values.

Look at how simple it is:

```javascript
const Signid = require('signid')
const signid = new Signid('Your secret key')

const signed = signid.encode(18082)
console.log(signed) // '1tkblhp-dya'

const originalId = signid.decode(signed)
console.log(originalId) // 18082

const signid2 = new Signid('Incorrect secret')
const originalId2 = signid2.decode(signed)
console.log(originalId2) // null

```

Note that this is not an encryption library and is not suitable for creating
something safe. It doesn't withstand any security requirements.


## Features

* Server-side code (uses node **crypto** md5)
* Simple usage
* Signed integer as string about (7-20 chars length)
* Supports positive integers only (0 - *MAX_SAFE_INTEGER*)


## Signed identifiers example

| ID | Signed |
|----|--------|
| 0 | `:::javascript 'fmh1hp-0'` |
| 1 | `:::javascript '1invht9-1'` |
| 2 | `:::javascript 'j3c2f3-2'` |
| 3 | `:::javascript '1tp4u3p-3'` |
| 100 | `:::javascript '1f9pfif-2s'` |
| 1000 | `:::javascript '1ekln37-rs'` |
| 1001 | `:::javascript '1b3b3xt-rt'` |
| 1002 | `:::javascript '105opf1-ru'` |
| 88888 | `:::javascript '1buzr2q-1wl4'` |
| 9007199254740991 | `:::javascript 'iim0na-2gosa7pa2gv'` (`Number.MAX_SAFE_INTEGER`) |

P.S. This table is generated with secret `Your secret`
