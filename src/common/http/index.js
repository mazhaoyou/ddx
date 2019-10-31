/* 该文件已全局引入，无需每个界面在引入 */
import http from './config';

const test = (data) => {

	http.interceptor.response = (response) => {
		console.log('个性化response....')
		//判断返回状态 执行相应操作
		return response;
	}
	return http.request({
		baseUrl: 'https://unidemo.dcloud.net.cn/',
		url: 'ajax/echo/text?name=uni-app',
		dataType: 'text',
		data,
	})
}


/* 
	个人头像上传 
	作者：wux
*/
const setHeadPortrait = http.config.baseUrl + '/user/setHeadPortrait';

/* 
	评论图片上传 
	作者：wux
*/
const addOrderEvaluateImg = http.config.baseUrl + '/order/addOrderEvaluateImg';

/* 
	获取信息(相关规则)
	作者：wux
	informationType：客服电话0， 竞拍规则1， 福豆规则2， 福利说明3， 抽奖规则4， 邀请规则5
*/
const getInformation = (data) => {
	return http.request({
		url: '/user/getInformation',
		method: 'post',
		data,
	})
}

/* 
	判断新老用户
	作者：wux
	phone:手机号
	blackBox：同盾返回的black_box
 */

const judgeNewOldUser = (data) => {
	return http.request({
		url: '/user/decideUserType',
		method: 'post',
		data,
	})
}

/* 
	获取验证码 
	作者：wux
	phone: 手机号
	yidunCode: 滑块返回的数据二次验证使用
	codeType: 1是短信，2是语音
	functionType: 0注册短信，1登录短信，2忘记密码3重置密码
*/

const getVerificationCode = (data) => {
	return http.request({
		url: '/user/getVerificationCode',
		method: 'post',
		data,
	})
}

/* 
	设置密码
	作者：wux
	token: 用户标识
	newPassword: 新密码
 */

const setPassword = (data) => {
	return http.request({
		url: '/user/setPassword',
		method: 'post',
		data,
	})
}

/* 
	完善资料
	编辑资料 
	作者：wux
	token
	
*/
const checkMate = (data) => {
	return http.request({
		url: '/user/checkMate',
		method: 'post',
		data,
	})
}

/* 
	短信登录
	作者：wux
	phone: 手机号
	verificationCode: 验证码
 */

const smsLogin = (data) => {
	return http.request({
		url: '/user/loginBySMS',
		method: 'post',
		data,
	})
}


/* 
	密码登录
	作者：wux
	phone: 手机号
	password: 密码
 */

const passwordLogin = (data) => {
	return http.request({
		url: '/user/loginByPassword',
		method: 'post',
		data,
	})
}


/* 
	忘记密码、修改密码
	作者：wux
	phone: 手机号
	verificationCode: 验证码
	newPassword: 新密码
 */

const modifyPassword = (data) => {
	return http.request({
		url: '/user/modifyPassword',
		method: 'post',
		data,
	})
}

/* 
	获取微信绑定状态 
	作者：wux
	phone：手机号
	openid：微信登陆open_id
*/
const getWechatBiddingStatus = (data) => {
	return http.request({
		url: '/user/getWechatBiddingStatus',
		method: 'post',
		data,
	})
}

/* 
	微信绑定
	作者：wux
	token
	openid
*/
const bindingWechat = (data) => {
	return http.request({
		url: '/user/bindingWechat',
		method: 'post',
		data,
	})
}

/* 
	设置页面获取手机号及微信绑定状态(目前没有用到)
	作者：wux
	token
*/
const getSetPage = (data) => {
	return http.request({
		url: '/user/getSetPage',
		method: 'post',
		data,
	})
}

/* 
	退出登录
	作者：wux
	token
*/
const logout = (data) => {
	return http.request({
		url: '/user/logout',
		method: 'post',
		data,
	})
}

/* 
	设置昵称
	作者：wux
	token
	nickname
	type:保存类型 0匹配敏感词不进行修改 1正式修改
*/

