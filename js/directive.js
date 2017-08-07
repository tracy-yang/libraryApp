!function(){
	angular.module("myDirective",[])
	//搜索标题
	.directive("navForSearch",function(){
		return{
			restrict:'EA',
			replace:true,
			templateUrl:'directive/navForSearch.html',
			scope:{
				
			}
		}
	})
	
	//修改密码、手机号、邮箱
	.directive("editUserDetailInfo",function(){
		return{
			restrict:'EA',
			replace:true,
			templateUrl:'directive/editDetailInfoDirective.html',
			scope:{
				editInfo:'='
			}
		}
	})
}()
