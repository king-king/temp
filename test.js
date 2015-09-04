/**
 * @constructor
 */
var MinStack = function () {
    this.stack = [];
    this.min = 0;
    this.length = 0;
};

/**
 * @param {number} x
 * @returns {void}
 */
MinStack.prototype.push = function (x) {
    this.length += 1;
    this.stack.push(x);
    if (this.length == 1) {
        this.min = x;
    }
    if (x < this.min) {
        this.min = x;
    }
};

/**
 * @returns {void}
 */
MinStack.prototype.pop = function () {
    this.length -= 1;
    var val = this.stack.pop();
    if (val == this.min) {
        var arr = JSON.parse(JSON.stringify(this.stack));
        arr.sort(function (a, b) {
            return a - b;
        });
        this.min = arr[0];
    }
};

/**
 * @returns {number}
 */
MinStack.prototype.top = function () {
    return this.stack[this.stack.length - 1];
};

/**
 * @returns {number}
 */
MinStack.prototype.getMin = function () {
    console.log(this.min);
    return this.min;
};