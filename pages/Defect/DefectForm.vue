<template>
	<view id="main" :style="{height:maxHeight+'px'}">
		<view id="form">
			<uni-forms :modelValue="formData">
				<uni-forms-item label="缺陷名称" name="defectName">
					<uni-easyinput type="text" v-model="formData.defectName" :disabled="true" />
				</uni-forms-item>
				<uni-forms-item label="所属项目" name="projectName">
					<uni-easyinput type="text" v-model="formData.projectName" :disabled="true" />
				</uni-forms-item>
				<uni-forms-item label="缺陷编号" name="defectCode">
					<uni-easyinput type="text" v-model="formData.defectCode" :disabled="true" />
				</uni-forms-item>
				<uni-forms-item label="提出人" name="createUserName">
					<uni-easyinput type="text" v-model="formData.createUserName" :disabled="true" />
				</uni-forms-item>
				<uni-forms-item label="负责人" name="userName">
					<uni-easyinput type="text" v-model="formData.userName" :disabled="true" />
				</uni-forms-item>
				<uni-forms-item label="提出时间" name="createDate">
					<uni-datetime-picker type="date" :value="formData.createDate" :border="false" :disabled="true" />
				</uni-forms-item>
				<uni-forms-item label="截止日期" name="createDate">
					<uni-datetime-picker type="date" :value="formData.createDate" :border="false" :disabled="true" />
				</uni-forms-item>
				<uni-forms-item label="优先级" name="priority">
					<uni-easyinput type="text" v-model="formData.priority" :disabled="true" />
				</uni-forms-item>
				<uni-forms-item label="缺陷状态" name="defectStatusEnum">
					<view class="uni-list-cell-db" style="margin-top: 16rpx;">
						<picker @change="bindPickerChange" :value="formData.defectStatusEnum-1" :range="array">
							<view class="uni-input">{{array[formData.defectStatusEnum-1]}}</view>
						</picker>
					</view>
				</uni-forms-item>
				<uni-forms-item label="缺陷说明" name="remark">
					<textarea auto-height style="width: 100%;padding-top: 18rpx;" v-model="formData.remark"
						:disabled="true" />
				</uni-forms-item>
				<uni-forms-item label="解决方案" name="response">
					<textarea auto-height style="width: 100%;padding-top: 18rpx;" v-model="formData.response" />
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
					defectName: "",
					defectCode: "",
					projectName: "",
					userName: "",
					createDate: "",
					defectStatus: "",
					defectStatusEnum: "",
					priority: "",
					createUserName: "",
					remark: "",
					response: "",
				},
				btnA: true,
				btnB: true,
				status: null,
				ids: [], // id集合
				array: ['已关闭', '已发布', '处理中', '开发中', '测试中', '待部署'],
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
			this.getDefectIds();
		},
		methods: {
			init() {
				var me = this;
				uni.showLoading();
				uni.request({
					url: me.requestUrl + "/api/services/app/Defect/GetDefectByIdData",
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

			bindPickerChange: function(e) {
				var me = this
				me.formData.defectStatusEnum = e.target.value + 1;
			},

			getDefectIds() {
				/* 获取问题id集合 */
				var me = this;
				uni.request({
					url: me.requestUrl + "/api/services/app/Defect/GetDefectIds",
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
					url: me.requestUrl + "/api/services/app/Defect/SaveDefect",
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
					url: "../Defect/Defect?type=6",
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
						title: "已是第一个缺陷",
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
						title: "已是最后一个缺陷",
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
	@import url("/common/css/Defect/DefectForm.css");
</style>
