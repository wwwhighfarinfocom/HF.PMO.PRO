<template>
	<view style="background-color: #FFFFFF;">
		<view id="fromId">
			<uni-forms :modelValue="formData">
				<uni-forms-item label="任务名称">
					<uni-easyinput type="text" v-model="formData.taskName" :disabled="true" />
				</uni-forms-item>
				<uni-forms-item label="所属项目">
					<uni-easyinput type="text" v-model="formData.projectName" :disabled="true" />
				</uni-forms-item>
				<uni-forms-item label="计划开始" name="name">
					<uni-datetime-picker type="date" :value="single" :border="false" :disabled="true" />
				</uni-forms-item>
				<uni-forms-item label="计划结束" name="name">
					<uni-datetime-picker type="date" :value="single" :border="false" :disabled="true" />
				</uni-forms-item>
				<uni-forms-item>
					<text>工期共计</text>
				</uni-forms-item>
				<uni-forms-item label="实际开始" name="name">
					<uni-datetime-picker type="date" :value="single" :border="false" />
				</uni-forms-item>
				<uni-forms-item label="实际结束" name="name">
					<uni-datetime-picker type="date" :value="single" :border="false" />
				</uni-forms-item>
				<uni-forms-item label="任务进度" name="name">
					<bestjhh-movable-area @change='change' :value="formData.progressValue" class="jdt">
					</bestjhh-movable-area>
				</uni-forms-item>
			</uni-forms>
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
					progressValue: "60",// 进度
				},
				hobby: "",
				single: "",
			}
		},
		mounted() {

		},
		methods: {
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
