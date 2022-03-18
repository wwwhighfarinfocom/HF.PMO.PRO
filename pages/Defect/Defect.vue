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
						<text class="proname">{{item.defectName}}\n</text>
						<text>所属项目：{{item.projectName}}\n</text>
						<text>缺陷编号：{{item.defectCode}}\n</text>
						<text>负责人：{{item.userName}}\n</text>
						<text>优先级：{{item.priority}}\n</text>
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
						<text class="proname">{{item.defectName}}\n</text>
						<text>所属项目：{{item.projectName}}\n</text>
						<text>缺陷编号：{{item.defectCode}}\n</text>
						<text>负责人：{{item.userName}}\n</text>
						<text>优先级：{{item.priority}}\n</text>
						<image src="/static/Icon/jinru.png" class="tup"></image>
					</view>
				</uni-list>
				<uni-load-more :showText="false" :status="moreStatus" @clickLoadMore="clickLoadMoreOwn"
					v-if="!isLoadend">
				</uni-load-more>
			</view>

			<view class="tabclass" v-show="checkedNum === 2">
				<uni-list v-for="(item,index) in waitList">
					<view class="ronqi" @click="onClick(item)">
						<text class="proname">{{item.defectName}}\n</text>
						<text>所属项目：{{item.projectName}}\n</text>
						<text>缺陷编号：{{item.defectCode}}\n</text>
						<text>负责人：{{item.userName}}\n</text>
						<text>优先级：{{item.priority}}\n</text>
						<image src="/static/Icon/jinru.png" class="tup"></image>
					</view>
				</uni-list>
				<uni-load-more :showText="false" :status="moreStatus" @clickLoadMore="clickLoadMoreOwn"
					v-show="!isLoadend">
				</uni-load-more>
			</view>

			<view class="tabclass" v-show="checkedNum === 3">
				<uni-list v-for="(item,index) in testList">
					<view class="ronqi" @click="onClick(item)">
						<text class="proname">{{item.defectName}}\n</text>
						<text>所属项目：{{item.projectName}}\n</text>
						<text>缺陷编号：{{item.defectCode}}\n</text>
						<text>负责人：{{item.userName}}\n</text>
						<text>优先级：{{item.priority}}\n</text>
						<image src="/static/Icon/jinru.png" class="tup"></image>
					</view>
				</uni-list>
				<uni-load-more :showText="false" :status="moreStatus" @clickLoadMore="clickLoadMoreOwn"
					v-show="!isLoadend">
				</uni-load-more>
			</view>

			<view class="tabclass" v-show="checkedNum === 4">
				<uni-list v-for="(item,index) in deployList">
					<view class="ronqi" @click="onClick(item)">
						<text class="proname">{{item.defectName}}\n</text>
						<text>所属项目：{{item.projectName}}\n</text>
						<text>缺陷编号：{{item.defectCode}}\n</text>
						<text>负责人：{{item.userName}}\n</text>
						<text>优先级：{{item.priority}}\n</text>
						<image src="/static/Icon/jinru.png" class="tup"></image>
					</view>
				</uni-list>
				<uni-load-more :showText="false" :status="moreStatus" @clickLoadMore="clickLoadMoreOwn"
					v-if="!isLoadend">
				</uni-load-more>
			</view>

			<view class="tabclass" v-show="checkedNum === 5">
				<uni-list v-for="(item,index) in publishList">
					<view class="ronqi" @click="onClick(item)">
						<text class="proname">{{item.defectName}}\n</text>
						<text>所属项目：{{item.projectName}}\n</text>
						<text>缺陷编号：{{item.defectCode}}\n</text>
						<text>负责人：{{item.userName}}\n</text>
						<text>优先级：{{item.priority}}\n</text>
						<image src="/static/Icon/jinru.png" class="tup"></image>
					</view>
				</uni-list>
				<uni-load-more :showText="false" :status="moreStatus" @clickLoadMore="clickLoadMoreOwn"
					v-if="!isLoadend">
				</uni-load-more>
			</view>

			<view class="tabclass" v-show="checkedNum === 6">
				<uni-list v-for="(item,index) in stopList">
					<view class="ronqi" @click="onClick(item)">
						<text class="proname">{{item.defectName}}\n</text>
						<text>所属项目：{{item.projectName}}\n</text>
						<text>缺陷编号：{{item.defectCode}}\n</text>
						<text>负责人：{{item.userName}}\n</text>
						<text>优先级：{{item.priority}}\n</text>
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
					text: '处理中',
					badge: '0',
					type: "error",
					ix: 1,
				}, {
					text: '开发中',
					badge: '0',
					type: "warning",
					ix: 2,
				}, {
					text: '测试中',
					badge: '0',
					type: "warning",
					ix: 3,
				}, {
					text: '待部署',
					badge: '0',
					type: "success",
					ix: 4,
				}, {
					text: '已发布',
					badge: '0',
					type: "success",
					ix: 5,
				}, {
					text: '已关闭',
					badge: '0',
					type: "success",
					ix: 6,
				}],
				wholeList: [], //全部缺陷列表
				waitList: [], //处理中缺陷列表
				devList: [], //开发中缺陷列表
				testList: [], //测试期缺陷列表
				deployList: [], //待部署缺陷列表
				publishList: [], //已发布缺陷列表
				stopList: [], //已关闭缺陷列表
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
					url: me.requestUrl + "/api/services/app/Defect/GetDefectOwnData",
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
										x.badge = data.wholeNum.toString();
										break;
									case 1:
										x.badge = data.waitNum.toString();
										break;
									case 2:
										x.badge = data.devNum.toString();
										break;
									case 3:
										x.badge = data.testNum.toString();
										break;
									case 4:
										x.badge = data.deployNum.toString();
										break;
									case 5:
										x.badge = data.publishNum.toString();
										break;
									case 6:
										x.badge = data.stopNum.toString();
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
					me.devList = [];
					me.testList = [];
					me.deployList = [];
					me.publishList = [];
					me.stopList = [];
					uni.showLoading();
					me.page = 1;
					uni.request({
						url: me.requestUrl + "/api/services/app/Defect/GetDefectTypeData",
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
										me.devList = list;
										break;
									case 3:
										me.testList = list;
										break;
									case 4:
										me.deployList = list;
										break;
									case 5:
										me.publishList = list;
										break;
									case 6:
										me.stopList = list;
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
				/* 点击缺陷事件 */
				var me = this;
				uni.navigateTo({
					url: "../Defect/DefectForm?Id=" + item.id + "&type=" + me.checkedNum,
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
					url: me.requestUrl + "/api/services/app/Defect/GetDefectTypeData",
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
									me.devList = me.devList.concat(list);
									break;
								case 3:
									me.testList = me.testList.concat(list);
									break;
								case 4:
									me.deployList = me.deployList.concat(list);
									break;
								case 5:
									me.publishList = me.publishList.concat(list);
									break;
								case 6:
									me.stopList = me.stopList.concat(list);
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
	@import url("/common/css/Defect/Defect.css");
</style>
