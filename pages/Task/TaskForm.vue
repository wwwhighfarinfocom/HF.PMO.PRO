<template style="background-color: #FFFFFF;">
	<view id="main">
		<view id="fromId">
			<uni-forms :modelValue="formData">
				<uni-forms-item label="任务名称" name="taskName">
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
					<uni-datetime-picker type="date" :value="formData.strActualStart" :border="false" />
				</uni-forms-item>
				<uni-forms-item label="实际结束" name="strActualFinish">
					<uni-datetime-picker type="date" :value="formData.strActualFinish" :border="false" />
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
						file-extname="png,jpg,jpeg,gif" :limit="6" @select="select" @progress="progress"
						@success="success" @delete="deleteImg" />
				</view>
			</uni-forms>
		</view>
		<view class="button-sp-area btnplan">
			<view class="plan">
				<button class="mini-btn btn1" :disabled="isdisabled" type="default" size="mini"
					@click="upperTask">上一条</button>
				<button class="mini-btn btn2" :disabled="isdisabled" type="primary" size="mini" @click="ok">提交</button>
				<button class="mini-btn btn1" :disabled="isdisabled" type="default" size="mini"
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
				isdisabled: false,
				taskId: null,
				type: null,
				taskIds: [],
				hackReset: true,
			}
		},
		onLoad(option) {
			this.taskId = option.taskId;
			this.type = option.type;
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
					url: me.requestUrl + "/api/services/app/Task/GetTaskInfo",
					method: "GET",
					withCredentials: true,
					data: {
						taskId: me.taskId,
						type: me.type,
					},
					success(res) {
						me.formData = res.data.result;
						me.formData.percentage = me.formData.percentage.toString();
						if (me.formData.imgUrls == "" | me.formData.imgUrls == null) {
							me.formData.imgUrls = [];
						} else {
							me.formData.imgUrls = me.formData.imgUrls.split(',');
						}
						var item = {
							"name": "tupian",
							"extname": "jpg",
							"url": "http://localhost:9398/mobile/imgs/20220307/tupian.jpg",
						}
						me.formData.imgUrls.push(item);
						// 重新加载进度组件
						me.loadArea();
					},
					complete() {
						uni.hideLoading();
						me.isdisabled = false;
					}
				});
			},
			getTaskIds() {
				var me = this;
				me.isdisabled = true;
				uni.request({
					url: me.requestUrl + "/api/services/app/Task/GetTaskTypeIds",
					method: "GET",
					withCredentials: true,
					data: {
						type: me.type,
					},
					success(res) {
						me.taskIds = res.data.result;
					}
				});
			},
			upperTask() {
				var me = this;
				me.isdisabled = true;
				var index = me.taskIds.findIndex((item) => {
					return item == me.taskId
				});
				if (index == 0) {
					uni.showToast({
						title: "已是第一项任务",
						icon: "error"
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
				var me = this;
				me.isdisabled = true;
				var index = me.taskIds.findIndex((item) => {
					return item == me.taskId
				});
				if (index == me.taskIds.length - 1) {
					uni.showToast({
						title: "已是最后一项任务",
						icon: "error"
					})
					return;
				}
				var ids = me.taskIds.filter((x, i) => {
					return i == index + 1;
				});
				me.taskId = ids[0];
				me.init();
			},
			ok() {
				var me = this;
				var da = me.formData;
			},
			// 获取上传状态
			select(e) {
				var me = this;
				/* e.tempFiles.forEach(item => {
					uni.request({
						url: me.requestUrl + "/MobileUpload/Upload",
						method: "POST",
						withCredentials: true,
						header: {
							'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
						},
						data: {
							url:item.url,
							name:item.name
						},
						success(res) {
							var s = res;
						}
					});
				}); */


				/* const tempFilePaths = e.tempFiles;
				tempFilePaths.forEach(item => {
					uni.uploadFile({
						url: me.requestUrl + "/MobileUpload/Upload",
						method: "POST",
						files: item,
						name:'file',
						header: {
							'content-type': 'multipart/form-data'
						},
						success: (uploadFileRes) => {
							console.log(uploadFileRes.data);
						}
					});
				}) */
			},

			// 上传成功
			success(e) {
				console.log('上传成功')
			},

			// 移除图片
			deleteImg(e) {
				console.log('上传失败：', e)
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
			}
		}
	}
</script>

<style>
	@import url("/common/css/Task/TaskForm.css");
</style>
