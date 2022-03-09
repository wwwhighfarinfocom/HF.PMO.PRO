<template>
	<view id="main" :style="{height:maxHeight+'px'}">
		<view id="form">
			<uni-forms :modelValue="formData">
				<uni-forms-item label="问题名称" name="problemName">
					<uni-easyinput type="text" v-model="formData.problemName" />
				</uni-forms-item>
				<uni-forms-item label="所属项目" name="projectName">
					<uni-easyinput type="text" v-model="formData.projectName" />
				</uni-forms-item>
				<uni-forms-item label="提出人" name="createName">
					<uni-easyinput type="text" v-model="formData.createName" />
				</uni-forms-item>
				<uni-forms-item label="负责人" name="trustName">
					<uni-easyinput type="text" v-model="formData.trustName" />
				</uni-forms-item>
				<uni-forms-item label="提出时间" name="createDate">
					<uni-easyinput type="text" v-model="formData.createDate" />
				</uni-forms-item>
				<uni-forms-item label="截止时间" name="expireDate">
					<uni-easyinput type="text" v-model="formData.expireDate" />
				</uni-forms-item>
				<uni-forms-item label="解决日期" name="finishDate">
					<uni-easyinput type="text" v-model="formData.finishDate" />
				</uni-forms-item>
				<uni-forms-item label="当前状态" name="problemStatus">
					<uni-easyinput type="text" v-model="formData.problemStatus" />
				</uni-forms-item>
				<uni-forms-item label="问题类型" name="problemType">
					<uni-easyinput type="text" v-model="formData.problemType" />
				</uni-forms-item>
				<uni-forms-item label="问题说明" name="explain">
					<textarea style="width: 100%; padding-top: 15rpx; font-size: 28rpx;" v-model="formData.explain" />
				</uni-forms-item>
				<uni-forms-item label="解决方案" name="solution">
					<textarea style="width: 100%; padding-top: 15rpx; font-size: 28rpx;" v-model="formData.solution" />
				</uni-forms-item>
			</uni-forms>
		</view>
		<view class="button-sp-area btnplan">
			<view class="btnclass">
				<button class="mini-btn btn" type="default" size="mini">上一条</button>
				<button class="mini-btn btn" type="primary" size="mini">保存</button>
				<button class="mini-btn btn" type="primary" size="mini">提交</button>
				<button class="mini-btn btn" type="default" size="mini">下一条</button>
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
					problemName: "江湖故人",
					projectName: null,
					createName: null,
					trustName: null,
					createDate: "2022-03-09",
					expireDate: "2022-03-09",
					finishDate: null,
					problemStatus: null,
					problemType: "俄罗斯乌克兰局势怎么看",
					explain: "俄罗斯乌克兰局势怎么看俄罗斯乌克兰局势怎么看俄罗斯乌克兰局势怎么看俄罗斯乌克兰所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所所少时诵诗书所所所所所所所所所所所所所所所所所所所所所所所所所所所所所",
					solution: "俄罗斯乌克兰局势怎么看俄罗斯乌克兰局势怎么看俄罗斯乌克兰局势怎么看俄罗斯乌克兰局势怎么看",
				},
			}
		},
		onLoad(option) {
			var me = this;
			this.id = option.Id;
			/* 页面渲染 */
			uni.getSystemInfo({
				success: (res) => {
					me.maxHeight = res.windowHeight;
				}
			})
		},
		mounted() {
			//this.init();
		},
		methods: {
			init() {
				var me = this;
				uni.showLoading();
				uni.request({
					url: me.requestUrl + "/api/services/app/Problem/GetProblemInfoById",
					method: "GET",
					withCredentials: true,
					data: {
						id: me.id,
					},
					success(res) {

					},
					complete() {
						uni.hideLoading();
					}
				});
			},
		}
	}
</script>

<style>
	@import url("/common/css/Problem/ProblemForm.css");
</style>
