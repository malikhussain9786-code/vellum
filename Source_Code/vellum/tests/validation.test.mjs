// Run with: node tests/validation.test.mjs
import assert from 'node:assert/strict'
import * as v from '../src/lib/validation.js'

const ok = (e) => assert.equal(e, '', `expected valid, got: ${e}`)
const bad = (e, hint) => { assert.ok(e, 'expected an error'); if (hint) assert.match(e, hint) }

// name
ok(v.validateName('Amara Osei')); ok(v.validateName("Jean-Luc O'Brien")); ok(v.validateName('Ali'))
bad(v.validateName(''), /required/); bad(v.validateName('A')); bad(v.validateName('John123'), /letters/)
bad(v.validateName('x'.repeat(51)), /50/)
// email
ok(v.validateEmail('you@email.com')); ok(v.validateEmail('a.b+c@sub.example.co.uk'))
bad(v.validateEmail(''), /required/); bad(v.validateEmail('nope'), /@/); bad(v.validateEmail('a@b')); bad(v.validateEmail('a b@c.com'))
bad(v.validateEmail('a..b@c.com')); bad(v.validateEmail('a@c.c'))
ok(v.validateEmail('', { required: false }))
// password
ok(v.validatePassword('Abcdef12'))
bad(v.validatePassword('short1A'), /8/); bad(v.validatePassword('alllowercase1'), /uppercase/)
bad(v.validatePassword('ALLUPPER123'), /lowercase/); bad(v.validatePassword('NoNumbersHere'), /number/)
bad(v.validatePassword('Has Space1a'), /spaces/)
ok(v.validateLoginPassword('x')); bad(v.validateLoginPassword(''), /required/)
ok(v.validateConfirm('a', 'a')); bad(v.validateConfirm('a', 'b'), /match/); bad(v.validateConfirm('a', ''))
// phone
ok(v.validatePhone('')); ok(v.validatePhone('(415) 555-0148')); ok(v.validatePhone('+92 300 1234567'))
bad(v.validatePhone('abc')); bad(v.validatePhone('123')); bad(v.validatePhone('1'.repeat(16)))
// url
ok(v.validateUrl('')); ok(v.validateUrl('github.com/aosei/clarity')); ok(v.validateUrl('https://example.com/a?b=1'))
bad(v.validateUrl('not a url')); bad(v.validateUrl('javascript:alert(1)')); bad(v.validateUrl('localhost'))
ok(v.validateUrl('linkedin.com/in/you', { host: 'linkedin.com' })); ok(v.validateUrl('https://www.linkedin.com/in/you', { host: 'linkedin.com' }))
bad(v.validateUrl('twitter.com/you', { host: 'linkedin.com' }), /linkedin/)
// dates
ok(v.validateDate('2022')); ok(v.validateDate('06/2022')); ok(v.validateDate('Jun 2022')); ok(v.validateDate('September 2021'))
bad(v.validateDate('22')); bad(v.validateDate('13/2022')); bad(v.validateDate('1900'), /between/); bad(v.validateDate('yesterday'))
ok(v.validateDate('2020 — Present', { allowRange: true, allowPresent: true })); ok(v.validateDate('2019-2021', { allowRange: true }))
bad(v.validateDate('2021 - 2019', { allowRange: true }), /before/)
bad(v.validateDate('2020 — Present'))
ok(v.validateDateRange('2019', '2022')); bad(v.validateDateRange('2022', '2019'), /before/)
ok(v.validateDateRange('2022', '2019', { current: true }))
// text
ok(v.validateText('', {})); bad(v.validateText('', { label: 'X', required: true }), /required/)
bad(v.validateText('<script>', { label: 'X' })); bad(v.validateText('x'.repeat(101), { max: 100 }))
bad(v.validateText('hi', { label: 'Message', min: 10 }), /10/)
// files
ok(v.validatePhotoFile({ type: 'image/png', size: 1000 })); bad(v.validatePhotoFile({ type: 'application/pdf', size: 1000 }))
bad(v.validatePhotoFile({ type: 'image/png', size: 6 * 1024 * 1024 }), /5 MB/)
console.log('All validation tests passed ✔')
