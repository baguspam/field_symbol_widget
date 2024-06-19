odoo.define('field_symbol_widget.field_symbol', function (require) {
    "use strict";

    var core = require('web.core');
    var common = require('web.form_common');
    var list_widgets = require('web.ListView');
    var _t = core._t;

    function formatSuffix(value, suffix){
        var v_suffix = '';
        if(suffix!=false){
            v_suffix = suffix;
        }
        return value + v_suffix;
    }

    var FormSymbolWidget = common.AbstractField.extend(common.ReinitializeFieldMixin, {
        init: function (field_manager, node) {
            this._super(field_manager, node);
            this.options = this.options || {};
        },
        render_value: function () {
            this._super.apply(this, arguments);
            var value = this.get('value');
            var field_symbol = value || 0;

            if (this.options.text_symbol) {
                field_symbol = formatSuffix(field_symbol, this.options.text_symbol);
            }

            this.$el.html($('<span>' + field_symbol + '</span>'));
        },
    });
    core.form_widget_registry.add('field_symbol', FormSymbolWidget);

     var ListSymbolWidget = list_widgets.Column.extend({
        _format: function (row_data, options) {
            var value = row_data[this.id].value;
            var text_symbol = this.options || false;
            
            // If text_symbol is a string like "{'text_symbol': '%'}"
            if (typeof text_symbol === 'string') {
                try {
                    // Replace single quotes with double quotes
                    var jsonString = text_symbol.replace(/'/g, '"');
                    // Parse the JSON string to an object
                    var jsonObject = JSON.parse(jsonString);
                    // Access the value of 'text_symbol'
                    text_symbol = jsonObject.text_symbol;
                } catch (error) {
                    console.error('Error parsing text_symbol:', error);
                }
            }
            
            if (typeof formatSuffix === 'function') {
                return formatSuffix(value, text_symbol);
            } else {
                console.error('formatSuffix is not defined or not a function');
                return value;
            }
        }
    });

    core.list_widget_registry.add('field.field_symbol', ListSymbolWidget);

});
