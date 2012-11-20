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
      },
      
      getRepoFullName: function(owner, repoName) {
          return owner + '/' + repoName;
      },
      
      getFavoriteRepos: function() {
          return angular.fromJson(localStorage.getItem('favoriteRepos')) || (new Array());
      },

      getFavoriteUsers: function() {
          return angular.fromJson(localStorage.getItem('favoriteUsers')) || (new Array());
      },

      setFavoriteRepos: function(favoriteRepos) {
          localStorage.setItem('favoriteRepos', angular.toJson(favoriteRepos));
      },

      setFavoriteUsers: function(favoriteUsers) {
          localStorage.setItem('favoriteUsers', angular.toJson(favoriteUsers));
      },

      clearFavoriteRepos: function() {
          localStorage.removeItem('favoriteRepos');
      },

      clearFavoriteUsers: function() {
          localStorage.removeItem('favoriteUsers');
      },

      hasFavoriteRepos: function() {
          return this.getFavoriteRepos().length > 0;
      },

      hasFavoriteUsers: function() {
          return this.getFavoriteUsers().length > 0;
      },

      isFavoriteRepo: function(repoFullName) {
          return _.indexOf(this.getFavoriteRepos(), repoFullName) > -1;
      },

      isFavoriteUser: function(login) {
          return _.indexOf(this.getFavoriteUsers(), login) > -1;
      },

      toggleFavoriteRepo: function(repoFullName) {
          if (this.isFavoriteRepo(repoFullName)) {
              this.removeFavoriteRepo(repoFullName);
          } else {
              this.addFavoriteRepo(repoFullName);
          }
      },

      toggleFavoriteUser: function(login) {
          if (this.isFavoriteUser(login)) {
              this.removeFavoriteUser(login);
          } else {
              this.addFavoriteUser(login);
          }
      },

      addFavoriteRepo: function(repoFullName) {
          var favoriteRepos = this.getFavoriteRepos();
          favoriteRepos.push(repoFullName)
          this.setFavoriteRepos(favoriteRepos);
      },

      addFavoriteUser: function(login) {
          var favoriteUsers = this.getFavoriteUsers();
          favoriteUsers.push(login)
          this.setFavoriteUsers(favoriteUsers);
      },

      removeFavoriteRepo: function(repoFullName) {
          this.setFavoriteRepos(_.without(this.getFavoriteRepos(), repoFullName));
      },

      removeFavoriteUser: function(login) {
          this.setFavoriteUsers(_.without(this.getFavoriteUsers(), login));
      }
  }
});