const setNickname = (data) => {
	return http.request({
		url: '/user/setNickname',
		method: 'post',
		data,
	})
}

/* 
	设置性别
	作者：wux
	token
	gender
*/
const setGender = (data) => {
	return http.request({
		url: '/user/setGender',
		method: 'post',
		data,
	})
}

/* 
	设置出生日期
	作者：wux
	token
	birthDate
*/
const setBirthDate = (data) => {
	return http.request({
		url: '/user/setBirthDate',
		method: 'post',
		data,
	})
}

/* 
	请求实名认证 
	作者：wux
	type: 验证方式0为phone，1为token
	name: 身份证姓名
	id:	身份证号码
	args: 验证内容
*/
const validatePIN = (data) => {
	return http.request({
		url: '/user/validatePIN',
		method: 'post',
		data,
	})
}

/* 
	验签实名认证 
	作者：wux
	会员编号：userId
	认证签名：ivSign
	
*/
const validateIVSIGN = (data) => {
	return http.request({
		url: '/user/validateIVSIGN',
		method: 'post',
		data,
	})
}

/* 
获得轮播图
img_type：1首页顶层轮播图 2买豆 3 我的 4帮助 5首页活动轮播图	
作者： mazy
*/
const banner = (data) => {
	return http.request({
		url: '/activity/getCarouselImg',
		method: 'post',
		data,
	})
}

/* 
	确认订单
	author：xueyf
	token： 用户标识
	orderId： 订单编号
	orderStatus： 订单状态 待付款0、待出货1、待收货2、待评价3、已完成4、已取消5
*/
const confirmOrder = (data) => {
	return http.request({
		url: '/order/confirmOrder',
		method: 'post',
		data,
	})
}

//获取消息中心页面信息
const messageCenter = (data) => {
	return http.request({
		url: '/user/getMessageCenterInfo',
		method: 'post',
		data,
	})
}

/* 
	获取邀请信息
	作者：wux
	token
*/
const getInviteInfo = (data) => {
	return http.request({
		url: '/welfare/user/getInviteInfo',
		method: 'post',
		data,
	})
}

/* 
	获取邀请记录列表 
	作者：wux
	token
*/
const getInviteList = (data) => {
	return http.request({
		url: '/welfare/user/getInviteList',
		method: 'post',
		data,
	})
}

/* 
	领取邀请奖励 
	作者：wux
	token
	userId
*/
const receiveInviteAward = (data) => {
	return http.request({
		url: '/welfare/user/receiveInviteAward',
		method: 'post',
		data,
	})
}

/* 
	领取礼包
	token: 用户标识 必须
	giftId: 礼包id 必须
	giftType: 礼包类型，1：周礼包，2月礼包，3达成礼包 必须
*/
const receiveGift = (data) => {
	return http.request({
		url: '/welfare/user/receiveGift',
		method: 'post',
		data,
	})
}

//获取好运榜列表
const getGoodLuckList = (data) => {
	return http.request({
		url: '/activity/getGoodLuckList',
		method: 'post',
		data,
	})
}

/* 
*荣誉成就页面
token：必须 用户标识
*/
const honor = (data) => {
	return http.request({
		url: '/welfare/user/getHonorAchievementPage',
		method: 'post',
		data,
	})
}

/* 
*获取礼包信息 等级权益
token：必须 用户标识
*/
const getGiftInfo = (data) => {
	return http.request({
		url: '/welfare/user/getGiftInfo',
		method: 'post',
		data,
	})
}

/* 
*获取荣誉称号列表
token：必须 用户标识
*/
const honorList = (data) => {
	return http.request({
		url: '/welfare/user/getHonoraryTitleList',
		method: 'post',
		data,
	})
}

/* 
*设置荣誉称号
token：必须 用户标识
titleId: 必须 称号id
*/
const setHonoraryTitle = (data) => {
	return http.request({
		url: '/welfare/user/setHonoraryTitle',
		method: 'post',
		data,
	})
}

