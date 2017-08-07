angular.module('starter.controllers', ['myDirective','starter.services'])
.run(function($rootScope,localStorage){
	//获取用户的基本信息
	$rootScope.account=null;
	if(localStorage.get('user')){
		$rootScope.account=localStorage.get('user');
	}
	
	console.log($rootScope.account);
})

/********主页的控制器**************/
.controller('DashCtrl',function($scope,book,$location) {
	//存储所有图书信息
	$scope.bookList=[];
	
	//调用ajax获取数据
	book.recommendPageOne().then(function(response){
		console.log(response);
		if(response.data.code == 1){
			$scope.bookList=response.data.result;
		}
	},function(ex){console.log(ex)});
	
	//跳转到书本详情页
	$scope.toDetail=function(item){
		$location.path('/bookDetail/'+item.id);
	}
	
})


/***********分类的控制器****************/
.controller('ChatsCtrl', function($scope,category,$location) {
	//分类的图片
	$scope.cateImg=['war.png','economy.png','literature.png','art.png','religion.png','child.png','computer.png','medicine.png','math.png','other.png']
  //存放所有分类
  $scope.categories=[];
  //调用ajax获取数据
  category.list().then(function(response){
  	//获取成功
  	if(response.data.code == 1){
  		$scope.categories=response.data.result;
  		//为每个分类增加一张图片
  		for(var i=0;i<$scope.categories.length;i++){			
  			$scope.categories[i].img=$scope.cateImg[i];
  			
  		}
  		
  		console.log($scope.categories);
  	}
  },function(ex){console.log(ex)});
  
  $scope.toBookListByCategory=function(item){
  	$location.path('tab/chats/category/'+item.id);
  }
  
})

/************分类页***************/
.controller('bookCategory', function($scope, $stateParams,category) {
	//分类的对象
	$scope.category={
		id:$stateParams.id,
		list:[],
		index:0,
		number:12,
		getList:function(){
			//调用ajax获取对应分类下的图书列表
		 	category.listByCategory($scope.category.id,$scope.category.index,$scope.category.number).then(function(response){
		 		console.log(response);
		 		//获取图书列表
		 		if(response.data.code == 1){
		 			$scope.category.list=response.data.result;
		 			console.log($scope.category.list);
		 		}
		 	},function(ex){console.log(ex)});
		}
	}
  //调用方法
 	$scope.category.getList();
})

