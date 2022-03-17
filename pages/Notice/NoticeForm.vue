<template>
	<view id="main" :style="{height:maxHeight+'px'}">
		<view id="form">
			<uni-forms :modelValue="formData">
				<uni-forms-item label="标题" name="title">
					<uni-easyinput type="text" v-model="formData.title" :disabled="true" />
				</uni-forms-item>
				<uni-forms-item label="日期" name="createDate">
					<uni-datetime-picker type="date" :value="formData.createDate" :border="false" :disabled="true" />
				</uni-forms-item>
				<uni-forms-item label="内容" name="message">
					<textarea auto-height style="width: 100%;padding-top: 18rpx;" v-model="formData.message"
						:disabled="true" />
				</uni-forms-item>
			</uni-forms>
		</view>
		<view class="button-sp-area btnplan">
			<view class="btnclass">
				<button class="mini-btn btn1" :disabled="btnA" type="default" size="mini" @click="upperTask">上一条</button>
				<button class="mini-btn btn2" :disabled="btnA" type="default" size="mini" @click="nextTask">下一条</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: null,
				maxHeight: 1500,
				formData: {
					title: "",
					createDate: "",
					message: "",
				},
				btnA: true,
				btnB: true,
				status: null,
				ids: [], // id集合
			}
		},
		onLoad(option) {
			var me = this;
			this.id = option.Id;
			this.status = option.type;
			/* 页面渲染 */
			uni.getSystemInfo({
				success: (res) => {
					me.maxHeight = res.windowHeight;
				}
			})
		},
		mounted() {
			this.init();
			/* 获取问题id集合 */
			this.getNoticeIds();
		},
		methods: {
			init() {
				var me = this;
				uni.showLoading();
				uni.request({
					url: me.requestUrl + "/api/services/app/Notice/GetNoticeByIdData",
					method: "GET",
					withCredentials: true,
					data: {
						id: me.id,
					},
					success(res) {
						if (res.data.success) {
							me.formData = res.data.result;
							me.btnB = false;
							if (me.formData.state == 0) {
								me.setUserNoticeReadSingle();
							}
						}
					},
					complete() {
						uni.hideLoading();
						me.btnA = false;
					}
				});
			},

			getNoticeIds() {
				/* 获取问题id集合 */
				var me = this;
				uni.request({
					url: me.requestUrl + "/api/services/app/Notice/GetNoticekIds",
					method: "GET",
					withCredentials: true,
					data: {
						type: me.status,
					},
					success(res) {
						if (res.data.success) {
							me.ids = res.data.result;
							me.btnA = false;
						}
					}
				});
			},

			setUserNoticeReadSingle() {
				/* 设置已读 */
				var me = this;
				uni.request({
					url: me.requestUrl + "/api/services/app/Notice/SetUserNoticeReadSingle",
					method: "POST",
					withCredentials: true,
					data: {
						id: me.id,
					},
					header: {
						'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
					},
					success(res) {
						if (res.data.success) {

						}
					}
				});
			},

			upperTask() {
				/* 上一条 */
				var me = this;
				me.btnA = true;
				var isbtnB = me.btnB;
				me.btnB = true;
				var index = me.ids.findIndex((item) => {
					return item == me.id
				});
				if (index == 0) {
					uni.showToast({
						title: "已是第一个通知",
						icon: "error",
						success() {
							me.btnA = false;
							me.btnB = isbtnB;
						}
					})
					return;
				}
				var ids = me.ids.filter((x, i) => {
					return i == index - 1;
				});
				me.id = ids[0];
				me.init();
			},

			nextTask() {
				/* 下一条 */
				var me = this;
				me.btnA = true;
				var isbtnB = me.btnB;
				me.btnB = true;
				var index = me.ids.findIndex((item) => {
					return item == me.id
				});
				if (index == me.ids.length - 1) {
					uni.showToast({
						title: "已是最后一条通知",
						icon: "error",
						success() {
							me.btnA = false;
							me.btnB = isbtnB;
						}
					})
					return;
				}
				var ids = me.ids.filter((x, i) => {
					return i == index + 1;
				});
				me.id = ids[0];
				me.init();
			},
		},
		onNavigationBarButtonTap() {
			uni.reLaunch({
				url: "../Home/Home"
			})
		}
	}
</script>

<style>
	@import url("/common/css/Notice/NoticeForm.css");
</style>
