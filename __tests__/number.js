/* eslint-env jest */
import {sum, localeString} from '../src/utils/number'

test('test sum', () => {
  expect(sum(5, 2)).toBe(7)
})

test('test localeString', () => {
  expect(localeString('1234')).toBe('1,234')
  expect(localeString(12345678.2345)).toBe('12,345,678.235')
  expect(localeString('test')).toBe(0)
})