/*****************图书详情的控制器***************/
.controller('bookDetailCategory',function($scope,$http,book,$stateParams,$ionicHistory,collection,$rootScope,cart){
	//通过图书的bookInfoId获取图书信息
	$scope.book={
		flag:false,
		code:null,
		id:$stateParams.cateId,
		bookDetail:{},
		//获取图书详情
		getBookDetailByMember:function(){
			//调用ajax获取对应图书的信息
			book.getBookByIdAndMemberId($scope.book.id,$rootScope.account.memberId).then(function(response){
				console.log(response);
				//获取成功
				if(response.data.code == 1){
					$scope.book.bookDetail=response.data.result;
					if(!response.data.result.mediaComment){
						$scope.book.bookDetail.mediaComment=null;
					}
					if(!response.data.result.description){
						$scope.book.bookDetail.description=null;
					}
					if(!response.data.result.introduce){
						$scope.book.bookDetail.introduce=null;
					}
				}
				console.log($scope.book.bookDetail);
				
			},function(ex){console.log(ex)});
		},
		getBookDetail:function(){
			//调用ajax获取对应图书的信息
			book.getBookById($scope.book.id).then(function(response){
				console.log(response);
				//获取成功
				if(response.data.code == 1){
					$scope.book.bookDetail=response.data.result;
					if(!response.data.result.mediaComment){
						$scope.book.bookDetail.mediaComment=null;
					}
					if(!response.data.result.description){
						$scope.book.bookDetail.description=null;
					}
					if(!response.data.result.introduce){
						$scope.book.bookDetail.introduce=null;
					}
				}
				console.log($scope.book.bookDetail);
			})
		},
		//相应图书添加到收藏夹
		addCollection:function(){
			if(!$scope.account){
				//提示信息
				alert('您还未登陆，无法完成添加收藏功能~');
				return;
			}
			//判断是否在收藏夹内
			if($scope.book.bookDetail.isInCollection == 0){
				collection.addCollection($rootScope.account.memberId,$scope.book.bookDetail.id).then(function(response){
					console.log(response);
					//成功加入到收藏夹
					if(response.data.code == 1){
						//提示信息
						alert('新增成功~');
						//新增成功
						$scope.book.flag=true;
					}
					/*else if(response.data.code == 2){
						//提示信息
						
					}*/
				},function(ex){console.log(ex)});
			}
			else{
				collection.delCollectionByCollectionId($rootScope.account.memberId,$scope.book.bookDetail.id).then(function(response){
					console.log(response);
					//删除成功
					if(response.data.code == 1){
						//提示信息
						alert("取消收藏成功~");
						//删除成功
						$scope.book.flag=false;
						
					}
				},function(ex){console.log(ex)});
			}
		},
		//加入购物车
		addCart:function(){
			if(!$scope.account){
				//提示信息
				alert('您还未登陆，无法完成添加购物车动作');
				return;
			}
			//判断是否已经在购物车里
			if($scope.book.bookDetail.isInCart == 0){
				//加入到购物车
				cart.addCart($rootScope.account.memberId,$scope.book.bookDetail.id).then(function(response){
					console.log(response);
					if(response.data.code == 1){
						//提示信息
						alert('添加购物车成功~');
					}
				},function(ex){console.log(ex)});
			}
			else{
				//提示信息
				alert("已经在购物车里~")
			}
			
		}
	}
	
	//返回上一个页面
	$scope.goback = function() {
		$ionicHistory.goBack();
	}
	
	//调用方法获取图书信息
	if(!$scope.account){
		$scope.book.getBookDetail();
	}
	else{
		$scope.book.getBookDetailByMember()
	}
})


/************购物车的控制器******************/
.controller('CartCtrl', function($scope,$rootScope,cart,$state,$rootScope,collection) {
	$scope.cart={
		cartList:null,
		editState:false,
		all:false,
		delList:[],
		getList:function(){
			cart.list($rootScope.account.memberId).then(function(response){
				console.log(response);
				//获取成功
				if(response.data.code == 1){
					$scope.cart.cartList=response.data.result;
					//给所有元素增加一个是否选中的属性
					for(var i=0;i<$scope.cart.cartList.length;i++){
						$scope.cart.cartList[i].isChecked=false;
					}
				}
			},function(ex){console.log(ex)});
		},
		delChecked:function(){
			//获取所有选中的
			$scope.cart.getChecked($scope.cart.delListFun);
			cart.del($rootScope.account.memberId,$scope.cart.delList.join()).then(function(response){
				console.log(response);
				//在数据库中删除成功
				if(response.data.code == 1){
					//显示提示信息
					alert("删除成功~");
					//在本地删除
					$scope.cart.delLocal();
				}
			},function(ex){console.log(ex)});
		},
		delLocal:function(){
			for(var i=$scope.cart.cartList.length-1;i>=0;i--){
				if($scope.cart.cartList[i].isChecked){
					$scope.cart.cartList.splice(i,1);
				}
			}
		},
		delListFun:function(item,params1,params2){
			console.log(item);
			console.log(params1);
			console.log(params2);
			if(params2){
				$scope.cart.delList.push(item[params1][params2]);
				return;
			}
			$scope.cart.delList.push(item[params1]);
		},
		toCollection:function(){
			//获取所有被选中的
			$scope.cart.getChecked(function(item){
				console.log(item);
				$scope.cart.delListFun(item,'bookInfo','id');
				collection.addCollection($scope.cart.delList).then(function(response){
					console.log(response);
					//加入成功
					if(response.data.code == 1){
						$scope.delChecked();
					}
				},function(ex){console.log(ex)});
			})
		},
		getChecked:function(callback){
			for(var i=0;i<$scope.cart.cartList.length;i++){
				if($scope.cart.cartList[i].isChecked){
					callback($scope.cart.cartList[i]);
				}
			}
		},
		order:function(){
			//获取所有选中的
			$scope.cart.getChecked(function(item){
				$scope.cart.delListFun(item,'bookInfo','id');
			}),
			$state.go('tab.confirmOrder',{bookInfoId:$scope.cart.delList.join()});
			
		}
		
	}
	
	
	
	//点击栏目跳转到书本详情页
	$scope.toBookDetail=function($event,item){		
		$state.go('bookDetail',{cateId:item.bookInfo.id});
	}
	
	//全选
	$scope.checkAll=function(){		
		for(var i=0;i<$scope.cart.cartList.length;i++){
			$scope.cart.cartList[i].isChecked=$scope.cart.all;
		}
	}
	
	//点击单独的复选框，循环数组，当有一个isChecked不为true就把全选置为false
	$scope.singleCheck=function(){
		var flag=true;
		for(var i=0;i<$scope.cart.cartList.length;i++){
			if(!$scope.cart.cartList[i].isChecked){
				flag=false;
				break;
			}
		}
		$scope.cart.all=flag;
	}
	
	if($rootScope.account){
		//调用方法获取所有借书架项目
		$scope.cart.getList();
	}
})


