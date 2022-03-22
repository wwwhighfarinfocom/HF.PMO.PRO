<template>
	<view>
		<view id="optionsstyle">
			<uni-grid :column="1" :square="false" @change="change">
				<uni-grid-item v-for="(item ,index) in titleList" :index="index" :key="index">
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
			<view class="tabclass">
				<uni-list v-for="(item,index) in list">
					<view class="ronqi" @click="onClick(item)">
						<text class="rwname">{{item.taskName}}\n</text>
						<text>所属项目：{{item.projectName}}\n</text>
						<text>{{item.dateRange}}\n</text>
						<image src="/static/Icon/jinru.png" class="tup"> </image>
					</view>
				</uni-list>
				<uni-load-more :showText="false" :status="moreStatus" @clickLoadMore="clickLoadMoreOwn"
					v-show="!isLoadend">
				</uni-load-more>
			</view>

		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				titleList: [],
				list: [], //团队任务列表
				projectId: null, //项目Id
				checkedNum: 0, //tab索引
				page: 1, // 页码
				size: 15, // 数量
				moreStatus: "more", // 下拉加载状态
				isLoadend: true, // 是否结束上拉自动加载
				selectUserId:0,

			}
		},
		onLoad(option) {
			var me = this;
			me.projectId = option.Id;
		},
		mounted() {
			this.init();
		},
		methods: {

			init() {
				// 加载项目任务
				var me = this;
				uni.showLoading();
				uni.request({
					url: me.requestUrl + "/api/services/app/Team/GetOrgByProjectId",
					method: "GET",
					withCredentials: true,
					data: {
						id: me.projectId,
						size: me.size,
					},
					success(res) {
						if (res.data.success) {
							var data = res.data.result;
							me.titleList = data.tab
							me.list = data.list;
						}
					},
					complete() {
						uni.hideLoading();
					}
				});
			},

			change(e) {
				/* tab选择事件 */
				var me = this;
				me.onClickItem(e.detail.index);
			},

			onClickItem(num) {
				var me = this;
				if (me.checkedNum != num) {
					me.checkedNum = num;
					me.list = [];
					uni.showLoading();
					var dt = me.titleList.filter(x => {
						return x.ix == me.checkedNum;
					});
					me.selectUserId = dt[0].userId;
					me.page = 1;
					uni.request({
						url: me.requestUrl + "/api/services/app/Team/GetUserTaskData",
						method: "GET",
						withCredentials: true,
						data: {
							id: me.projectId,
							userId: me.selectUserId,
							page: me.page,
							size: me.size,
						},
						success(res) {
							if (res.data.success) {
								me.list = res.data.result;
							}
						},
						complete() {
							uni.hideLoading();
						}
					});
				}
			},

			onClick(item) {
				/* 点击问题事件 */
				var me = this;
				uni.navigateTo({
					url: "../Team/TeamForm?TaskId=" + item.taskId + "&Id=" + me.projectId+ "&UserId=" + me.selectUserId,
				});
			},

			clickLoadMoreOwn() {
				/* 上拉自动加载 */
				var me = this;
				if (me.isLoadend) {
					me.isLoadend = false;
					me.dropDownLoadData();
				}
			},

			onReachBottom() {
				/* 点击加载 */
				var me = this;
				if (me.isLoadend) {
					me.isLoadend = false;
					me.dropDownLoadData();
				}
			},

			dropDownLoadData() {
				/* 自动加载 */
				var me = this;
				me.page += 1;
				me.moreStatus = "loading";
				uni.request({
					url: me.requestUrl + "/api/services/app/Team/GetUserTaskData",
					method: "GET",
					withCredentials: true,
					data: {
						id: me.projectId,
						userId: me.selectUserId,
						page: me.page,
						size: me.size,
					},
					success(res) {
						if (res.data.success) {
							var list = res.data.result;
							me.list.concat(list);
						}
					},
					complete() {
						me.moreStatus = "more";
						me.isLoadend = true;
					}
				});
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
	@import url("/common/css/Team/TeamList.css");
</style>
