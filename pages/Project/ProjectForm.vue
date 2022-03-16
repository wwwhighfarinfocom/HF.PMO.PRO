<template>
	<view id="main" :style="{height:maxHeight+'px'}">
		<view id="form">
			<uni-forms :modelValue="formData">
				<uni-forms-item label="项目名称" name="projectName">
					<uni-easyinput type="text" v-model="formData.projectName" :disabled="true" />
				</uni-forms-item>
				<uni-forms-item label="项目编号" name="projectCode">
					<uni-easyinput type="text" v-model="formData.projectCode" :disabled="true" />
				</uni-forms-item>
				<uni-forms-item label="项目经理" name="userName">
					<uni-easyinput type="text" v-model="formData.userName" :disabled="true" />
				</uni-forms-item>
				<uni-forms-item label="项目成本" name="projectCost">
					<uni-easyinput type="text" v-model="formData.projectCost" :disabled="true" />
				</uni-forms-item>
				<uni-forms-item label="开始日期" name="startDate">
					<uni-datetime-picker type="date" :value="formData.startDate" :border="false" :disabled="true" />
				</uni-forms-item>
				<uni-forms-item label="完成日期" name="endDate">
					<uni-datetime-picker type="date" :value="formData.endDate" :border="false" :disabled="true" />
				</uni-forms-item>
				<uni-forms-item label="项目状态" name="status">
					<uni-easyinput type="text" v-model="formData.status" :disabled="true" />
				</uni-forms-item>
				<uni-forms-item label="项目类型" name="projectType">
					<uni-easyinput type="text" v-model="formData.projectType" :disabled="true" />
				</uni-forms-item>
				<uni-forms-item label="说明" name="remark">
					<textarea auto-height style="width: 100%;padding-top: 18rpx;" v-model="formData.remark"
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
					projectName: "",
					projectCode: "",
					startDate: "",
					endDate: "",
					projectCost: "",
					status: "",
					projectType: "",
					remark: "",
					problemType: "",
					userName: "",
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
			this.getProjectIds();
		},
		methods: {
			init() {
				var me = this;
				uni.showLoading();
				uni.request({
					url: me.requestUrl + "/api/services/app/Project/GetProjectByIdData",
					method: "GET",
					withCredentials: true,
					data: {
						id: me.id,
					},
					success(res) {
						if (res.data.success) {
							me.formData = res.data.result;
							me.btnB = false;
						}
					},
					complete() {
						uni.hideLoading();
						me.btnA = false;
					}
				});
			},

			getProjectIds() {
				/* 获取问题id集合 */
				var me = this;
				uni.request({
					url: me.requestUrl + "/api/services/app/Project/GetProjectIds",
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

			saveBtn() {
				/* 保存 */
				var me = this;
				uni.showLoading();
				uni.request({
					url: me.requestUrl + "/api/services/app/Problem/SaveProblem",
					method: "POST",
					withCredentials: true,
					data: me.formData,
					success(res) {
						if (res.data.success) {
							uni.showToast({
								title: "保存成功",
								icon: "success",
								success() {
									setTimeout(function() {
										uni.redirectTo({
											url: "../Problem/Problem?type=4",
										});
									}, 500);
								}
							})
						}
					},
					complete() {
						uni.hideLoading();
					}
				});
			},

			submitBtn() {
				/* 提交 */
				var me = this;
				//uni.showLoading();
				me.$router.go(0); // 刷新
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
						title: "已是第一个问题",
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
						title: "已是最后一个问题",
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
	@import url("/common/css/Project/ProjectForm.css");
</style>
