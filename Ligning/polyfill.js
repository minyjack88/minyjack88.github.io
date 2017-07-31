
//Object.assign from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
if (typeof Object.assign != 'function') {
  Object.assign = function(target, varArgs) { // .length of function is 2
    'use strict';
    if (target == null) { // TypeError if undefined or null
      throw new TypeError('Cannot convert undefined or null to object');
    }

    var to = Object(target);

    for (var index = 1; index < arguments.length; index++) {
      var nextSource = arguments[index];

      if (nextSource != null) { // Skip over if undefined or null
        for (var nextKey in nextSource) {
          // Avoid bugs when hasOwnProperty is shadowed
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
    return to;
  };
}

//Array.prototype.findIndex from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex?v=control
if (!Array.prototype.findIndex)
{
    Object.defineProperty(Array.prototype, 'findIndex', {
        value: function (predicate)
        {
            // 1. Let O be ? ToObject(this value).
            if (this == null)
            {
                throw new TypeError('"this" is null or not defined');
            }

            var o = Object(this);

            // 2. Let len be ? ToLength(? Get(O, "length")).
            var len = o.length >>> 0;

            // 3. If IsCallable(predicate) is false, throw a TypeError exception.
            if (typeof predicate !== 'function')
            {
                throw new TypeError('predicate must be a function');
            }

            // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
            var thisArg = arguments[1];

            // 5. Let k be 0.
            var k = 0;

            // 6. Repeat, while k < len
            while (k < len)
            {
                // a. Let Pk be ! ToString(k).
                // b. Let kValue be ? Get(O, Pk).
                // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
                // d. If testResult is true, return k.
                var kValue = o[k];
                if (predicate.call(thisArg, kValue, k, o))
                {
                    return k;
                }
                // e. Increase k by 1.
                k++;
            }

            // 7. Return -1.
            return -1;
        }
    });
}

//Array.prototype.fill from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fill?v=control
if (!Array.prototype.find)
{
    Object.defineProperty(Array.prototype, 'find', {
        value: function (predicate)
        {
            // 1. Let O be ? ToObject(this value).
            if (this == null)
            {
                throw new TypeError('"this" is null or not defined');
            }

            var o = Object(this);

            // 2. Let len be ? ToLength(? Get(O, "length")).
            var len = o.length >>> 0;

            // 3. If IsCallable(predicate) is false, throw a TypeError exception.
            if (typeof predicate !== 'function')
            {
                throw new TypeError('predicate must be a function');
            }

            // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
            var thisArg = arguments[1];

            // 5. Let k be 0.
            var k = 0;

            // 6. Repeat, while k < len
            while (k < len)
            {
                // a. Let Pk be ! ToString(k).
                // b. Let kValue be ? Get(O, Pk).
                // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
                // d. If testResult is true, return kValue.
                var kValue = o[k];
                if (predicate.call(thisArg, kValue, k, o))
                {
                    return kValue;
                }
                // e. Increase k by 1.
                k++;
            }

            // 7. Return undefined.
            return undefined;
        }
    });
}

//Array.prototype.copyWithin from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/copyWithin?v=control
if (!Array.prototype.copyWithin)
{
    Array.prototype.copyWithin = function (target, start/*, end*/)
    {
        // Steps 1-2.
        if (this == null)
        {
            throw new TypeError('this is null or not defined');
        }

        var O = Object(this);

        // Steps 3-5.
        var len = O.length >>> 0;

        // Steps 6-8.
        var relativeTarget = target >> 0;

        var to = relativeTarget < 0 ?
            Math.max(len + relativeTarget, 0) :
            Math.min(relativeTarget, len);

        // Steps 9-11.
        var relativeStart = start >> 0;

        var from = relativeStart < 0 ?
            Math.max(len + relativeStart, 0) :
            Math.min(relativeStart, len);

        // Steps 12-14.
        var end = arguments[2];
        var relativeEnd = end === undefined ? len : end >> 0;

        var final = relativeEnd < 0 ?
            Math.max(len + relativeEnd, 0) :
            Math.min(relativeEnd, len);

        // Step 15.
        var count = Math.min(final - from, len - to);

        // Steps 16-17.
        var direction = 1;

        if (from < to && to < (from + count))
        {
            direction = -1;
            from += count - 1;
            to += count - 1;
        }

        // Step 18.
        while (count > 0)
        {
            if (from in O)
            {
                O[to] = O[from];
            } else
            {
                delete O[to];
            }

            from += direction;
            to += direction;
            count--;
        }

        // Step 19.
        return O;
    };
}
//Array.prototype.fill from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fill?v=control
if (!Array.prototype.fill)
{
    Object.defineProperty(Array.prototype, 'fill', {
        value: function (value)
        {

            // Steps 1-2.
            if (this == null)
            {
                throw new TypeError('this is null or not defined');
            }

            var O = Object(this);

            // Steps 3-5.
            var len = O.length >>> 0;

            // Steps 6-7.
            var start = arguments[1];
            var relativeStart = start >> 0;

            // Step 8.
            var k = relativeStart < 0 ?
                Math.max(len + relativeStart, 0) :
                Math.min(relativeStart, len);

            // Steps 9-10.
            var end = arguments[2];
            var relativeEnd = end === undefined ?
                len : end >> 0;

            // Step 11.
            var final = relativeEnd < 0 ?
                Math.max(len + relativeEnd, 0) :
                Math.min(relativeEnd, len);

            // Step 12.
            while (k < final)
            {
                O[k] = value;
                k++;
            }

            // Step 13.
            return O;
        }
    });
}
