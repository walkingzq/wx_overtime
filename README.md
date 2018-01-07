加班信息统计--微信小程序
===


基本说明
---
		# 最新版本：v1.0.4
		# 功能说明：
		本微信小程序提供了加班记录的增删查改功能。
		
		# 使用说明：
		## 体验本微信小程序的完整功能需要:
		### 1.授权：
		点击首页的“点击授权”按钮-->“允许”进行授权；
		### 2.绑定姓名：
		点击首页的“请绑定姓名”文本区域，进行姓名绑定。
		备注：一个微信号只能绑定一个姓名。
		
		# 页面及功能详细说明：
		## 1.首页
		包括授权区域和绑定姓名区域
		如果没有授权，则显示“点击授权”按钮；否则，显示用户微信头像。
		如果没有绑定姓名，则显示“请绑定姓名”文本提示。否则，显示用户绑定姓名。
		## 2.个人页面
		点击“我的”可以进入个人页面
		个人页面包括一个日历和两个按钮。其中，日历默认显示月份与手机本地时间一致，日历中红色的日期代表该日期有加班记录。
		## 3.信息提交页面
		在个人页面点击任意一个绿色日期，即可进入信息提交界面。
		本页面提供加班记录编辑及提交功能。
		备注：一个微信号一个日期最多只能提交一条加班记录。
		## 4.加班记录日详情界面
		在个人页面点击任意一个红色日期，即可进入加班记录日详情界面。
		本界面提供某个具体日期的加班记录的修改和删除操作。			
		## 5.加班记录月总览界面
		在个人界面点击“当月记录总览”，即可进入加班记录月总览界面。
		本界面提供加班记录月总览功能，点击某个具体的加班记录即可进入该加班记录的日详情界面。


		
v1.0.4更新说明
---
		1.删除了form界面的“清空”按钮
		2.增加了从服务器拉取本微信号提交的加班数据并存入本地缓存的功能：
			点击“我的”-->“加班记录同步”按钮即可拉取服务器数据库数据至本地
			备注：按月拉取，拉取月份为点击“加班记录同步”按钮时“我的”页面显示的月份
		3.增加了对提交记录的月总览视图：
			点击“我的”-->“当月记录总览”按钮即可浏览当前月份本微信号提交的加班记录
			备注：当前月份是指点击“当月记录浏览”按钮时“我的”页面显示的月份
		4.增加了加班记录删除操作：
			点击“我的”页面上红色的日期，即可进入单次记录详情界面。在该界面，点击“删除”按钮即可删除当前记录。
			
		
v1.0.3更新说明
---
		增加了微信号与姓名绑定功能
		备注：支持姓名更改操作		

		
初始化说明
---
		1.提供了基本的提交界面、详情界面，可以提交加班记录到服务器；
		2.可以查看提交的加班记录，但是目前没有跟服务器同步，只显示本地缓存中的加班记录。
		说明：如果删除了本地缓存，则在本地无法看到提交的历史加班记录。





	


