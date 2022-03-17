<template>
	<view id="main" :style="{height:maxHeight+'px'}">
		<view id="form">
			<uni-forms :modelValue="formData">
				<uni-forms-item label="问题名称" name="problemName">
					<uni-easyinput type="text" v-model="formData.problemName" :disabled="true" />
				</uni-forms-item>
				<uni-forms-item label="所属项目" name="projectName">
					<uni-easyinput type="text" v-model="formData.projectName" :disabled="true" />
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
				<uni-forms-item label="当前状态" name="problemStatusEnum">
					<view class="uni-list-cell-db" style="margin-top: 16rpx;">
						<picker @change="bindPickerChange" :value="formData.problemStatusEnum-1" :range="array">
							<view class="uni-input">{{array[formData.problemStatusEnum-1]}}</view>
						</picker>
					</view>
				</uni-forms-item>
				<uni-forms-item label="问题类别" name="problemType">
					<uni-easyinput type="text" v-model="formData.problemType" :disabled="true" />
				</uni-forms-item>
				<uni-forms-item label="问题说明" name="explain">
					<textarea auto-height style="width: 100%;padding-top: 18rpx;" v-model="formData.explain"
						:disabled="true" />
				</uni-forms-item>
				<uni-forms-item label="解决方案" name="solution">
					<textarea auto-height style="width: 100%;padding-top: 18rpx;" v-model="formData.solution" />
				</uni-forms-item>
			</uni-forms>
		</view>
		<view class="button-sp-area btnplan">
			<view class="btnclass">
				<button class="mini-btn btn1" :disabled="btnA" type="default" size="mini"
					@click="upperTask">上一条</button>
				<button class="mini-btn btn" :disabled="btnB" type="primary" size="mini" @click="saveBtn">保存</button>
				<button class="mini-btn btn" :disabled="btnB" type="primary" size="mini" @click="submitBtn">取消</button>
				<button class="mini-btn btn1" :disabled="btnA" type="default" size="mini" @click="nextTask">下一条</button>
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
					problemName: "",
					projectName: "",
					createName: "",
					trustName: "",
					createDate: "",
					expireDate: "",
					finishDate: "",
					problemStatus: "",
					problemType: "",
					explain: "",
					solution: "",
				},
				btnA: true,
				btnB: true,
				status: null,
				ids: [], // id集合
				array: ['未解决', '解决中', '已解决'],
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
			this.getProblemIds();
		},
		methods: {
			init() {
				var me = this;
				uni.showLoading();
				uni.request({
					url: me.requestUrl + "/api/services/app/Problem/GetProblemByIdData",
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

			getProblemIds() {
				/* 获取问题id集合 */
				var me = this;
				uni.request({
					url: me.requestUrl + "/api/services/app/Problem/GetProblemIds",
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

			bindPickerChange: function(e) {
				var me = this
				me.formData.problemStatusEnum = e.target.value + 1;
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
							})
						}
					},
					complete() {
						uni.hideLoading();
					}
				});
			},

			submitBtn() {
				/* 取消 */
				var me = this;
				uni.redirectTo({
					url: "../Problem/Problem?type=4",
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
	@import url("/common/css/Problem/ProblemForm.css");
</style>
