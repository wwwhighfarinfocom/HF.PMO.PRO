<template>
	<view>
		<view id="optionsstyle">
			<uni-grid :column="1" :square="false" @change="change">
				<uni-grid-item v-for="(item ,index) in list" :index="index" :key="index">
					<view class="grid-item-box">
						<view v-if="item.badge">
							<uni-badge :text="item.badge" :type="item.type" :max-num="999999999" />
						</view>
						<text :class="{checked:index==checkedNum}">{{item.text}}</text>
					</view>
				</uni-grid-item>
			</uni-grid>
		</view>

		<view class="content">
			<view class="tabclass" v-show="checkedNum === 0">
				<uni-list v-for="(item,index) in ownList">
					<uni-list-item link to="/pages/vue/index/index" @click="onClick(item)"
						:title="'任务名称：'+item.taskName" :note="'所属项目：'+item.projectName" thumb-size="lg"
						:rightText="item.dateRange">
					</uni-list-item>
				</uni-list>
				<uni-load-more :showText="false" :status="moreStatus" @clickLoadMore="clickLoadMoreOwn">
				</uni-load-more>
			</view>
			<view class="tabclass" v-show="checkedNum === 1">
				<uni-list v-for="(item,index) in undoneList">
					<uni-list-item link to="/pages/vue/index/index" @click="onClick(item)"
						:title="'任务名称：'+item.taskName" :note="'所属项目：'+item.projectName" thumb-size="lg"
						:rightText="item.dateRange">
					</uni-list-item>
				</uni-list>
				<uni-load-more :showText="false" :status="moreStatus" @clickLoadMore="clickLoadMoreOwn">
				</uni-load-more>
			</view>
			<view class="tabclass" v-show="checkedNum === 2">
				<uni-list v-for="(item,index) in txpiringList">
					<uni-list-item link to="/pages/vue/index/index" @click="onClick(item)"
						:title="'任务名称：'+item.taskName" :note="'所属项目：'+item.projectName" thumb-size="lg"
						:rightText="item.dateRange">
					</uni-list-item>
				</uni-list>
				<uni-load-more :showText="false" :status="moreStatus" @clickLoadMore="clickLoadMoreOwn">
				</uni-load-more>
			</view>
			<view class="tabclass" v-show="checkedNum === 3">
				<uni-list v-for="(item,index) in delayList">
					<uni-list-item link to="/pages/vue/index/index" @click="onClick(item)"
						:title="'任务名称：'+item.taskName" :note="'所属项目：'+item.projectName" thumb-size="lg"
						:rightText="item.dateRange">
					</uni-list-item>
				</uni-list>
				<uni-load-more :showText="false" :status="moreStatus" @clickLoadMore="clickLoadMoreOwn">
				</uni-load-more>
			</view>
			<view class="tabclass" v-show="checkedNum === 4">
				<uni-list v-for="(item,index) in comList">
					<uni-list-item link to="/pages/vue/index/index" @click="onClick(item)"
						:title="'任务名称：'+item.taskName" :note="'所属项目：'+item.projectName" thumb-size="lg"
						:rightText="item.dateRange">
					</uni-list-item>
				</uni-list>
				<uni-load-more :showText="false" :status="moreStatus" @clickLoadMore="clickLoadMoreOwn">
				</uni-load-more>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [{
						text: '全部',
						badge: '0',
						type: "primary",
						ix: 0,
					},
					{
						text: '未完成',
						badge: '0',
						type: "warning",
						ix: 1,
					},
					{
						text: '即将到期',
						badge: '0',
						type: "warning",
						ix: 2,
					},
					{
						text: '延期任务',
						badge: '0',
						type: "warning",
						ix: 3,
					},
					{
						text: '已完成',
						badge: '0',
						type: "success",
						ix: 4,
					}
				],
				checkedNum: 0,
				data: null,
				ownList: [], // 全部
				undoneList: [], //未完成
				txpiringList: [], //即将到期
				delayList: [], //延期任务
				comList: [], //已完成
				page: 1,
				size: 15,
				moreStatus: "more",
				isLoadend: true,
			};
		},
		mounted() {
			this.init();
		},
		methods: {
			init() {
				var me = this;
				uni.showLoading();
				uni.request({
					url: me.requestUrl + "/api/services/app/Task/GetTaskData",
					method: "GET",
					withCredentials: true,
					data: {
						page: me.page,
						size: me.size,
					},
					success(res) {
						me.data = res.data.result;
						me.ownList = res.data.result.ownTaskData;
						me.list.forEach(x => {
							switch (x.ix) {
								case 0:
									x.badge = me.data.ownTaskNum.toString();
									break;
								case 1:
									x.badge = me.data.undoneTaskNum.toString();
									break;
								case 2:
									x.badge = me.data.txpiringTaskNum.toString();
									break;
								case 3:
									x.badge = me.data.delayTaskNum.toString();
									break;
								case 4:
									x.badge = me.data.comTaskNum.toString();
									break;
							}
						});

					},
					complete() {
						uni.hideLoading();
					}
				});
			},
			change(e) {
				var me = this;
				me.onClickItem(e.detail.index);
			},
			onClickItem(num) {
				var me = this;
				if (me.checkedNum != num) {
					me.checkedNum = num;
					me.ownList = []; //全部
					me.undoneList = []; //未完成
					me.txpiringList = []; //即将到期
					me.delayList = []; //延期任务
					me.comList = []; //已完成
					me.page = 1;
					uni.showLoading();
					uni.request({
						url: me.requestUrl + "/api/services/app/Task/GetScrollLoadTask",
						method: "GET",
						withCredentials: true,
						data: {
							page: me.page,
							size: me.size,
							type: me.checkedNum + 1,
						},
						success(res) {
							switch (me.checkedNum) {
								case 0:
									me.ownList = res.data.result;
									break;
								case 1:
									me.undoneList = res.data.result;
									break;
								case 2:
									me.txpiringList = res.data.result;
									break;
								case 3:
									me.delayList = res.data.result;
									break;
								case 4:
									me.comList = res.data.result;
									break;
							}

						},
						complete() {
							uni.hideLoading();
						}
					});
				}
			},

			clickLoadMoreOwn(e) {
				var me = this;
				if (me.isLoadend) {
					me.isLoadend = false;
					me.dropDownLoadData();
				}

			},

			onReachBottom() {
				var me = this;
				if (me.isLoadend) {
					me.isLoadend = false;
					me.dropDownLoadData();
				}
			},

			dropDownLoadData() {
				var me = this;
				me.page += 1;
				me.moreStatus = "loading";
				uni.request({
					url: me.requestUrl + "/api/services/app/Task/GetScrollLoadTask",
					method: "GET",
					withCredentials: true,
					data: {
						page: me.page,
						size: me.size,
						type: me.checkedNum + 1,
					},
					success(res) {
						switch (me.checkedNum) {
							case 0:
								me.ownList = me.ownList.concat(res.data.result);
								break;
							case 1:
								me.undoneList = me.undoneList.concat(res.data.result);
								break;
							case 2:
								me.txpiringList = me.txpiringList.concat(res.data.result);
								break;
							case 3:
								me.delayList = me.delayList.concat(res.data.result);
								break;
							case 4:
								me.comList = me.comList.concat(res.data.result);
								break;
						}

					},
					complete() {
						me.moreStatus = "more";
						me.isLoadend = true;
					}
				});
			},

			onClick(item) {
				var me = this;
				console.log(item);
				var num = me.checkedNum + 1;
				uni.navigateTo({
					url: "../Task/TaskForm?taskId=" + item.taskId + "&type=" + num,
				});
			}
		}
	};
</script>

<style>
	@import url("/common/css/Task/Task.css");
</style>