/* 
*订单物流信息 
token：必须 用户标识
orderId: 必须 订单编号
*/
const getLogistics = (data) => {
	return http.request({
		url: '/order/getLogistics',
		method: 'post',
		data,
	})
}


/*
获取我的背包页面
token：必须 用户标识
*/
const getMyBackpackPage = (data) => {
	return http.request({
		url: '/welfare/user/getMyBackpackPage',
		method: 'post',
		data,
	})
}

// 获取背包记录列表
const getBackpackLogList = (data) => {
	return http.request({
		url: '/welfare/user/getBackpackLogList',
		method: 'post',
		data,
	})
}

// 经验值记录
const expList = (data) => {
	return http.request({
		url: '/welfare/user/getExperienceSourceList',
		method: 'post',
		data,
	})
}

/*
获取福利社列表
token：必须 用户标识
taskId：必须 任务类型 0 单次任务 1周期任务 2新手任务
*/
const getWelfareClubList = (data) => {
	return http.request({
		url: '/welfare/user/getWelfareClubList',
		method: 'post',
		data,
	})
}

/*
领取奖励
token：必须 用户标识
type：必须 任务主键
*/
const receiveAward = (data) => {
	return http.request({
		url: '/welfare/user/receiveAward',
		method: 'post',
		data,
	})
}

/*
领取任务礼包
token：必须 用户标识
taskId：必须 任务ID
*/
const receiveTaskGift = (data) => {
	return http.request({
		url: '/welfare/user/receiveTaskGift',
		method: 'post',
		data,
	})
}

/*
根据礼包id获取礼包详情
token：必须 用户标识
giftId：必须 礼包id
*/
const getGiftInfoByGiftId = (data) => {
	return http.request({
		url: '/welfare/user/getGiftInfoByGiftId',
		method: 'post',
		data,
	})
}


/* 
获得福豆信息
token：必须
作者 mazy
*/
const getBeanInfo = (data) => {
	return http.request({
		url: '/account/getAccountBalance',
		method: 'post',
		data,
	})
}

/* 
获取充值福豆页
token：用户表示 必须
*/
const getRechargePage = (data) => {
	return http.request({
		url: '/account/getRechargePage',
		method: 'post',
		data,
	})
}

/* 
计算活动所得福豆数
token：用户表示 必须
beanNum: 福豆数量 必须
*/
const calculateBeans = (data) => {
	return http.request({
		url: '/account/calculateBeans',
		method: 'post',
		data,
	})
}

/* 
获取签到页面
token：用户表示 必须
*/
const getSigninPage = (data) => {
	return http.request({
		url: '/welfare/user/getSigninPage',
		method: 'post',
		data,
	})
}

/* 
签到
token：用户表示 必须
index：签到顺序 0为当天 1-7为补签的星期几 必须
*/
const getSignin = (data) => {
	return http.request({
		url: '/welfare/user/signin',
		method: 'post',
		data,
	})
}

/* 
获取福豆交易明细列表
token：用户表示 必须
start：查询起始标识 默认传0 必须
len： 查询数量 默认传10 必须
type： 变动类型  1获取 0消费 2购买福豆 必须
*/
const getBeanDetailList = (data) => {
	return http.request({
		url: '/account/getBeanDetailList',
		method: 'post',
		data,
	})
}

/* 
	获取正在竞拍|即将开始|最近成交
	author：xueyf
	token： 用户标识
	activityType：活动类型 0普通场全部 1新手场全部
	start： 查询起始标识
	len： 查询数量
	
*/
/* url:
	getStartImmediatelyList: 即将开始
	getSnappingUpList: 正在进行
	getRecentDealList： 最近成交 */
const getBiddingList = (data, url) => {
	return http.request({
		method: 'post',
		url,
		data,
	})
}

