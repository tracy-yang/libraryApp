angular.module('starter.services', [])

.constant('rootUrl',"http://101.200.58.3:9090/library/")


//图书的服务
.service('book',['rootUrl','$http',function(rootUrl,$http){	
		this.recommend=function(){
			return $http.get(rootUrl+'recommend?method=getlist');
		}
		//获取推荐第一页的信息
		this.recommendPageOne=function(){
			return $http.get(rootUrl+'recommend?method=getlistandbookinfos');
		}
		//通过图书的id获取图书信息
		this.getBookByIdAndMemberId=function(bookInfoId,memberId){
			console.log(bookInfoId);
			console.log(memberId);
			return $http.get(rootUrl+'bookinfos?method=getbookinfobyidandmid&bookinfoid='+bookInfoId+'&memberid='+memberId);
		}
		//通过图书id获取图书信息
		this.getBookById=function(bookInfoId){
			return $http.get(rootUrl+'bookinfos?method=getbookinfobyid&bookinfoid='+bookInfoId);
		}
}])

//借书架的服务
.service('cart',['rootUrl','$http',function(rootUrl,$http){
	//获取借书架的列表
	this.list=function(memberId){
		return $http.get(rootUrl+'carts?method=list&memberid='+memberId);
	}
	//删除指定图书信息
	this.del=function(memberId,cartId){
		return $http.get(rootUrl+'carts?method=delete&memberid='+memberId+'&cartid='+cartId);
	}
	//添加到购物车
	this.addCart=function(memberId,bookInfoId){
		return $http.get(rootUrl+'carts?method=insert&memberid='+memberId+'&bookinfoid='+bookInfoId);
	}
	//下单
	this.order=function(memberId,bookInfoId){
		return $http.get(rootUrl+'records?method=order&memberid='+memberId+'&bookinfoid='+bookInfoId);
	}
}])
//分类的服务
.service('category',['$http','rootUrl',function($http,rootUrl){
	this.list=function(){
		return $http.get(rootUrl+'/categories?method=list');
	};
	this.listByCategory=function(cateId,index,number){
		return $http.get(rootUrl+'bookinfos?method=getlistbycid&cateid='+cateId+'&index='+index+'&number='+number);
	}
}])

//账户的服务
.service('account',['rootUrl','$http',function(rootUrl,$http){
	//登录
	this.login=function(phone,pwd){
		return $http.get(rootUrl+'card?method=login&phone='+phone+'&password='+pwd);
	}
	//获取用户详细信息
	this.getUserDetailInfo=function(memberId){
		return $http.get(rootUrl+'member?method=getmemberbymemberid&memberid='+memberId);
	}
	//修改密码
	this.modifyPwd=function(cardId,pwd,newPwd){
		return $http.get(rootUrl+'card?method=modifypassword&cardid='+cardId+'&password='+pwd+'&newpassword='+newPwd);
	}
	//修改手机号
	this.modifyPhone=function(memberId,phone){
		console.log(memberId);
		console.log(phone);
		return $http.get(rootUrl+'member?method=modifyphone&memberid='+memberId+'&phone='+phone);
	}
}])

//收藏的服务
.service('collection',['rootUrl','$http',function(rootUrl,$http){
	//获取所有收藏
	this.list=function(memberId){
		return $http.get(rootUrl+'collections?method=list&memberid='+memberId);
	}
	//添加收藏
	this.addCollection=function(memberId,bookInfoId){
		return $http.get(rootUrl+'collections?method=insert&memberid='+memberId+'&bookinfoid='+bookInfoId);
	}
	//获取指定索引的收藏
	this.getCollectionByIndex=function(memberId,index,number){
		return $http.get(rootUrl+'collections?method=limitedlist&memberid='+memberId+'&index='+Index+'&number='+number);
	}
	//获取总分页
	this.getPageCount=function(memberId,number){
		return $http.get(rootUrl+'collections?method=pages&memberid='+memberId+'&number='+number);
	}
	//获取搜索的所有收藏
	this.getCollectionBySearch=function(memberId,bookName){
		return $http.get(rootUrl+'collections?method=search&memberid='+memberId+'&bookname='+bookName);
	}
	//删除指定收藏
	this.delCollectionByCollectionId=function(memberId,collectionId){
		return $http.get(rootUrl+'collections?method=delete&memberid='+memberId+'&collectionid='+collectionId);
	}
}])

//localStorage的服务
.service('localStorage',function($window,$state){
	this.set=function(key,value){
		if(!key || !value){
				return null;
		}
		$window.localStorage.setItem(key,JSON.stringify(value));
	}
	
	this.get=function(key){
		if(!key){
			return null; 
		}
		return JSON.parse($window.localStorage.getItem(key));
	}
	
	this.remove=function(key){
		if(!key){
			return null;
		}
		return $window.localStorage.removeItem(key);
	}
	
	//点击功能前先判断用户是否登录
	this.check=function(loginAddress,toAddress,key,params){
		if(!loginAddress || !toAddress){
			return ;
		}
		if(this.get(key)){
			$state.go(toAddress,{params:this.get(key).memberId});
		}
		else{
			$state.go(loginAddress);
		}
	}
})


//区域管理
.service('region',function($http,rootUrl){
	this.listById=function(memberId){
		return $http.get(rootUrl+'regions?method=getlistbymemberid&memberid='+memberId);
	}
})


//自提点管理
.service('location',function($http,rootUrl){
	this.listByRegionId=function(memberId,regionId){
		return $http.get(rootUrl+'locations?method=getlistbymidandrid&memberid='+memberId+'&regionid='+regionId);
	}
	this.setDefaultLocation=function(memberId,locationId){
		return $http.get(rootUrl+'member?method=modifydefaultaddress&memberid='+memberId+'&locationid='+locationId);
	}
})