/****************确认订单************************/
.controller('ConfirmOrderCtrl',function($scope,$rootScope,cart,$stateParams,$state,book,location,region){
	if(!$rootScope.account){
		$state.go('tab.login');
	}
	$scope.cartList={
		bookInfoId:$stateParams.bookInfoId,
		orderList:[],
		getOrderList:function(){
			var s=$scope.cartList.bookInfoId.split(",");
			for(var i=0;i<s.length;i++){
				!function(i){
					book.getBookById(s[i],$rootScope.account.memberId).then(function(response){
						console.log(response);
						if(response.data.code == 1){
							$scope.cartList.orderList.push(response.data.result);
						}
					},function(ex){console.log(ex)});
				}(i)
			}
		},
		order:function(){
			//调用方法订单
			console.log($scope.cartList.bookInfoId);
			cart.order($rootScope.account.memberId,$scope.cartList.bookInfoId).then(function(response){
				console.log(response);
				if(response.data.code == 1){
					//跳转到成功页面
					alert('借阅成功');	
				}
				else if(response.data.code == 2){
					//提示信息
					alert("用户可借数量不足");
				}
				else if(response.data.code == 3){
					//提示信息
					alert("暂无可借图书");
				}
				else if(response.data.code == 4){
					//提示信息
					alert("相同的书只能借阅一本");
				}
			},function(ex){console.log(ex)});
		}
		
	}
	$scope.data={
		regionList:null,
		defaultRegionId:null,
		defaultLocation:null	
	}
	
	$scope.method={
		getDefaultAddress:function(){
			//获取默认区域
			region.listById($rootScope.account.memberId).then(function(response){
				console.log(response);
				if(response.data.code == 1){
					$scope.data.regionList=response.data.result;
					for(var i=0;i<$scope.data.regionList.length;i++){
						if($scope.data.regionList[i].isDefault==1){
							$scope.data.defaultRegionId=$scope.data.regionList[i].id;
							break;
						}
					}
					//根据默认区域获取默认地址
					location.listByRegionId($rootScope.account.memberId,$scope.data.defaultRegionId).then(function(response){
						console.log(response);
						if(response.data.code == 1){
							console.log(response.data.result);
							for(var i=0;i<response.data.result.length;i++){
								if(response.data.result[i].isDefault== 1){
									$scope.data.defaultLocation=response.data.result[i];
									break;
								}
							}
						}
					},function(ex){console.log(ex)});
				}
			},function(ex){console.log(ex)});
		}
	}
	
	$scope.cartList.getOrderList();
	$scope.method.getDefaultAddress();
	
	
})

