export const isObject = (val: any): val is object => 
    Object.prototype.toString.call(val) === '[object Object]'



