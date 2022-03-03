<template>
	<view style="background-color: #FFFFFF;">
		<view id="fromId">
			<uni-forms :modelValue="formData">
				<uni-forms-item label="任务名称" name="name">
					<uni-easyinput type="text" v-model="formData.name" placeholder="请输入姓名" />
				</uni-forms-item>
				<uni-forms-item label="所属项目" name="name">
					<uni-easyinput type="text" v-model="formData.name" placeholder="请输入姓名" />
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
					<progress percent="60" active :border-radius="300" show-info stroke-width="8"
						style="margin-top: 16rpx;" />
				</uni-forms-item>
			</uni-forms>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

				formData: {},
				hobby: "",
				single: "",

			}
		},
		mounted() {

		},
		methods: {

		}
	}
</script>

<style>
	@import url("/common/css/Task/TaskForm.css");
</style>
