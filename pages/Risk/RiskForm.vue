<template>
	<view id="main" :style="{height:maxHeight+'px'}">
		<view id="form">
			<uni-forms :modelValue="formData">
				<uni-forms-item label="风险名称" name="riskName">
					<uni-easyinput type="text" v-model="formData.riskName" :disabled="true" />
				</uni-forms-item>
				<uni-forms-item label="所属项目" name="projectName">
					<uni-easyinput type="text" v-model="formData.projectName" :disabled="true" />
				</uni-forms-item>
				<uni-forms-item label="预计成本" name="forecastCost">
					<uni-easyinput type="number" v-model="formData.forecastCost" :disabled="true" />
				</uni-forms-item>
				<uni-forms-item label="提出人" name="createName">
					<uni-easyinput type="text" v-model="formData.createName" :disabled="true" />
				</uni-forms-item>
				<uni-forms-item label="负责人" name="trustName">
					<uni-easyinput type="text" v-model="formData.trustName" :disabled="true" />
				</uni-forms-item>
				<uni-forms-item label="提出时间" name="createDate">
					<uni-datetime-picker type="date" :value="formData.createDate" :border="false" :disabled="true" />
				</uni-forms-item>
				<uni-forms-item label="截止时间" name="expireDate">
					<uni-datetime-picker type="date" :value="formData.expireDate" :border="false" :disabled="true" />
				</uni-forms-item>
				<uni-forms-item label="解决日期" name="finishDate">
					<uni-datetime-picker type="date" v-model="formData.finishDate" :border="false" />
				</uni-forms-item>
				<uni-forms-item label="当前状态" name="riskStatus">
					<uni-easyinput type="text" v-model="formData.riskStatus" :disabled="true" />
				</uni-forms-item>
				<uni-forms-item label="风险类别" name="riskType">
					<uni-easyinput type="text" v-model="formData.riskType" :disabled="true" />
				</uni-forms-item>
				<uni-forms-item label="风险说明" name="explain">
					<textarea auto-height style="width: 100%;padding-top: 18rpx;" v-model="formData.explain" />
				</uni-forms-item>
				<uni-forms-item label="解决方案" name="solution">
					<textarea auto-height style="width: 100%;padding-top: 18rpx;" v-model="formData.solution" />
				</uni-forms-item>
			</uni-forms>
		</view>
		<view class="button-sp-area btnplan">
			<view class="btnclass">
				<button class="mini-btn btn" :disabled="btnA" type="default" size="mini" @click="upperTask">上一条</button>
				<button class="mini-btn btn" :disabled="btnB" type="primary" size="mini" @click="saveBtn">保存</button>
				<button class="mini-btn btn" :disabled="btnB" type="primary" size="mini" @click="submitBtn">取消</button>
				<button class="mini-btn btn" :disabled="btnA" type="default" size="mini" @click="nextTask">下一条</button>
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
					riskName: "",
					projectName: "",
					createName: "",
					trustName: "",
					createDate: "",
					expireDate: "",
					finishDate: "",
					riskStatus: "",
					riskType: "",
					explain: "",
					solution: "",
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
			this.getRiskIds();
		},
		methods: {
			init() {
				var me = this;
				uni.showLoading();
				uni.request({
					url: me.requestUrl + "/api/services/app/Risk/GetRiskByIdData",
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

			getRiskIds() {
				/* 获取问题id集合 */
				var me = this;
				uni.request({
					url: me.requestUrl + "/api/services/app/Risk/GetRiskIds",
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
					url: me.requestUrl + "/api/services/app/Risk/SaveRisk",
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
											url: "../Risk/Risk?type=5",
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
				me.$router.go(0); // 刷新
				/* uni.showLoading();
				uni.request({
					url: me.requestUrl + "/api/services/app/Risk/SubmitRisk",
					method: "POST",
					withCredentials: true,
					data: me.formData,
					success(res) {
						if (res.data.success) {
							uni.showToast({
								title: "提交成功",
								icon: "success",
								success() {
									setTimeout(function() {
										uni.redirectTo({
											url: "../Risk/Risk?type=5",
										});
									}, 500);
								}
							})
						}
					},
					complete() {
						uni.hideLoading();
					}
				}); */
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
						title: "已是第一个风险",
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
						title: "已是最后一个风险",
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
	@import url("/common/css/Risk/RiskForm.css");
</style>
