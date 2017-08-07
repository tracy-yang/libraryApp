angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])
//底边栏可以隐藏的设置
.directive('hideTabs', function($rootScope) {
	return {
		restrict: 'A',
		link: function(scope, element, attributes) {
			scope.$on('$ionicView.beforeEnter', function() {
				scope.$watch(attributes.hideTabs, function(value){	
					$rootScope.hideTabs = value;
				});
			});
			scope.$on('$ionicView.beforeLeave', function() {
				$rootScope.hideTabs = false;
			});	
		}
	};
})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {
	//清除返回的字
 	$ionicConfigProvider.backButton.text("");
  $ionicConfigProvider.backButton.previousTitleText(false);
  
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

	/***********主页************/
  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

	/*******分类**************/
  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
         	controller: 'ChatsCtrl'
        }
      }
    })
  
  /***********分类页********************/
	.state('tab.bookCategory', {
	  url: '/chats/category/:id', // /chats/1
	  views: {
	    'tab-chats': {
	      templateUrl: 'templates/bookListByCategory.html',
	      controller: 'bookCategory'
	    }
	  }
	})
	
	
	/**************书本详情页*******************/
	.state('bookDetail', {
      url: '/bookDetail/:cateId', // /chats/1
      templateUrl: 'templates/bookDetail.html',
      controller: 'bookDetailCategory'


    })
	
	
	/*******借书架*********/
	  .state('tab.account', {
	    url: '/account',
	    cache:false,
	    views: {
	      'tab-account': {
	        templateUrl: 'templates/tab-account.html',
	        controller: 'CartCtrl'
	      }
	    }
	  })
  	
  	/*******确认订单*********/
	.state('tab.confirmOrder', {
	    url: '/confirmOrder',
	    params:{'bookInfoId':null},
	    views: {
	      'tab-account': {
	        templateUrl: 'templates/confirmOrder.html',
	        controller: 'ConfirmOrderCtrl'
	      }
	    }
	})
  

	/********个人中心************/
	.state('tab.mine', {
    url: '/mine',
    cache:false,
    views: {
      'tab-mine': {
        templateUrl: 'templates/tab-mine.html',
        controller: 'MineCtrl'
      }
    }
  })
	
	/*********当前借阅************/
	.state('tab.order', {
	    url: '/order',
	    cache:false,
	    views: {
	      'tab-mine': {
	        templateUrl: 'templates/myOrder.html',
	        controller: 'OrderCtrl'
	      }
	    }
	  })
	
	/*********历史借阅************/
	.state('tab.orderOld', {
	    url: '/orderOld',
	    cache:false,
	    views: {
	      'tab-mine': {
	        templateUrl: 'templates/myOrderDetail.html',
	        controller: 'OrderOldCtrl'
	      }
	    }
	  })
	
	
	/***********收藏页*************/
	.state('tab.collection', {
	    url: '/collection',
	    params:{'id':null},
	    views: {
	      'tab-mine': {
	        templateUrl: 'templates/myCollection.html',
	        controller: 'CollectionCtrl'
	      }
	    }
  	})
	
	
	/************我的地址************/
	.state('tab.address', {
	    url: '/address/:id',
	    views: {
	      'tab-mine': {
	        templateUrl: 'templates/myAddress.html',
	        controller: 'AddressCtrl'
	      }
	    }
  	})
	
	/**********个人详细信息**********/
	.state('tab.userDetail', {
	    url: '/userDetail/:id',
	    views: {
	      'tab-mine': {
	        templateUrl: 'templates/userDetail.html',
	        controller: 'UserDetailCtrl'
	      }
	    }
  	})
	
	/***********修改密码***************/
	.state('tab.modifyPwd', {
	    url: '/modifyPwd',
	    views: {
	      'tab-mine': {
	        templateUrl: 'templates/modifyPwd.html',
	        controller: 'modifyPwdCtrl'
	      }
	    }
  	})	
	
	/***********修改手机号***************/
	.state('tab.modifyPhone', {
	    url: '/modifyPhone',
	    views: {
	      'tab-mine': {
	        templateUrl: 'templates/modifyPhone.html',
	        controller: 'modifyPhoneCtrl'
	      }
	    }
  	})	



	/******登录********/
	.state('tab.login', {
    url: '/mine/login',
    views: {
      'tab-mine': {
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      }
    }
  })
	
	
	

  $urlRouterProvider.otherwise('tab/dash');

});