/*****************个人中心控制器******************/
.controller('MineCtrl',function($scope,localStorage,$state,account,$rootScope){	
	$scope.user={
		detailInfo:null,
		logout:function(key){
			localStorage.remove(key);
		},
		getUserDetailInfo:function(memberId){
			account.getUserDetailInfo(memberId).then(function(response){
				console.log(response);
				//获取成功
				if(response.data.code == 1){
					$scope.user.detailInfo=response.data.result;
					//存放到localStorage里面
					localStorage.set('userDetail',$scope.user.detailInfo);
				}
			},function(ex){console.log(ex)});
		}	
	}
	
	//调用ajax方法获取用户的详细信息
	if($rootScope.account !=null){
		$scope.user.getUserDetailInfo($rootScope.account.memberId);
	}
	
	//点击注销按钮，注销用户
	$scope.logout=function(){
		$scope.user.logout('user');
		//清空user,使得该页面上的数据清空，变为立即登录的状态
		$rootScope.account=null;	
	}
	
	//点击我的收藏
	$scope.myCollection=function(){
		localStorage.check('tab.login','tab.collection','user','id');
	}
	
	//点击我的地址
	$scope.myAddress=function(){
		localStorage.check('tab.login','tab.address','user','id');
	}
	
	//点击我的借阅
	$scope.myOrder=function(){
		localStorage.check('tab.login','tab.order','user','id');
	}

	//点击头像进入用户的个人详情
	$scope.toUserDetail=function(){
		$state.go('tab.userDetail',{id:$rootScope.account.memberId});
	}

})

/**************当前借阅**********************/
.controller('OrderCtrl',function($scope,$rootScope,$state){
	if(!$rootScope.account){
		$state.go('tab.login');
	}
	//获取当前记录
	
	
})



/***************历史借阅*************************/
.controller('OrderOldCtrl',function($scope,$rootScope,$state){
	if(!$rootScope.account){
		$state.go('tab.login');
	}
	//获取当前记录
	
	
})

/*************登录的controller**********/
.controller('LoginCtrl',function($scope,account,localStorage,$location,$ionicHistory,$rootScope){
	$scope.user={
		name:'',
		pwd:'',
		errorMessage:'',
		code:'',
		login:function(){
			//调用ajax验证用户名
			account.login($scope.user.name,$scope.user.pwd).then(function(response){
				console.log(response);
				//登陆成功
				$scope.code=response.data.code;
				if(response.data.code == 1){
					//存入到location内
					localStorage.set('user',response.data.result);
					//存入到$rootScope里面
					$rootScope.account=response.data.result;
					//跳转到来的路径
					$ionicHistory.goBack();
					
				}
				else if(response.data.code == 2){
					$scope.user.errorMessage="用户信息有误";
					
				}
			},function(ex){console.log(ex)});
		}
	}
	
	$scope.login=function(){
		$scope.user.login();
	}
	
	
})


/*************我的收藏******************/
.controller('CollectionCtrl',function($scope,$rootScope,collection){
	//判断用户是否登录
	if(!$rootScope.account){
		$state.go('tab.login');
	}
	$scope.data = {
	   	showDelete: false,
	   	chkAll:false,
	   	bookName:null
	};
	$scope.method={
		//全选
		checkAll:function(){
			for(var i=0;i<$scope.collection.collectionList.length;i++){
				$scope.collection.collectionList[i].isChecked=$scope.data.chkAll;
			}
		},
		//单个选中
		checkSingle:function(){
			var flag=true;
			for(var i=0;i<$scope.collection.collectionList.length;i++){
				if(!$scope.collection.collectionList[i].isChecked){
					flag=false
				}
			}
			$scope.data.chkAll=flag;
		},
		//取消关注提醒
		
		
		
		
		
	}

	  
	$scope.collection={
		collectionList:null,
		checkedList:[],
		index:null,
		//获取所有收藏列表
		getList:function(){
			collection.list($scope.account.memberId).then(function(response){
				console.log(response);
				if(response.data.code == 1){
					$scope.collection.collectionList=response.data.result;
					//增加一个选中的状态
					for(var i=0;i<$scope.collection.collectionList.length;i++){
						$scope.collection.collectionList[i].isChecked=false;
					}
				}
			},function(ex){console.log(ex)});
		},
		//获取选中的collectionId
		getChecked:function(callback){
			for(var i=0;i<$scope.collection.collectionList.length;i++){
				if($scope.collection.collectionList[i].isChecked){
					callback(i);	
				}
			}
		},
		//删除选中的收藏
		delCollection:function(){
			$scope.collection.getChecked(
				function(index){
					console.log($scope.collection.collectionList[index].id);
					$scope.collection.index=index;
					$scope.collection.checkedList.push($scope.collection.collectionList[index].id);
				}
			),
			console.log($scope.collection.checkedList);
			collection.delCollectionByCollectionId($rootScope.account.memberId,$scope.collection.checkedList.join()).then(function(response){
				console.log(response);
				if(response.data.code == 1){
					//显示提示信息
					
					//从本地删除
					$scope.collection.collectionList.splice($scope.collection.index,1);
				}
			},function(ex){console.log(ex)});
		},
		//根据用户输入的进行查询
		getCollectionBySearch:function(){
			collection.getCollectionBySearch($rootScope.account.memberId,$scope.data.bookName).then(function(response){
				console.log(response);
				if(response.data.code == 1){
					$scope.collection.collectionList=response.data.result;
				}
			},function(ex){console.log(ex)});
		}
		
		
	}
	
	//获取所有收藏列表
	$scope.collection.getList();
})


