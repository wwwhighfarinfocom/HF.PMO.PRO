<template style="background-color: #FFFFFF;">
	<view id="main">
		<view id="fromId">
			<uni-forms :modelValue="formData">
				<uni-forms-item label="任务名称" name="taskName" style="color: #000000;">
					<uni-easyinput type="text" v-model="formData.taskName" :disabled="true" />
				</uni-forms-item>
				<uni-forms-item label="所属项目" name="projectName">
					<uni-easyinput type="text" v-model="formData.projectName" :disabled="true" />
				</uni-forms-item>
				<uni-forms-item label="计划开始" name="strStart">
					<uni-datetime-picker type="date" :value="formData.strStart" :border="false" :disabled="true" />
				</uni-forms-item>
				<uni-forms-item label="计划结束" name="strFinish">
					<uni-datetime-picker type="date" :value="formData.strFinish" :border="false" :disabled="true" />
				</uni-forms-item>
				<uni-forms-item name="days">
					<text class="gq">工期共计{{formData.days}}天</text>
				</uni-forms-item>
				<uni-forms-item label="实际开始" name="strActualStart">
					<uni-datetime-picker type="date" :value="formData.strActualStart" v-model="formData.strActualStart"
						:border="false" :disabled="true" />
				</uni-forms-item>
				<uni-forms-item label="实际结束" name="strActualFinish">
					<uni-datetime-picker type="date" :value="formData.strActualFinish"
						v-model="formData.strActualFinish" :border="false" :disabled="true" />
				</uni-forms-item>
				<uni-forms-item label="任务进度" name="percentage">
					<bestjhh-movable-area v-if="hackReset" @change='change' :num="formData.percentage" class="jdt">
					</bestjhh-movable-area>
				</uni-forms-item>
				<view class="tpplan">
					<view>
						<image src="@/static/Icon/tupian.png" class="zhaopiang"></image>
					</view>
					<view class="tptitle">上传任务图片</view>
				</view>
				<view class="img">
					<uni-file-picker v-model="formData.imgUrls" file-mediatype="image" mode="grid"
						file-extname="png,jpg,jpeg,gif" :limit="6" :readonly="true" />
				</view>
			</uni-forms>
		</view>

		<view class="button-sp-area btnplan">
			<view class="plan">
				<button class="mini-btn btn3" :disabled="isbtnA" type="default" size="mini"
					@click="upperTask">上一条</button>
				<button class="mini-btn btn4" :disabled="isbtnA" type="default" size="mini"
					@click="nextTask">下一条</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				formData: {
					percentage: '0'
				},
				isbtnA: false,
				isbtnB: false,
				taskId: null,
				taskIds: [],
				hackReset: true,
				saveImgs: [],
				userId: null,
				id: null, //项目Id
			}
		},
		onLoad(option) {
			/* 参数 */
			this.taskId = option.TaskId;
			this.id = option.Id;
			this.userId = option.UserId;
		},
		mounted() {
			this.init();
			this.getTaskIds();
		},
		methods: {
			init() {
				var me = this;
				uni.showLoading();
				uni.request({
					url: me.requestUrl + "/api/services/app/Team/GetTaskById",
					method: "GET",
					withCredentials: true,
					data: {
						id: me.id,
						taskId: me.taskId,

					},
					success(res) {
						me.formData = res.data.result;
						/* 控制按钮 */
						if (!me.formData.workflowStatus == 0) {
							me.isbtnB = true;
						} else {
							me.isbtnB = false;
						}
						me.formData.percentage = me.formData.percentage.toString();
						if (me.formData.imgUrls == "" || me.formData.imgUrls == null) {
							me.formData.imgUrls = [];
						} else {
							me.formData.imgUrls = JSON.parse(me.formData.imgUrls);
							// 备份照片数据
							me.saveImgs = me.formData.imgUrls;
						}

						/* 拼接服务地址 */
						me.formData.imgUrls.forEach(x => {
							x.url = me.requestUrl + x.url.replace(/\\/g, "/");
						})

						// 重新加载进度组件
						me.formData.progressValue = me.formData.percentage;
						me.loadArea();
					},
					complete() {
						uni.hideLoading();
						me.isbtnA = false;
					}
				});
			},
			getTaskIds() {
				var me = this;
				me.isbtnA = true;
				me.isbtnB = true;
				uni.request({
					url: me.requestUrl + "/api/services/app/Team/GetTaskTypeIds",
					method: "GET",
					withCredentials: true,
					data: {
						id: me.id,
						userId: me.userId,
					},
					success(res) {
						me.taskIds = res.data.result;
					}
				});
			},
			upperTask() {
				/* 上一条 */
				var me = this;
				me.isbtnA = true;
				me.isbtnB = true;
				var index = me.taskIds.findIndex((item) => {
					return item == me.taskId
				});
				if (index == 0) {
					uni.showToast({
						title: "已是第一项任务",
						icon: "error",
						success() {
							me.isbtnA = false;
							me.isbtnB = false;
						}
					})
					return;
				}
				var ids = me.taskIds.filter((x, i) => {
					return i == index - 1;
				});
				me.taskId = ids[0];
				me.init();
			},
			nextTask() {
				/* 下一条 */
				var me = this;
				me.isbtnA = true;
				me.isbtnB = true;
				var index = me.taskIds.findIndex((item) => {
					return item == me.taskId
				});
				if (index == me.taskIds.length - 1) {
					uni.showToast({
						title: "已是最后一项任务",
						icon: "error",
						success() {
							me.isbtnA = false;
							me.isbtnB = false;
						}
					})
					return;
				}
				var ids = me.taskIds.filter((x, i) => {
					return i == index + 1;
				});
				me.taskId = ids[0];
				me.init();
			},

			change(val) {
				// 进度条数值
				this.formData.progressValue = val;
			},
			loadArea() {
				// 重新加载进度组件
				this.hackReset = false;
				this.$nextTick(function() {
					this.hackReset = true;
				})
			},
		}
	}
</script>

<style>
	@import url("/common/css/Team/TeamForm.css");
	@import url("/static/iconfont.css");
</style>
