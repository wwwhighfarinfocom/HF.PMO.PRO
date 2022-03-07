<template>
	<view id="main">
		<view id="logostyle">
			<image src="/static/Img/logo.jpg"></image>
		</view>
		<view id="optionsstyle">
			<uni-grid :column="4" :square="false" @change="change">
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
						badge: '99',
						type: "warning"
					},
					{
						text: '我的提醒',
						badge: '2',
						type: "primary"
					},
					{
						text: '我的问题',
						badge: '12',
						type: "error"
					},
					{
						text: '我的风险',
						badge: '22',
						type: "error"
					},
					{
						text: '我的缺陷',
						badge: '24',
						type: "error"
					},
					{
						text: '我的需求',
						badge: '102',
						type: "success"
					}
				]
			}
		},
		onBackPress(e) {
			// 上一页
			return true;
		},
		mounted() {
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
						console.log(res);
						var num = res.data.result.myPendingNum.toString();
						me.list.forEach(x => {
							switch (x.text) {
								case '我的任务':
									x.badge = res.data.result.myTaskNum.toString();
									break;
								case '我的审批':
									x.badge = res.data.result.myPendingNum.toString();
									break;
							}
						})
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
					default:
						break;
				}
			},
		}
	}
</script>

<style lang="scss">
	@import url("/common/css/Home.css");
</style>
