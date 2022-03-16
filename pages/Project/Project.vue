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
						<text class="proname">{{item.projectName}}\n</text>
						<text>编号：{{item.projectCode}}\n</text>
						<text>状态：{{item.status}}\n</text>
						<text>经理：{{item.userName}}\n</text>
						<image src="/static/Icon/jinru.png" class="tup"></image>
					</view>
				</uni-list>
				<uni-load-more :showText="false" :status="moreStatus" @clickLoadMore="clickLoadMoreOwn"
					v-show="!isLoadend">
				</uni-load-more>
			</view>

			<view class="tabclass" v-show="checkedNum === 1">
				<uni-list v-for="(item,index) in waitList">
					<view class="ronqi" @click="onClick(item)">
						<text class="proname">{{item.projectName}}\n</text>
						<text>编号：{{item.projectCode}}\n</text>
						<text>状态：{{item.status}}\n</text>
						<text>经理：{{item.userName}}\n</text>
						<image src="/static/Icon/jinru.png" class="tup"></image>
					</view>
				</uni-list>
				<uni-load-more :showText="false" :status="moreStatus" @clickLoadMore="clickLoadMoreOwn"
					v-if="!isLoadend">
				</uni-load-more>
			</view>

			<view class="tabclass" v-show="checkedNum === 2">
				<uni-list v-for="(item,index) in conductList">
					<view class="ronqi" @click="onClick(item)">
						<text class="proname">{{item.projectName}}\n</text>
						<text>编号：{{item.projectCode}}\n</text>
						<text>状态：{{item.status}}\n</text>
						<text>经理：{{item.userName}}\n</text>
						<image src="/static/Icon/jinru.png" class="tup"></image>
					</view>
				</uni-list>
				<uni-load-more :showText="false" :status="moreStatus" @clickLoadMore="clickLoadMoreOwn"
					v-show="!isLoadend">
				</uni-load-more>
			</view>

			<view class="tabclass" v-show="checkedNum === 3">
				<uni-list v-for="(item,index) in stopList">
					<view class="ronqi" @click="onClick(item)">
						<text class="proname">{{item.projectName}}\n</text>
						<text>编号：{{item.projectCode}}\n</text>
						<text>状态：{{item.status}}\n</text>
						<text>经理：{{item.userName}}\n</text>
						<image src="/static/Icon/jinru.png" class="tup"></image>
					</view>
				</uni-list>
				<uni-load-more :showText="false" :status="moreStatus" @clickLoadMore="clickLoadMoreOwn"
					v-show="!isLoadend">
				</uni-load-more>
			</view>

			<view class="tabclass" v-show="checkedNum === 4">
				<uni-list v-for="(item,index) in rejectList">
					<view class="ronqi" @click="onClick(item)">
						<text class="proname">{{item.projectName}}\n</text>
						<text>编号：{{item.projectCode}}\n</text>
						<text>状态：{{item.status}}\n</text>
						<text>经理：{{item.userName}}\n</text>
						<image src="/static/Icon/jinru.png" class="tup"></image>
					</view>
				</uni-list>
				<uni-load-more :showText="false" :status="moreStatus" @clickLoadMore="clickLoadMoreOwn"
					v-if="!isLoadend">
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
					text: '待审批',
					badge: '0',
					type: "warning",
					ix: 1,
				}, {
					text: '	',
					badge: '0',
					type: "warning",
					ix: 2,
				}, {
					text: '搁置',
					badge: '0',
					type: "warning",
					ix: 3,
				}, {
					text: '被驳回',
					badge: '0',
					type: "error",
					ix: 4,
				}],
				wholeList: [], //全部项目列表
				waitList: [], //待审批项目列表
				conductList: [], //进行中项目列表
				stopList: [], //搁置项目列表
				rejectList: [], //驳回项目列表
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
					url: me.requestUrl + "/api/services/app/Project/GetProjectOwnData",
					method: "GET",
					withCredentials: true,
					data: {
						size: me.size,
					},
					success(res) {
						if (res.data.success) {
							var data = res.data.result;
							me.wholeList = res.data.result.list;
							me.titleList.forEach(x => {
								switch (x.ix) {
									case 0:
										x.badge = data.allNum.toString();
										break;
									case 1:
										x.badge = data.waitNum.toString();
										break;
									case 2:
										x.badge = data.conductNum.toString();
										break;
									case 3:
										x.badge = data.stopNum.toString();
										break;
									case 4:
										x.badge = data.rejectNum.toString();
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
					me.waitList = [];
					me.conductList = [];
					me.stopList = [];
					me.rejectList = [];
					uni.showLoading();
					me.page = 1;
					uni.request({
						url: me.requestUrl + "/api/services/app/Project/GetProjectTypeData",
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
										me.waitList = list;
										break;
									case 2:
										me.conductList = list;
										break;
									case 3:
										me.stopList = list;
										break;
									case 4:
										me.rejectList = list;
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
				/* 点击问题事件 */
				var me = this;
				uni.navigateTo({
					url: "../Project/ProjectForm?Id=" + item.id + "&type=" + me.checkedNum,
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
					url: me.requestUrl + "/api/services/app/Project/GetProjectTypeData",
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
									me.waitList = me.waitList.concat(list);
									break;
								case 2:
									me.conductList = me.conductList.concat(list);
									break;
								case 3:
									me.stopList = me.stopList.concat(list);
									break;
								case 4:
									me.rejectList = me.rejectList.concat(list);
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
	@import url("/common/css/Project/Project.css");
</style>
