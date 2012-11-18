'use strict';

gsearchApp.factory('util', function() {
  return {
      addMessage: function(message, severity) {
          var cssClasses = 'alert';
          
          if(severity) {
              cssClasses += ' alert-'+severity;
          }
          
          $("#msg").append('<div class="'+cssClasses+'"> <button type="button" class="close" data-dismiss="alert">×</button>'+message+'</div>');
      },

      info: function(message) {
          this.addMessage(message, 'info');
      },

      success: function(message) {
          this.addMessage(message, 'success');
      },

      warn: function(message) {
          this.addMessage(message, 'warning');
      },

      error: function(message) {
          this.addMessage(message, 'error');
      },

      cleanMessages: function() {
          $("#msg > div").remove();
      },
      
      block: function() {
          $.blockUI({ message: '<h1><img src="images/wait.gif" /> <span class="hidden-phone">Just a moment...</span></h1>' });
      },

      unblock: function() {
          $.unblockUI();
      }
  }
});
