;(function($) {

  function Tooltip(element, options) {
    this.init(element, options);
  }

  Tooltip.prototype.init = function(element, options) {
    this.target_element = element;
    this.settings = this.getOptions(options);
    this.fragment = this.makeFragment();

    this.bindEvents();
  }

  /**
   * Get settings according to defalut settings.
   * Customized settings will override default settings.
   */
  Tooltip.prototype.getOptions = function(options) {
    var DEFAULT = {
      template: '<div class="my-tooltip"><div class="tooltip-body"><div class="tooltip-arrow"></div></div></div>',
      content: '<div>This is the content of tooltip.</div>',
      verticle_gutter: 8,
      delay: 1000
    }

    var customized_settings = $.extend({}, DEFAULT, options);
    return customized_settings;
  }

  /**
   * Generate tooltip HTML fragment.
   */
  Tooltip.prototype.makeFragment = function() {
    var fragment = $(this.settings.template);
    fragment.find('.tooltip-body').append(this.settings.content);
    fragment.css('visibility', 'hidden');
    return fragment;
  }

  /**
   * Set up tooltip position and arrow icon position.
   */
  Tooltip.prototype.setPosition = function(obj) {
    var self = obj;
    var body = $('body');
    var arrow_element = self.fragment.find('.tooltip-arrow');

    body.append(self.fragment);

    var document_width = $(document).width();
    var body_offset_left = body.offset().left;

    var tooltip_width = self.fragment.outerWidth(true);
    var tooltip_height = self.fragment.outerHeight();
    var target_element_width = self.target_element.outerWidth();
    var target_element_height = self.target_element.outerHeight();

    var arrow_element_height = arrow_element.outerHeight();

    var offset = self.target_element.offset();

    var scrollTop = self.target_element.scrollTop();

    var tooltip_offset_left = 0;
    var tooltip_offset_top = self.settings.verticle_gutter;

    //Set up verticle position    
    if (offset.top - scrollTop < tooltip_height) {
      tooltip_offset_top += offset.top + target_element_height - scrollTop;

      arrow_element.css({
        borderBottomColor: '#323232',
        top: (-arrow_element_height) + 'px'
      });
    }
    else {
      tooltip_offset_top = offset.top - scrollTop - tooltip_height - tooltip_offset_top;

      arrow_element.css({
        borderTopColor: '#323232',
        bottom: (-arrow_element_height) + 'px'
      });
    }

    //Set up horizontal position
    if ((tooltip_width - target_element_width)/2 > document_width - offset.left - target_element_width) {
      tooltip_offset_left = document_width - tooltip_width - body_offset_left;
    }
    else if ((tooltip_width - target_element_width)/2 > offset.left) {
      tooltip_offset_left = body_offset_left;
    }
    else {
      tooltip_offset_left = offset.left - (tooltip_width - target_element_width)/2;
    }

    self.fragment.css({
      position: 'fixed',
      zIndex: 999,
      left: tooltip_offset_left + 'px',
      top: tooltip_offset_top + 'px'
    });

    arrow_element.css('left', (offset.left + target_element_width/2 - self.fragment.offset().left) + 'px');
  }

  /**
   * Bind IO events with target DOM element.
   */
  Tooltip.prototype.bindEvents = function() {
    var self = this;

    self.target_element.on('mouseover.tooltip', function(event) {
      self.setPosition(self);

      var timeoutId = setTimeout(function() {
        self.show(self.fragment);
      }, self.settings.delay);

      self.target_element.one('mouseout.tooltip', function(event) {
        clearTimeout(timeoutId);
        self.destroy(self.fragment);
      });

    });
  }

  Tooltip.prototype.show = function(fragment) {
    fragment.css('visibility', 'visible');
  }

  Tooltip.prototype.destroy = function(fragment) {
    fragment.css('visibility', 'hidden');
    fragment.remove();
  }

  /**
   * Add tooltip method as jQuery plugin
   */
  $.fn.tooltip = function(options) {
    return this.each(function() {
      var tooltip = new Tooltip($(this), options);
    })
  }

})(jQuery);
