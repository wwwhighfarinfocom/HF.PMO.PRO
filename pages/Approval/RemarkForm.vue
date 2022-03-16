<template>
	<view>
		<view id="beizhu" :style="{height:maxHeight+'px'}">
			<view class="bzstyle">备注</view>
			<view class="bzstyle">
				<textarea auto-height class="textarea" v-model="remark" />
			</view>
		</view>

		<view id="btnplan">
			<view id="btn">
				<button class="mini-btn btn1" :loading="isokloading" @click="reject" type="default" size="mini"
					v-show="type=='-1'">确认拒绝</button>
				<button class="mini-btn btn2" :loading="isrejectloading" @click="ok" type="primary" size="mini"
					v-show="type=='1'">确认同意</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				remark: "",
				maxHeight: 0,
				isokloading: false,
				isrejectloading: false,
				id: "",
				type: "",
				stepID: "",
			}
		},
		onLoad(option) {
			var me = this;
			me.id = option.id;
			me.type = option.type;
			me.stepID = option.StepID;
			uni.getSystemInfo({
				success: (res) => {
					me.maxHeight = res.windowHeight - 100;
				}
			})
		},
		methods: {
			ok() {
				var me = this;
				me.isokloading = true;
				uni.request({
					url: me.requestUrl + "/api/services/app/Approva/ReplyMethod",
					method: "POST",
					withCredentials: true,
					data: {
						workflowUID: me.id,
						result: me.type,
						currentStepID: me.stepID,
						remark: me.remark,
					},
					header: {
						'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
					},
					success(res) {
						if (res.statusCode == 200) {
							uni.showToast({
								title: "审批成功",
								icon: "success",
								success() {
									setTimeout(function() {
										uni.reLaunch({
											url: "../Approval/Processpage?uid=" + me.id + "&type=1",
										})
									}, 500);
								}
							})
						}
					},
					complete() {
						me.isokloading = false;
					}
				})
			},
			reject() {
				var me = this;
				me.isrejectloading = true;
				uni.request({
					url: me.requestUrl + "/api/services/app/Approva/ReplyMethod",
					method: "POST",
					withCredentials: true,
					data: {
						workflowUID: me.id,
						result: me.type,
						currentStepID: me.stepID,
						remark: me.remark,
					},
					header: {
						'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
					},
					success(res) {
						if (res.statusCode == 200) {
							uni.showToast({
								title: "审批成功",
								icon: "success",
								success() {
									setTimeout(function() {
										uni.redirectTo({
											url: "../Approval/Index?type=1",
										})
									}, 500);
								}
							})
						}
					},
					complete() {
						me.isrejectloading = false;
					}
				})
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
	@import url("/common/css/Approval/RemarkForm.css");
</style>
