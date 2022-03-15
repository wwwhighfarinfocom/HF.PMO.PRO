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
			<view class="tabclass" v-show="checkedNum === 0">
				<uni-list v-for="(item,index) in wholeList">
					<view class="ronqi" @click="onClick(item)">
						<text class="proname">{{item.title}}\n</text>
						<text>状态：{{item.state==1?"已读":"未读"}}\n</text>
						<text>日期：{{item.createDate}}\n</text>
						<image src="/static/Icon/jinru.png" class="tup"></image>
					</view>
				</uni-list>
				<uni-load-more :showText="false" :status="moreStatus" @clickLoadMore="clickLoadMoreOwn"
					v-show="!isLoadend">
				</uni-load-more>
			</view>

			<view class="tabclass" v-show="checkedNum === 1">
				<uni-list v-for="(item,index) in unreadList">
					<view class="ronqi" @click="onClick(item)">
						<text class="proname">{{item.title}}\n</text>
						<text>状态：{{item.state==1?"已读":"未读"}}\n</text>
						<text>日期：{{item.createDate}}\n</text>
						<image src="/static/Icon/jinru.png" class="tup"></image>
					</view>
				</uni-list>
				<uni-load-more :showText="false" :status="moreStatus" @clickLoadMore="clickLoadMoreOwn"
					v-if="!isLoadend">
				</uni-load-more>
			</view>

			<view class="tabclass" v-show="checkedNum === 2">
				<uni-list v-for="(item,index) in readList">
					<view class="ronqi" @click="onClick(item)">
						<text class="proname">{{item.title}}\n</text>
						<text>状态：{{item.state==1?"已读":"未读"}}\n</text>
						<text>日期：{{item.createDate}}\n</text>
						<image src="/static/Icon/jinru.png" class="tup"></image>
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
				titleList: [{
					text: '全部',
					badge: '0',
					type: "primary",
					ix: 0,
				}, {
					text: '未读',
					badge: '0',
					type: "warning",
					ix: 1,
				}, {
					text: '已读',
					badge: '0',
					type: "success",
					ix: 2,
				}],
				wholeList: [], //全部列表
				unreadList: [], //未读列表
				readList: [], //已读列表
				checkedNum: 0, //tab索引
				page: 1, // 页码
				size: 15, // 数量
				moreStatus: "more", // 下拉加载状态
				isLoadend: true, // 是否结束上拉自动加载
			}
		},
		mounted() {
			this.init();
		},
		methods: {
			init() {
				var me = this;
				uni.showLoading();
				uni.request({
					url: me.requestUrl + "/api/services/app/Notice/GetNoticeOwnData",
					method: "GET",
					withCredentials: true,
					data: {
						size: me.size,
					},
					success(res) {
						if (res.data.success) {
							var data = res.data.result;
							me.wholeList = data.list;
							me.titleList.forEach(x => {
								switch (x.ix) {
									case 0:
										x.badge = data.allNum.toString();
										break;
									case 1:
										x.badge = data.unreadNum.toString();
										break;
									case 2:
										x.badge = data.readNum.toString();
										break;
								}
							});
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
					me.wholeList = [];
					me.unreadList = [];
					me.readList = [];
					uni.showLoading();
					me.page = 1;
					uni.request({
						url: me.requestUrl + "/api/services/app/Notice/GetNoticeTypeData",
						method: "GET",
						withCredentials: true,
						data: {
							type: me.checkedNum,
							page: me.page,
							size: me.size,
						},
						success(res) {
							if (res.data.success) {
								var list = res.data.result;
								switch (me.checkedNum) {
									case 0:
										me.wholeList = list;
										break;
									case 1:
										me.unreadList = list;
										break;
									case 2:
										me.readList = list;
										break;
								}
							}
						},
						complete() {
							uni.hideLoading();
						}
					});
				}
			},

			onClick(item) {
				/* 点击通知事件 */
				var me = this;
				uni.navigateTo({
					url: "../Notice/NoticeForm?Id=" + item.guid + "&type=" + me.checkedNum,
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
					url: me.requestUrl + "/api/services/app/Notice/GetNoticeTypeData",
					method: "GET",
					withCredentials: true,
					data: {
						type: me.checkedNum,
						page: me.page,
						size: me.size,
					},
					success(res) {
						if (res.data.success) {
							var list = res.data.result;
							switch (me.checkedNum) {
								case 0:
									me.wholeList = me.wholeList.concat(list);
									break;
								case 1:
									me.unreadList = me.unreadList.concat(list);
									break;
								case 2:
									me.readList = me.readList.concat(list);
									break;
							}
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
	@import url("/common/css/Notice/Notice.css");
</style>
