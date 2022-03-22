<template>
	<view>

		<view class="content">
			<view class="tabclass">
				<uni-list v-for="(item,index) in projectList">
					<view class="ronqi" @click="onClick(item)">
						<text class="proname">团队名：{{item.projectName}}\n</text>
						<text>负责人：{{item.userName}}\n</text>
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
				projectList: [], //项目集合
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
				// 加载项目列表
				var me = this;
				uni.showLoading();
				uni.request({
					url: me.requestUrl + "/api/services/app/Team/GetProject",
					method: "GET",
					withCredentials: true,
					data: {
						page: me.page,
						size: me.size,
					},
					success(res) {
						if (res.data.success) {
							me.projectList = res.data.result;
						}
					},
					complete() {
						uni.hideLoading();
					}
				});
			},


			onClick(item) {
				/* 点击团队事件 */
				var me = this;
				uni.navigateTo({
					url: "../Team/TeamList?Id=" + item.id,
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
					url: me.requestUrl + "/api/services/app/Team/GetProject",
					method: "GET",
					withCredentials: true,
					data: {
						page: me.page,
						size: me.size,
					},
					success(res) {
						if (res.data.success) {
							var list = res.data.result;
							me.projectList.concat(list);
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
	@import url("/common/css/Team/Team.css");
</style>
