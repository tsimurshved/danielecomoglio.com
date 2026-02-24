/*!
 * Morphext - Text Rotating Plugin for jQuery
 * https://github.com/MrSaints/Morphext
 *
 * Built on jQuery Boilerplate
 * http://jqueryboilerplate.com/
 *
 * Copyright 2014 Ian Lai and other contributors
 * Released under the MIT license
 * http://ian.mit-license.org/
 */

/*eslint-env browser */
/*global jQuery:false */
/*eslint-disable no-underscore-dangle */

(function ($) {
    "use strict";
    
    var pluginName = "DIPIMorphext",
        defaults = {
            inAnimation: "bounceIn",
            outAnimation: "bounceOut",
            separator: ",",
            speed: 2000,
            duration: 1000,
            complete: $.noop
        };

    function Plugin (element, options) {
        this.element = $(element);
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._init();
    }

    Plugin.prototype = {
        _init: function () {
            var $that = this;
            this.phrases = [];
            this.shouldContinue = true;

            this.element.addClass("dipi_morphext");

            $.each(this.element.html().split(this.settings.separator), function (key, value) {
                $that.phrases.push($.trim(value));
            });

            this.index = -1;
            this.animate();
        },
        animate: function () {
            if(!this.shouldContinue){
                return;
            }

            let animated = this.element.find(".animated");
            if(animated.length > 0){
                animated.removeClass(this.settings.inAnimation);
                animated.addClass(this.settings.outAnimation);
                setTimeout(() => this.next(), this.settings.duration);
            } else {
                this.next();
            }
        },
        next: function() {
            if(!this.shouldContinue){
                return;
            }

            this.index = ++this.index % this.phrases.length;
            this.element[0].innerHTML = `<div class="animated ${this.settings.inAnimation}">${this.phrases[this.index]}</div>`;
            setTimeout(() => this.animate(), this.settings.speed);
        },
        stop: function() {
            this.shouldContinue = false;
            this.element.removeClass("dipi_morphext");
            this.element.removeData("plugin_" + pluginName);
        }
    };

    $.fn[pluginName] = function (options) {
        return this.each(function() {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin(this, options));
            } 
        });
    };
})(jQuery);