/* 
	获取我的页面信息
	author：xueyf
	token： 用户标识
 */
const getMyInfoList = (data) => {
	return http.request({
		url: '/user/getMine',
		method: 'post',
		data,
	})
}

/* 
	获取我的竞拍列表 
	author：xueyf
	token： 用户标识
	activityType：活动类型 0正在拍 1已拍中 2未拍中 3已委托 4已关注
*/
const getActivityList = (data) => {
	return http.request({
		url: '/activity/getMyActivityList',
		method: 'post',
		data,
	})
}

/* 
	获取我的订单列表
	author：xueyf
	token： 用户标识
	orderType：订单类型 待付款0， 待出货1 ，待收货2 ，待评价3， 全部4
	start： 查询起始标识
	len： 查询数量
*/
const getOrderList = (data) => {
	return http.request({
		url: '/order/getOrderList',
		method: 'post',
		data,
	})
}

/* 
	设置关注状态
	author：xueyf
	token： 用户标识
	activityId：活动id
*/
const setFocusState = (data) => {
	return http.request({
		url: '/activity/setActivityAttention',
		method: 'post',
		data,
	})
}

/* 
作者 mazy
获得最近成交列表
token：非必须
activity_type：活动类型 0普通 1新手场  其他类型传竞购导航标签类型	
start：起始
len：查询条数
*/

const getRecentDealList = (data) => {
	return http.request({
		url: '/activity/getRecentDealList',
		method: 'post',
		data,
	})
}
/*
 *mazy
 *获得推荐活动列表
 * token：非必须
 */

const getRecommendList = (data) => {
	return http.request({
		url: '/activity/getRecommendList',
		method: 'post',
		data,
	})
}

/* 
	获取评论列表
	作者：wux
	activity_id活动id	
	start	查询起始标识	
	len 查询数量
*/

const getEvaluateList = (data) => {
	return http.request({
		url: '/activity/getEvaluateList',
		method: 'post',
		data
	})
}

/* 
	提交订单评论
	token: 用户标识 必须
	orderId: 订单编号 必须
	mark: 评分 必须
	comment: 评论内容
	imgList: [
		{
			"imgUrl": "" // 评论图片url  必须
		}
	] 评论图片列表 必须
*/

const addOrderEvaluate = (data) => {
	return http.request({
		url: '/order/addOrderEvaluate',
		method: 'post',
		data
	})
}

/* 
	获取订单详情
	token: 用户标识 必须
	orderId: 订单编号 必须
*/

const getOrderInfo = (data) => {
	return http.request({
		url: '/order/getOrderInfo',
		method: 'post',
		data
	})
}


/* 
	查询抽奖奖品列表
	作者：wux
*/

const getLotteryGoodsList = (data) => {
	return http.request({
		url: '/h5/getLotteryGoodsList',
		method: 'post',
		data
	})
}

/* 
	点击抽奖按钮抽奖 
	作者：wux
*/

const lottery = (data) => {
	return http.request({
		url: '/h5/lottery',
		method: 'post',
		data
	})
}

/* 
	查询中奖名单
	作者：wux 
*/
const getHappyNewsList = (data) => {
	return http.request({
		url: '/h5/getHappyNewsList',
		method: 'post',
		data
	})
}

/* 
	查询我的奖品
	作者：wux
*/

const getMyPrizeList = (data) => {
	return http.request({
		url: '/h5/getMyPrizeList',
		method: 'post',
		data
	})
}

/* 
	获取银豆明细列表
	token：非必须 用户标识
*/

const getSilverBeanDetailList = (data) => {
	return http.request({
		url: '/account/getSilverBeanDetailList',
		method: 'post',
		data
	})
}

/* 
	设置订单状态（确认收货、取消订单）
	token：非必须 用户标识
	orderId: 必须 订单编号
	orderStatus: 必须 订单状态 待付款0、待出货1、待收货2、待评价3、已完成4、已取消5
*/

