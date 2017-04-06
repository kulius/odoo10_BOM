odoo.define('coffee.ViewManager', function (require) {
    "use strict";

    var config = require('web.config');
    var ViewManager = require('web.ViewManager');

    ViewManager.include({
        get_default_view: function () {
            var default_view = this._super.apply(this, arguments);
            if (config.device.size_class <= config.device.SIZES.XS && !default_view.mobile_friendly) {
                default_view = (_.find(this.views, function (v) { return v.mobile_friendly; })) || default_view;
            }
            return default_view;
        },
    });

});

odoo.define('coffee.ControlPanel', function (require) {
    "use strict";

    var config = require('web.config');
    var ControlPanel = require('web.ControlPanel');

    ControlPanel.include({
        _render_breadcrumbs_li: function (bc, index, length) {
            var $bc = this._super.apply(this, arguments);

            var is_last = (index === length-1);
            var is_before_last = (index === length-2);

            $bc.toggleClass('hidden-xs', !is_last && !is_before_last)
                .toggleClass('o_back_button', is_before_last);

            return $bc;
        },
        _update_search_view: function(searchview, is_hidden) {
            this._super.apply(this, arguments);

            if (config.device.size_class <= config.device.SIZES.XS) {
                this.$el.addClass('o_breadcrumb_full');
            }

            if(this.$enable_searchview === undefined) {
                var self = this;
                this.$enable_searchview = $('<button/>', {type: 'button'})
                    .addClass('o_enable_searchview btn btn-sm btn-default fa fa-search')
                    .on('click', function() {
                        self.searchview_displayed = !self.searchview_displayed;
                        self.$el.toggleClass('o_breadcrumb_full', !self.searchview_displayed);
                        self.nodes.$searchview_buttons.toggle(self.searchview_displayed);
                    });
            }
            if(!is_hidden && config.device.size_class <= config.device.SIZES.XS) {
                this.$enable_searchview.insertAfter(this.nodes.$searchview);
                this.searchview_displayed = false;
                this.nodes.$searchview_buttons.hide();
            } else {
                this.$enable_searchview.detach();
            }
        },
    });

    return ControlPanel;

});

odoo.define('coffee.FormView', function (require) {
    "use strict";

    var config = require('web.config');
    var FormRenderingEngineMobile = require('coffee.FormRenderingEngineMobile');
    var FormView = require('web.FormView');

    FormView.include({
        defaults: _.extend({}, FormView.prototype.defaults, {
            disable_autofocus: config.device.touch,
        }),
        init: function () {
            this._super.apply(this, arguments);
            if (config.device.size_class <= config.device.SIZES.XS) {
                this.rendering_engine = new FormRenderingEngineMobile(this);
            }
        },
    });

});


odoo.define('coffee.FormRenderingEngine', function (require) {
    "use strict";

    var config = require('web.config');
    var core = require('web.core');
    var FormRenderingEngine = require('web.FormRenderingEngine');

    var _t = core._t;

    FormRenderingEngine.include({
        process: function($tag) {
            var self = this;
            // Add button box post rendering when window resize and record loaded events
            if($tag.attr("name") === 'button_box') {
                this.view.is_initialized.then(function() {
                    var $buttons = $tag.children();
                    self.organize_button_box($tag, $buttons);

                    self.view.on('view_content_has_changed', self, function() {
                        this.organize_button_box($tag, $buttons);
                    });
                    core.bus.on('size_class', self, function() {
                        this.organize_button_box($tag, $buttons);
                    });
                });
            }
            return this._super($tag);
        },
        organize_button_box: function($button_box, $buttons) {
            var $visible_buttons = $buttons.not('.o_form_invisible');
            var $invisible_buttons = $buttons.filter('.o_form_invisible');

            // Get the unfolded buttons according to window size
            var nb_buttons = [2, 4, 6, 7][config.device.size_class];
            var $unfolded_buttons = $visible_buttons.slice(0, nb_buttons).add($invisible_buttons);

            // Get the folded buttons
            var $folded_buttons = $visible_buttons.slice(nb_buttons);
            if($folded_buttons.length === 1) {
                $unfolded_buttons = $buttons;
                $folded_buttons = $();
            }

            // Empty button box and toggle class to tell if the button box is full (LESS requirement)
            $buttons.detach();
            $button_box.empty();
            var full = ($visible_buttons.length > nb_buttons);
            $button_box.toggleClass('o_full', full).toggleClass('o_not_full', !full);

            // Add the unfolded buttons
            $unfolded_buttons.each(function(index, elem) {
                $(elem).appendTo($button_box);
            });

            // Add the dropdown with unfolded buttons if any
            if($folded_buttons.length) {
                $button_box.append($("<button/>", {
                    type: 'button',
                    'class': "btn btn-sm oe_stat_button o_button_more dropdown-toggle",
                    'data-toggle': "dropdown",
                    text: _t("More"),
                }));

                var $ul = $("<ul/>", {'class': "dropdown-menu o_dropdown_more", role: "menu"}).appendTo($button_box);
                $folded_buttons.each(function(i, elem) {
                    $('<li/>').appendTo($ul).append(elem);
                });
            }
        }
    });

});

odoo.define('coffee.FormRenderingEngineMobile', function (require) {
    "use strict";

    var FormRenderingEngine = require('web.FormRenderingEngine');

    return FormRenderingEngine.extend({
        fill_statusbar_buttons: function ($statusbar_buttons, $buttons) {
            if(!$buttons.length) {
                return;
            }
            var $statusbar_buttons_dropdown = this.render_element('FormRenderingStatusBar_DropDown', {});
            $buttons.each(function(i, el) {
                $statusbar_buttons_dropdown.find('.dropdown-menu').append($('<li/>').append(el));
            });
            $statusbar_buttons.append($statusbar_buttons_dropdown);
        },
    });

});
