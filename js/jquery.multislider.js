/**\/
 * Copyright (c) 2014, Emanuele "ToX" Toscano
 * Available via the MIT license.
 * see: https://github.com/ToX82/jquery.multiSlider for details
 * jquery.multislider.js - version. 0.1
/**/

(function ($) {
    $.fn.multiSlider = function (options) {
        var config = {
            'sliders': $(".sliders"),
                'max': 100,
                'speed': "fast",
                'debug': false
        };
        $this = this.selector;
        if (options) $.extend(config, options);

        var init = true,
            sliders = config.sliders,
            max = config.max,
            speed = config.speed,
            debug = config.debug,
            elements = $(config.sliders).length,
            initValue = (max / elements) >> 0,
            InitMod = max % elements;

        $(sliders).each(function () {
            var context = $(this),
                input = context.prev(".amount"),
                localval = input.data('answer'),
                localmin = input.data('min'),
                localmax = input.data('max'),
                range = 1,
                proceed = false;

            $(this).empty().slider({
                value: localval,
                min: localmin,
                max: localmax,
                range: range,
                animate: speed,
                create: function (event, ui) {
                    if (InitMod > 0) {
                        $(this).slider('value', initValue + 1);
                        $(this).prev('.amount').val(initValue + 1);
                        InitMod = InitMod - 1;
                    } else {
                        $(this).slider('value', initValue);
                        $(this).prev('.amount').val(initValue);
                    }
                },
                slide: function (e, ui) {
                    // Update input to current slider value
                    $(this).prev('.amount').val(ui.value);
                    var current = ($(this).index() / 2) >> 0;
                    var total = 0;
                    var counter = 0;

                    sliders.not(this).each(function () {
                        total += $(this).slider("option", "value");
                        counter += 1;
                    });

                    total += ui.value;
                    if (total != max) {
                        proceed = true;
                    }

                    var missing = max - total;
                    if (debug) {
                        console.log("missing: " + missing);
                    }
                    counter = 0;

                    if (proceed) {
                        //carico vettore elementi
                        var elements = [];
                        sliders.each(function () {
                            elements[counter] = $(this);
                            counter += 1;
                        });

                        var endIndex = counter - 1;
                        counter = endIndex + 1;

                        while (missing !== 0) {
                            if (debug) {
                                console.log("current counter: " + counter);
                            }
                            do {
                                if (counter === 0) {
                                    counter = endIndex;
                                } else {
                                    counter = counter - 1;
                                }
                            } while (counter == current);

                            if (debug) {
                                console.log("elemento attuale: " + counter);
                            }
                            var value = elements[counter].slider("option", "value");
                            var result = value + missing;

                            if (result >= 0) {
                                elements[counter].slider('value', result);
                                elements[counter].prev('.amount').val(result);
                                missing = 0;
                            } else {
                                missing = result;
                                elements[counter].slider('value', 0);
                                elements[counter].prev('.amount').val(0);
                            }
                        }
                    }
                }
            });
        });
        return this;
    };
})(jQuery);