/*************我的地址*********************/
.controller('AddressCtrl',function($scope,$ionicPopover,$timeout,region,location,localStorage,$rootScope,$state){
	//判断用户是否登录
	if(!$rootScope.account){
		$state.go('tab.login');
	}
	
	/*******************根据某个属性进行排序************************/
	$scope.sortByProperty=function(property){
		return function(a,b){
			var value1 = a[property];
			var value2 = a[property];
			if(value1>value2){
				return -1;
			}
			if(value1==value2){
				return 0;
			}
			return 1;
		};
	}
	/**********************************************************/
	
	//区域和地址
	$scope.region={
		regionList:null,
		defaultRegionName:null,
		defaultRegion:null,
		locationList:null,
		getRegion:function(id){
			region.listById(id).then(function(response){
				if(response.data.code == 1){
					$scope.region.regionList=response.data.result;
					//增加“全部”
					$scope.region.regionList.unshift({id:0,name:"全部"});
					//找到默认的区域id
					for(var i=0;i<$scope.region.regionList.length;i++){
						if($scope.region.regionList[i].isDefault==1){
							$scope.region.defaultRegion=$scope.region.regionList[i].id;
							$scope.region.defaultRegionName=$scope.region.regionList[i].name;
//							//上传到localStorage内
//							localStorage.set('defualtRegion',$scope.region.defaultRegion);
							break;
						}
					}
					//获取用户默认区域的地址
					$scope.region.getLocation($rootScope.account.memberId,$scope.region.defaultRegion);
				}
			},function(ex){console.log(ex)});
		},
		getLocation:function(memberId,regionId){
			location.listByRegionId(memberId,regionId).then(function(response){
				console.log(response);
				if(response.data.code == 1){
					$scope.region.locationList=response.data.result;
					//排序(方法二)
					//$scope.region.locationList.sort($scope.sortByProperty('isDefault'));
				}
				else if(response.data.code == 2){
					$scope.region.locationList=null;
				}
			},function(ex){console.log(ex)});
		},
		setDefaultLocation:function(memberId,loationId){
			location.setDefaultLocation(memberId,loationId).then(function(response){
				console.log(response);
				//设置成功
				if(response.data.code == 1){
					//弹出提示框
							
				}
			},function(ex){console.log(ex)});
		}
	}
	
	//设置默认地址
	$scope.chooseDefaultLocation=function(item){
		console.log(item);
		//调用方法
		$scope.region.setDefaultLocation($rootScope.account.memberId,item.id);
		//清除原来的默认地址
		for(var i=0;i<$scope.region.locationList.length;i++){
			$scope.region.locationList[i].isDefault=0;
		}
		console.log($scope.region.locationList);
		//设置默认地址
		item.isDefault=1;
		//排序到第一位(方法二) 
		//$scope.region.locationList.sort($scope.sortByProperty('isDefault'));
	}
	
	
 	//点击区域的弹出框
  	$ionicPopover.fromTemplateUrl('directive/my-popover.html', {
   	 scope: $scope
  	}).then(function(popover) {
    	$scope.popover = popover;
    	//获取所有区域
    	$scope.region.getRegion($rootScope.account.memberId);
    	
    	//点击对应的区域获取不同的自提点
    	$scope.chooseRegion=function(item){
    		//设置标题栏的区域名称为当前选择的
    		$scope.region.defaultRegionName=item.name;
			//调用方法获取自提点的位置
			$scope.region.getLocation($rootScope.account.memberId,item.id);	
			//关闭弹出框
			$scope.closePopover();
    		
    	}
  	});
 	$scope.openPopover = function($event) {
   		$scope.popover.show($event);
  	};			
  	$scope.closePopover = function() {
    	$scope.popover.hide();
 	 };
 	 // 清除浮动框
	$scope.$on('$destroy', function() {
	    $scope.popover.remove();
	});
	
})