const setOrderStatus = (data) => {
	return http.request({
		url: '/order/setOrderStatus',
		method: 'post',
		data
	})
}

/*
获得帮助列表
*/
const getHelpList = (data) => {
	return http.request({
		url: '/user/getHelpList',
		method: 'post',
		data,
	})
}

/* 
	获取站内通知消息列表 
	作者：wux
	token
	start
	len
*/
const getSystemMessageList = (data) => {
	return http.request({
		url: '/user/getSystemMessageList',
		method: 'post',
		data
	})
}

/* 
	获取站内通知消息详情 
	作者：wux
	messageNo
	id
*/

const getSystemMessageDetail = (data) => {
	return http.request({
		url: '/user/getSystemMessageDetail',
		method: 'post',
		data
	})
}
/* 获得往期竞拍详情 
 *@mazy
 * activityId 活动id
 * snapshotId 快照id
 * token 非必需
 */
const getAuctionDetailsed = (data) => {
	return http.request({
		url: '/activity/getBidSnapshotInfo',
		method: 'post',
		data
	})
}
/* 往期成交获得最近10个竞购人*/
const getForwardBidderList = (data) => {
	return http.request({
		url: '/activity/getForwardBidderList',
		method: 'post',
		data
	})
}
/* 获得竞拍详情中的往期成交 */
const getForwardList = (data) => {
	return http.request({
		url: '/activity/getForwardList',
		method: 'post',
		data
	})
}
/* 
	获取收获地址列表
	作者：wux
	token
*/
const getReceiveGoodsInfoList = (data) => {
	return http.request({
		url: '/user/getReceiveGoodsInfoList',
		method: 'post',
		data
	})
}

/* 
	新增收货地址信息
	作者：wux
	token: 用户标识
	receiverName: 收件人姓名
	receiverPhone: 收件人手机号
	pctAddr: 省市县地址信息
	pctAddrValue: 省市县编码
	detailAddr: 详细地址
	isDefault: 是否默认 0否 1是
*/
const addSingleReceiveGoodsInfo = (data) => {
	return http.request({
		url: '/user/addSingleReceiveGoodsInfo',
		method: 'post',
		data
	})
}

/* 
	删除收货地址信息
	作者：wux
	addressId： 收货信息编号
	token： 用户标识
	isDefault： 是否默认
*/
const deleteSingleReceiveGoodsInfo = (data) => {
	return http.request({
		url: '/user/deleteSingleReceiveGoodsInfo',
		method: 'post',
		data
	})
}

/* 
	设置默认收货信息状态
	作者：wux
	addressId 收货信息编号
	token 用户标识
*/
const setDefaultReceiveGoodsInfo = (data) => {
	return http.request({
		url: '/user/setDefaultReceiveGoodsInfo',
		method: 'post',
		data
	})
}
/* 
	获取已成交商品详情图片
	@：mazy
	token 非必须
	snapshotId 快照id
*/
const getGoodsDetailsImgList = (data) => {
	return http.request({
		url: '/activity/getForwardGoodsDetailsImgList',
		method: 'post',
		data
	})
}

/* 
	获取即将开始、正在商品详情
	@：mazy
	token 非必须
	snapshotId 快照id
*/
const getActivityDetails = (data) => {
	return http.request({
		url: '/activity/getActivityDetails',
		method: 'post',
		data
	})
}



/* 
	获取即将开始、正在商品详情图片
	@：mazy
	token 非必须
	goodsNo 商品编号	
*/
const getGoodsDetailsImg = (data) => {
	return http.request({
		url: '/activity/getGoodsDetailsImgList',
		method: 'post',
		data
	})
}

/* 
	获取竞拍页导航栏目
	author：xueyf
	token 用户标识
*/
const getBiddingTab = (data) => {
	return http.request({
		url: '/user/getNavigationLabel',
		method: 'post',
		data
	})
}

/* 
 *@mazy获取当前的竞拍信息
 * 传值：
 *activityId：活动id
 * currentPrice：当前价
 * token：用户token
 */

