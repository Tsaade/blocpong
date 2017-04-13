(function() {
    function Config ($stateProvider, $locationProvider) {
        $locationProvider
            .html5Mode({
                enable: true,
                requireBase: false
        });
        
        $stateProvider
            .state('home', {
                url: '/',
                controller: 'HomeCtrl as home',
                template: '/templates/home.html'
        });
    }
    
    angular
        .module('blocpong', ['ui,router'])
        .config(config);
})();