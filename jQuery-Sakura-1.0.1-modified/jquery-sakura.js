// Plugin code
(function () {
    function htmlToElement(html) {
        var template = document.createElement('template');
        template.innerHTML = html;
        return template.content.firstChild;
    }

    /** Polyfills and prerequisites **/

        // requestAnimationFrame Polyfill
    var lastTime = 0;
    var vendors = ['webkit', 'o', 'ms', 'moz', ''];
    var vendorCount = vendors.length;

    for (var x = 0; x < vendorCount && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function (callback) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));

            var id = window.setTimeout(function () {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;

            return id;
        };
    }

    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
    }

    // Prefixed event check
    Element.prototype.prefixedEvent = function (type, callback) {
        for (var x = 0; x < vendorCount; ++x) {
            if (!vendors[x]) {
                type = type.toLowerCase();
            }

            el = this;
            el.addEventListener(vendors[x] + type, callback, false);
        }

        return this;
    };

    // Test if element is in viewport
    function elementInViewport(el) {

        var rect = el.getBoundingClientRect();

        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Random array element
    function randomArrayElem(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    // Random integer
    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    Element.prototype.css = function (styles) {
        for (var key in styles) {
            if (styles.hasOwnProperty(key)) {
                this.style[key] = styles[key];
            }
        }
    };

    /** Actual plugin code **/
    Element.prototype.sakura = function (event, options) {

        // Target element
        var target = this.selector == "" ? document.querySelectorAll('body') : this;

        // Defaults for the option object, which gets extended below
        var defaults = {
            blowAnimations: ['blow-soft-left', 'blow-medium-left', 'blow-soft-right', 'blow-medium-right'],
            className: 'sakura',
            fallSpeed: 1,
            maxSize: 14,
            minSize: 10,
            newOn: 300,
            swayAnimations: ['sway-0', 'sway-1', 'sway-2', 'sway-3', 'sway-4', 'sway-5', 'sway-6', 'sway-7', 'sway-8']
        };

        var extend = function (out) {
            out = out || {};

            for (var i = 1; i < arguments.length; i++) {
                if (!arguments[i])
                    continue;

                for (var key in arguments[i]) {
                    if (arguments[i].hasOwnProperty(key))
                        out[key] = arguments[i][key];
                }
            }

            return out;
        };


        var options = extend({}, defaults, options);

        // Default or start event
        if (typeof event === 'undefined' || event === 'start') {

            // Set the overflow-x CSS property on the target element to prevent horizontal scrollbars
            target.css({ 'overflow-x': 'hidden' });

            // Function that inserts new petals into the document
            var petalCreator = function () {
                if (target.sakuraAnimId) {
                    setTimeout(function () {
                        requestAnimationFrame(petalCreator);
                    }, options.newOn);
                }

                // Get one random animation of each type and randomize fall time of the petals
                var blowAnimation = randomArrayElem(options.blowAnimations);
                var swayAnimation = randomArrayElem(options.swayAnimations);
                var fallTime = ((document.documentElement.clientHeight * 0.007) + Math.round(Math.random() * 5)) * options.fallSpeed;

                // Build animation
                var animations =
                    'fall ' + fallTime + 's linear 0s 1' + ', ' +
                    blowAnimation + ' ' + (((fallTime > 30 ? fallTime : 30) - 20) + randomInt(0, 20)) + 's linear 0s infinite' + ', ' +
                    swayAnimation + ' ' + randomInt(2, 4) + 's linear 0s infinite';

                // Create petal and randomize size


                var petal = htmlToElement('<div class="' + options.className + '" />');
                var height = randomInt(options.minSize, options.maxSize);
                var width = height - Math.floor(randomInt(0, options.minSize) / 3);

                // Apply Event Listener to remove petals that reach the bottom of the page
                petal.prefixedEvent('AnimationEnd', function () {
                    if (!elementInViewport(this)) {
                        this.parentNode.removeChild(this);
                    }
                })
                // Apply Event Listener to remove petals that finish their horizontal float animation
                    .prefixedEvent('AnimationIteration', function (ev) {
                        if (
                            (
                                options.blowAnimations.indexOf(ev.animationName) != -1 ||
                                options.swayAnimations.indexOf(ev.animationName) != -1
                            ) &&
                            !elementInViewport(this)
                        ) {
                            this.parentNode.removeChild(this);
                        }
                    })
                    .css({
                        '-webkit-animation': animations,
                        animation: animations,
                        'border-radius': randomInt(options.maxSize, (options.maxSize + Math.floor(Math.random() * 10))) + 'px ' + randomInt(1, Math.floor(width / 4)) + 'px',
                        height: height + 'px',
                        left: (Math.random() * document.documentElement.clientWidth - 100) + 'px',
                        'margin-top': (-(Math.floor(Math.random() * 20) + 15)) + 'px',
                        width: width + 'px',
                        'z-index': 900
                    });

                target.append(petal);
            };

            // Finally: Start adding petals
            target.sakuraAnimId = requestAnimationFrame(petalCreator);

        }
        // Stop event, which stops the animation loop and removes all current blossoms
        else if (event === 'stop') {

            // Cancel animation
            var animId = target.sakuraAnimId;

            if (animId) {
                cancelAnimationFrame(animId);
                target.sakuraAnimId = null;
            }

            // Remove all current blossoms
            // setTimeout(function () {
            //     let nodeList = document.querySelectorAll('.' + options.className);
            //     for (var i = 0; i < nodeList.length; i++) {
            //         nodeList[i].parentNode.removeChild(nodeList[i]);
            //     }
            // }, (options.newOn + 50));

        }
    };
}());
