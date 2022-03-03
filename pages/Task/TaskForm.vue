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
				<uni-forms-item label="计划开始" name="planStartDate">
					<uni-datetime-picker type="date" :value="formData.planStartDate" :border="false" :disabled="true" />
				</uni-forms-item>
				<uni-forms-item label="计划结束" name="planFinishDate">
					<uni-datetime-picker type="date" :value="formData.planFinishDate" :border="false"
						:disabled="true" />
				</uni-forms-item>
				<uni-forms-item name="durationDays">
					<text class="gq">工期共计{{formData.durationDays}}天</text>
				</uni-forms-item>
				<uni-forms-item label="实际开始" name="realStartDate">
					<uni-datetime-picker type="date" :value="formData.realStartDate" :border="false" />
				</uni-forms-item>
				<uni-forms-item label="实际结束" name="realFinishDate">
					<uni-datetime-picker type="date" :value="formData.realFinishDate" :border="false" />
				</uni-forms-item>
				<uni-forms-item label="任务进度" name="progressValue">
					<bestjhh-movable-area @change='change' :num="formData.progressValue" class="jdt">
					</bestjhh-movable-area>
				</uni-forms-item>
				<view class="tpplan">
					<view>
						<image src="@/static/Icon/tupian.png" class="zhaopiang"></image>
					</view>
					<view class="tptitle">上传任务图片</view>
				</view>
				<view class="img">
					<uni-file-picker v-model="formData.images" file-mediatype="image" mode="grid" file-extname="png,jpg"
						:limit="6" @progress="progress" @success="success" @fail="fail" @select="select" />
				</view>
			</uni-forms>
		</view>
		<view class="button-sp-area btnplan">
			<view class="plan">
				<button class="mini-btn btn1" type="default" size="mini">上一条</button>
				<button class="mini-btn btn2" type="primary" size="mini">提交</button>
				<button class="mini-btn btn1" type="default" size="mini">下一条</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				formData: {
					taskName: "",
					projectName: "",
					planStartDate: "",
					planFinishDate: "",
					realStartDate: "",
					realFinishDate: "",
					durationDays: 0,
					progressValue: "60", // 进度
					images: [],
				},
				hobby: "",
				single: "",
				taskId: null,
				type: null,
			}
		},
		onLoad(option) {
			this.taskId = option.taskId;
			this.type = option.type;
		},
		mounted() {
			this.init();
		},
		methods: {
			init() {
				var me = this;
				uni.showLoading();
				uni.request({
					url: me.requestUrl + "/api/services/app/Task/GetTaskInfo",
					method: "GET",
					data: {
						taskId: me.taskId,
						type: me.type,
					},
					withCredentials: true,
					success(res) {
						var data = res.data.result;
						me.formData.taskName = data.taskName;
						me.formData.projectName = data.projectName;
						me.formData.planStartDate = data.strStart;
						me.formData.planFinishDate = data.strFinish;
						me.formData.realStartDate = data.strActualStart;
						me.formData.realFinishDate = data.strActualFinish;
						me.formData.durationDays = data.days;
						me.formData.progressValue = data.percentage.toString();

					},
					complete() {
						uni.hideLoading();
					}
				})
			},
			// 获取上传状态
			select(e) {
				console.log('选择文件：', e)
			},
			// 获取上传进度
			progress(e) {
				console.log('上传进度：', e)
			},

			// 上传成功
			success(e) {
				console.log('上传成功')
			},

			// 上传失败
			fail(e) {
				console.log('上传失败：', e)
			},
			change(val) {
				// 进度条数值
				this.formData.progressValue = val;
			}
		}
	}
</script>

<style>
	@import url("/common/css/Task/TaskForm.css");
</style>