const getBiddingInfo = (data) => {
	return http.request({
		url: '/auction/getActivityAuction',
		method: 'post',
		data
	})
}
/*@mazy 
 *一点豆竞拍 
 * token：用户token
 * activityId：活动id
 * eachIncrease：单次消耗福豆数	
 *type
 */
const auctionProcess = (data) => {
	return http.request({
		url: '/auction/auctionProcess',
		method: 'post',
		data
	})
}

/* 
	委托竞拍
	author：xueyf
	token：用户标识
	activityId：活动id
	entrustTimes：委托竞购次数
	type：请求步骤类型
*/
const entrustAuction = (data) => {
	return http.request({
		url: '/auction/entrustAuction',
		method: 'post',
		data
	})
}

/* 
	取消委托
	author：xueyf
	token：用户标识
	activityId：活动id
*/
const cancelDelegate = (data) => {
	return http.request({
		url: '/auction/cancelEntrustAuction',
		method: 'post',
		data
	})
}

/* 
	追加委托
	author：xueyf
	token：用户标识
	activityId：活动id
	entrustTimes：委托竞购次数
	type：请求步骤类型
*/
const additionalCommissioned = (data) => {
	return http.request({
		url: '/auction/appendEntrustAuction',
		method: 'post',
		data
	})
}

/* 
	删除订单
	author：xueyf
	token：用户标识
	orderId：订单id
*/
const setOrderDelStatus = (data) => {
	return http.request({
		url: '/order/setOrderDelStatus',
		method: 'post',
		data
	})
}
/* @mazy
 *app升级
 */
const appUpdate = (data) => {
	return http.request({
		url: '/user/appUpdate',
		method: 'post',
		data
	})
}


export default {
	test,
	setHeadPortrait,
	addOrderEvaluateImg,
	getInformation,
	banner,
	confirmOrder,
	honor,
	expList,
	getBeanInfo,
	getRecentDealList,
	messageCenter,
	getInviteInfo,
	getInviteList,
	receiveInviteAward,
	getGoodLuckList,
	getBiddingList,
	getMyInfoList,
	getActivityList,
	getOrderList,
	setFocusState,
	getBackpackLogList,
	getEvaluateList,
	getRecommendList,
	getWelfareClubList,
	receiveAward,
	judgeNewOldUser,
	getMyBackpackPage,
	getVerificationCode,
	setPassword,
	passwordLogin,
	checkMate,
	smsLogin,
	modifyPassword,
	getWechatBiddingStatus,
	bindingWechat,
	getSetPage,
	logout,
	setNickname,
	setGender,
	setBirthDate,
	validatePIN,
	validateIVSIGN,
	getLotteryGoodsList,
	lottery,
	getHappyNewsList,
	getMyPrizeList,
	honorList,
	getSilverBeanDetailList,
	getHelpList,
	getRechargePage,
	getBeanDetailList,
	calculateBeans,
	getSigninPage,
	getSystemMessageList,
	getSystemMessageDetail,
	getAuctionDetailsed,
	addOrderEvaluate,
	getForwardBidderList,
	getForwardList,
	getForwardBidderList,
	getForwardBidderList,
	getReceiveGoodsInfoList,
	addSingleReceiveGoodsInfo,
	deleteSingleReceiveGoodsInfo,
	setDefaultReceiveGoodsInfo,
	getGoodsDetailsImgList,
	getSignin,
	getActivityDetails,
	receiveGift,
	getGoodsDetailsImg,
	getBiddingTab,
	getLogistics,
	getBiddingInfo,
	setOrderStatus,
	auctionProcess,
	getOrderInfo,
	entrustAuction,
	cancelDelegate,
	additionalCommissioned,
	getGiftInfo,
	setOrderDelStatus,
	getGiftInfoByGiftId,
	appUpdate,
	receiveTaskGift,
	setHonoraryTitle
}
