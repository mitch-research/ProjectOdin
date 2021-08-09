const {add, subtract} = require('../math')

test('Properly adds two numbers', () => {
    expect(add(2, 3)).toBe(5)
});

test('Properly subtracts two numbers', () => {
    expect(subtract(3,1)).toBe(2)
    expect(subtract(4,3)).toBe(1)
})