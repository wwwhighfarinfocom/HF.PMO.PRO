<template>
	<view id="main" v-if="isok">
		<view id="title">
			<uni-row>
				<uni-col>
					<text>{{data.approvalModule}}</text>
				</uni-col>
			</uni-row>
			<uni-row>
				<uni-col>
					<text v-if='data.workflowStatus==1' class="colorStyle2">审批中</text>
					<text v-if='data.workflowStatus==2' class="colorStyle1">审批通过</text>
				</uni-col>
			</uni-row>
		</view>

		<view id="row">
			<uni-row>
				<uni-col :span="6">
					<text>名称</text>
				</uni-col>
				<uni-col :span="18">
					<text>{{data.approvalBusiness}}</text>
				</uni-col>
			</uni-row>
			<uni-row>
				<uni-col :span="6">
					<text>编号</text>
				</uni-col>
				<uni-col :span="18">
					<text>{{data.code}}</text>
				</uni-col>
			</uni-row>
			<uni-row>
				<uni-col :span="6">
					<text>日期</text>
				</uni-col>
				<uni-col :span="18">
					<text>{{data.createDate}}</text>
				</uni-col>
			</uni-row>
		</view>

		<view id="step">
			<template v-for="(item,index) in steps">
				<uni-row :class="{backcolor:item.approvalStateEnum=='2'}">
					<uni-col :span="4" style="height: 83rpx;text-align: center;">
						<image src="/static/Icon/defaultboy.png"></image>
					</uni-col>
					<uni-col :span="10">
						<view><text>{{item.stepName}}</text></view>
						<view><text>{{item.userName}}</text></view>
					</uni-col>
					<uni-col :span="10" style="text-align: center;">
						<view><text>{{item.approvalDate}}</text></view>
						<view>
							<text :class="{
									colorStyle1:item.approvalStateEnum=='1',
									colorStyle2:item.approvalStateEnum=='2',
									colorStyle3:item.approvalStateEnum=='3',
									colorStyle4:item.approvalStateEnum=='-1'
									}">
								{{item.approvalState}}
							</text>
						</view>
					</uni-col>
				</uni-row>

				<uni-row :class="{backcolor:item.approvalStateEnum=='2'}">
					<uni-col :span="4" style="text-align: center;">
						<view class="yindao" style="height: 80rpx;"></view>
					</uni-col>
					<uni-col :span="20">
						<view style="padding-top:10rpx;"><text>{{item.remark}}</text></view>
					</uni-col>
				</uni-row>
			</template>

			<uni-row>
				<uni-col :span="4" style="height: 83rpx;text-align: center;">
					<image src="/static/Icon/waiting.png"></image>
				</uni-col>
				<uni-col :span="20" style="padding-top: 20rpx;">
					<text v-if='data.workflowStatus==1'>流程审批中</text>
					<text v-if='data.workflowStatus==2'>流程审批通过</text>
				</uni-col>
			</uni-row>
		</view>

		<view id="beizhu" v-if="data.isCurrentUserApproved==0&&data.workflowStatus==1">
			<view class="bzstyle">备注</view>
			<view class="bzstyle">
				<textarea auto-height class="textarea" v-model="remark" />
			</view>
		</view>
		<view id="btnplan" v-if="data.isCurrentUserApproved==0&&data.workflowStatus==1">
			<view id="btn" class="uni-padding-wrap uni-common-mt">
				<button type="primary" :loading="isokloading" @click="ok">同意</button>
				<button type="primary" :loading="isrejectloading" @click="reject" style="margin-top: 10rpx;">拒绝</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				uid: null,
				typeNumber: null,
				isok: false,
				remark: "",
				data: {
					approvalModule: null,
					approvalBusiness: null,
					code: null,
					createDate: null,
					workflowStatus: null,
					isCurrentUserApproved: null,
					currentStepID: null,
				},
				steps: [],
				isokloading: false,
				isrejectloading: false,
			}
		},
		onLoad(option) {
			this.uid = option.uid;
			this.typeNumber = option.type;
		},
		mounted() {
			this.init();
		},
		methods: {
			init() {
				var me = this;
				uni.showLoading();
				uni.request({
					url: me.requestUrl + "/api/services/app/Approva/GetProcessStep",
					method: "GET",
					withCredentials: true,
					data: {
						id: me.uid
					},
					success(res) {
						console.log(res);
						var temp = res.data.result;
						me.data.approvalModule = temp.approvalModule;
						me.data.approvalBusiness = temp.approvalBusiness;
						me.data.code = temp.code;
						me.data.createDate = temp.createDate;
						me.data.workflowStatus = temp.workflowStatus;
						me.data.isCurrentUserApproved = temp.isCurrentUserApproved;
						me.data.currentStepID = temp.currentStepID;
						me.steps = res.data.result.steps;
						me.isok = true;
					},
					complete() {
						uni.hideLoading();
					}
				})
			},
			ok() {
				var me = this;
				me.isokloading = true;
				uni.request({
					url: me.requestUrl + "/api/services/app/Approva/ReplyMethod",
					method: "POST",
					withCredentials: true,
					data: {
						workflowUID: me.uid,
						result: "1",
						currentStepID: me.data.currentStepID,
						remark: me.remark,
					},
					header: {
						'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
					},
					success(res) {
						if (res.statusCode == 200) {
							uni.showToast({
								title: "审批成功",
								icon: "success",
								success() {
									setTimeout(function() {
										me.$router.go(0); // 刷新
									}, 500);
								}
							})
						}
					},
					complete() {
						me.isokloading = false;
					}
				})
			},
			reject() {
				var me = this;
				me.isrejectloading = true;
				uni.request({
					url: me.requestUrl + "/api/services/app/Approva/ReplyMethod",
					method: "POST",
					withCredentials: true,
					data: {
						workflowUID: me.uid,
						result: "-1",
						currentStepID: me.data.currentStepID,
						remark: me.remark,
					},
					header: {
						'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
					},
					success(res) {
						if (res.statusCode == 200) {
							uni.showToast({
								title: "审批成功",
								icon: "success",
								success() {
									setTimeout(function() {
										uni.redirectTo({
											url: "../Approval/Index?type=" + me.typeNumber,
										})
									}, 500);
								}
							})
						}
					},
					complete() {
						me.isrejectloading = false;
					}
				})
			}
		},
		onNavigationBarButtonTap() {
			uni.reLaunch({
				url: "../Home/Home"
			})
		}
	}
</script>

<style>
	@import url("/common/css/Processpage.css");
</style>
