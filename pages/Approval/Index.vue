<template>
	<view id="main">
		<view id="cistern">
			<view id="gudin">
				<view class="example-body">
					<uni-row class="demo-uni-row" :width="nvueWidth">
						<uni-col :span="12">
							<view class="demo-uni-col dark" @click="choosewait">
								<text v-bind:style="{color:selectok}">待审批</text>
							</view>
						</uni-col>
						<uni-col :span="12">
							<view class="demo-uni-col light" @click="chooseok">
								<text v-bind:style="{color:selectno}">已审批</text>
							</view>
						</uni-col>
					</uni-row>
				</view>
			</view>
		</view>

		<view id="myWait" v-if="isSelect">
			<uni-list v-for="(item ,index) in listWait" class="uni-list">
				<uni-list-chat :clickable="true" @click="onWaitClick(item)" :title="item.fullName"
					:note="'发起人：'+item.startUserName"
					:avatar="item.userImgUrl==null?'/static/Icon/defaultboy.png':item.userImgUrl" thumb-size=" lg">
					<view class="chat-custom-right">
						<text class="chat-custom-text1">{{item.startDate}}</text><br>
						<text class="chat-custom-text2">审批中</text>
					</view>
				</uni-list-chat>
			</uni-list>
		</view>

		<view id="myFinish" v-if="!isSelect">
			<uni-list v-for="(item ,index) in listFinish" class="uni-list">
				<uni-list-chat :clickable="true" @click="onFinishClick(item)" :title="item.fullName"
					:note="'发起人：'+item.startUserName"
					:avatar="item.userImgUrl==null?'/static/Icon/defaultboy.png':item.userImgUrl" thumb-size="lg">
					<view class="chat-custom-right">
						<text class="chat-custom-text1">{{item.startDate}}</text><br>
						<text v-if="item.workflowStatus==1" class="chat-custom-text2">{{item.approvalStatus}}</text>
						<text v-else-if="item.workflowStatus==2"
							class="chat-custom-text3">{{item.approvalStatus}}</text>
						<text v-else-if="item.workflowStatus==3"
							class="chat-custom-text4">{{item.approvalStatus}}</text>
					</view>
				</uni-list-chat>
			</uni-list>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				typeNumber: null,
				isSelect: true,
				selectok: "#007AFF",
				selectno: "#000000",
				nvueWidth: 730,
				listWait: [],
				listFinish: [],
			}
		},
		onBackPress(e) {
			uni.navigateTo({
				url: "../Home/Home",
			});

			return true;
		},
		onLoad(option) {
			this.typeNumber = option.type;
		},
		mounted() {
			this.init();
		},
		methods: {
			init() {
				var me = this;
				switch (me.typeNumber) {
					case "1": // 我的审批
						uni.showLoading();
						uni.request({
							url: me.requestUrl + "/api/services/app/Approva/GetMySubmitList",
							method: "GET",
							withCredentials: true,
							success(res) {
								console.log(res);
								me.listWait = res.data.result;
							},
							complete() {
								uni.hideLoading();
							}
						})
						break;
					default:
						break;
				}
			},
			// 待审批
			choosewait() {
				var me = this;
				this.listWait = [];
				this.selectok = "#007AFF";
				this.selectno = "#000000";
				this.isSelect = true;
				this.init();
			},
			// 已审批
			chooseok() {
				var me = this;
				this.listFinish = [];
				this.selectok = "#000000";
				this.selectno = "#007AFF";
				this.isSelect = false;
				uni.showLoading();
				uni.request({
					url: me.requestUrl + "/api/services/app/Approva/GetMyConsumData",
					method: "GET",
					withCredentials: true,
					success(res) {
						console.log(res);
						me.listFinish = res.data.result;
					},
					complete() {
						uni.hideLoading();
					}
				});
			},
			onWaitClick(row) {
				var me = this;
				uni.navigateTo({
					url: "../Approval/Processpage?uid=" + row.workflowId + "&type=" + me.typeNumber
				})
			},
			onFinishClick(row) {
				var me = this;
				uni.navigateTo({
					url: "../Approval/Processpage?uid=" + row.workflowId + "&type=" + me.typeNumber
				})
			}
		}
	}
</script>

<style>
	@import url("/common/css/ApprIndex.css");
</style>