/**************用户详情的控制器************************/
.controller('UserDetailCtrl',function($scope,$rootScope,localStorage,$state,account,$ionicActionSheet){
	//判断用户是否登录
	if(!$rootScope.account){
		$state.go('tab.login');
	}
	
	//点击修改手机号
	$scope.modifyPhone=function(){
		$state.go('tab.modifyPhone');
	}
	
	//点击修改密码
	$scope.modifyPwd=function(){
		$state.go('tab.modifyPwd');
	}
	
	
	
	$scope.user={
		newPhone:null,
		newPwd:null,
		detailInfo:localStorage.get('userDetail')
	}
	
	
	//点击头像，弹出上传头像
	$scope.show=function(){
    	var hideSheet = $ionicActionSheet.show({
	        buttons: [
		        { text: '拍照上传' },
		        {text:'本地上传'}
	        ],
	      	cancelText: '取消',
	      	cancel: function() {
	           // add cancel code..
	         },
	     	 buttonClicked: function(index) {
	        	return true;
	      	}
    	  });
 	
	}
})

/***********************修改密码*********************************/
.controller('modifyPwdCtrl',function($scope,$ionicHistory,localStorage,$rootScope,$state,account){
	if(!$rootScope.account){
		$state.go('tab.login');
	}
	
	$scope.user={
		pwd:'',
		newPwd:'',
		newPwdConfirm:'',
		code:null,
		errorMessage:null,
		modifyPwd:function(){
			account.modifyPwd($rootScope.account.id,$scope.user.pwd,$scope.user.newPwd).then(function(response){
				console.log(response);
				//获取成功
				$scope.user.code=response.data.code;
				if(response.data.code == 1){
					//显示提示信息
					
					//跳转回原来的页面
					$ionicHistory.goBack();
				}
				else if(response.data.code == 2){
					$scope.user.errorMessage="修改失败，请检查密码是否输入正确"
				}
			},function(ex){console.log(ex)});
		}
		
	}
	
	//修改密码
	$scope.modifyPwd=function(){
		$scope.user.modifyPwd();
	}
	
})

/******************修改手机号*****************************/
.controller('modifyPhoneCtrl',function($scope,$rootScope,account,$state,$ionicHistory,$interval){
	//判断用户是否登录
	if(!$rootScope.account){
		$state.go('tab.login');
	}
	
	$scope.user={
		phone:'',
		code:false,
		inputCode:null,
		second:60,
		message:"获取验证码",
		modifyPhone:function(){
			account.modifyPhone($rootScope.account.memberId,$scope.user.phone).then(function(response){
				$scope.user.responseCode=response.data.code;
				//修改成功
				if(response.data.code == 1){
					//显示提示信息
					
				}
			},function(ex){console.log(ex)});
		},
		getCode:function(){
			//获取验证码
			$scope.user.code=true;
			
			//显示60秒倒计时
			var timer=$interval(function(){
				if($scope.user.second<=0){
					$interval.cancel(timer);
					
					$scope.user.second = 60;  
		            $scope.user.message = "重发验证码"; 
		            $scope.user.code=false;
		          }
				else{
		            $scope.user.message = $scope.user.second + "秒后可重发";  
		            $scope.user.second--;  
				}
			},1000)
		}
	}
	
	//修改手机号
	$scope.modifyPhone=function(){
		$scope.user.modifyPhone();
	}
	//获取验证码
	$scope.getCode=function(){
		$scope.user.getCode();	
	}
	
	//点击x删除填写的所有信息
	$scope.deletePhone=function(){
		$scope.user.phone = '';
	}
	$scope.deleteCode=function(){
		$scope.user.inputCode='';
	}
	
	
})
