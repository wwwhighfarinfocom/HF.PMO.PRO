<template>
	<view id="main">
		<view id="logostyle">
			<image src="/static/Img/logo.jpg"></image>
		</view>
		<view id="optionsstyle">
			<uni-grid :column="3" :square="false" @change="change">
				<uni-grid-item v-for="(item ,index) in list" :index="index" :key="index">
					<view class="grid-item-box">
						<text class="text">{{item.text}}</text>
						<view v-if="item.badge" class="grid-dot">
							<uni-badge :text="item.badge" :type="item.type" />
						</view>
					</view>
				</uni-grid-item>
			</uni-grid>
		</view>
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				dynamicList: [],
				list: [{
						text: '我的任务',
						badge: '0',
						type: "primary"
					},
					{
						text: '我的审批',
						badge: '0',
						type: "success"
					},
					{
						text: '我的通知',
						badge: '0',
						type: "warning"
					},
					{
						text: '我的项目',
						badge: '0',
						type: "primary"
					},
					{
						text: '我的问题',
						badge: '0',
						type: "error"
					},
					{
						text: '我的风险',
						badge: '0',
						type: "error"
					},
					{
						text: '我的缺陷',
						badge: '0',
						type: "error"
					},
					{
						text: '我的会议',
						badge: '0',
						type: "primary"
					},
					{
						text: '我的团队',
						badge: '0',
						type: "primary"
					}
				]
			}
		},
		onReady() {

		},
		onBackPress(e) {
			// 上一页
			return true;
		},
		mounted() {
			// 隐藏导航左侧退出图标 /* H5隐藏 */
			// #ifdef H5
			var titleBtn1 = document.getElementsByClassName('uni-page-head-btn')[0]
			var titleBtn2 = document.getElementsByClassName('uni-page-head-btn')[1]
			titleBtn1.style.display = 'none';
			titleBtn2.style.margin = 'auto';
			titleBtn2.style.padding = '5px';
			// #endif
			// 初始化加载
			this.init();
		},
		methods: {
			init() {
				var me = this;
				uni.showLoading();
				uni.request({
					url: me.requestUrl + "/api/services/app/Home/GetHomePageData",
					method: "GET",
					withCredentials: true,
					success(res) {
						if (res.data.success) {
							console.log(res);
							me.list.forEach(x => {
								switch (x.text) {
									case '我的任务':
										x.badge = res.data.result.myTaskNum.toString();
										break;
									case '我的审批':
										x.badge = res.data.result.myPendingNum.toString();
										break;
									case '我的通知':
										x.badge = res.data.result.myNoticeNum.toString();
										break;
									case '我的项目':
										x.badge = res.data.result.myProjectNum.toString();
										break;
									case '我的问题':
										x.badge = res.data.result.myProblenNum.toString();
										break;
									case '我的风险':
										x.badge = res.data.result.myRiskNum.toString();
										break;
									case '我的缺陷':
										x.badge = res.data.result.myDefectNum.toString();
										break;
									case '我的团队':
										x.badge = res.data.result.myTeamNum.toString();
										break;
								}
							})
						}
					},
					complete() {
						uni.hideLoading();
					}
				})
			},
			change(e) {
				let {
					index
				} = e.detail
				switch (index) {
					case 0: // 我的任务
						uni.navigateTo({
							url: "../Task/Task?type=" + index,
						});
						break;
					case 1: // 我的审批
						uni.navigateTo({
							url: "../Approval/Index?type=" + index,
						});
						break;
					case 2: // 	我的通知
						uni.navigateTo({
							url: "../Notice/Notice?type=" + index,
						});
						break;
					case 3: // 	我的项目
						uni.navigateTo({
							url: "../Project/Project?type=" + index,
						});
						break;
					case 4: // 我的问题
						uni.navigateTo({
							url: "../Problem/Problem?type=" + index,
						});
						break;
					case 5: // 我的风险
						uni.navigateTo({
							url: "../Risk/Risk?type=" + index,
						});
						break;
					case 6: // 我的缺陷
						uni.navigateTo({
							url: "../Defect/Defect?type=" + index,
						});
						break;
					case 8: // 我的团队
						uni.navigateTo({
							url: "../Team/Team?type=" + index,
						});
						break;
					default:
						break;
				}
			},
		},
		onNavigationBarButtonTap() {
			uni.reLaunch({
				url: "../Login/Login"
			})
		}
	}
</script>

<style lang="scss">
	@import url("/common/css/Home.css");
</style>
