<template>
	<view>
		<view class="slider-box">
			<view class="flex"></view>
			<movable-area class="sliderBar" :style="{width: (100 - minScore)+'%'}">
				<view class="gone" :style="{width: x +'px'}"></view>
				<movable-view class="slider" :x="x" :y="y" direction="all" @change="onChange">
					<text>{{ score }}</text>
				</movable-view>
			</movable-area>
			<view :style="{width: (100 - maxScore) +'%'}"></view>
		</view>
	</view>
</template>

<script>
	export default {
		props: ['min', 'max', 'num'],
		data() {
			return {
				slideBarWidth: 0,
				minScore: this.min ? this.min : 0,
				maxScore: this.max ? this.max : 100,
				x: 0,
				y: 0,
				score: this.min ? this.min : 0,
				val: this.num,
			};
		},
		created() {
			var me = this;
			this.$nextTick(() => {
				uni.createSelectorQuery().select(".slider-box").boundingClientRect(function(res) {
					me.slideBarWidth = res.width;
					// 设置初始值
					setTimeout(function() {
						// 确保每次刷新
						me.x = me.val / 100 * me.slideBarWidth;
						me.score = Math.ceil(parseInt(Math.ceil(me.x) / Math.ceil(me
							.slideBarWidth) * 100) + parseInt(me.minScore));
					}, 500);
				}).exec();
			})
		},
		methods: {
			onChange: function(e, i) {
				this.x = e.detail.x
				this.score = Math.ceil(parseInt(Math.ceil(e.detail.x) / Math.ceil(this.slideBarWidth) * 100) +
					parseInt(this.minScore));
				this.$emit('change', this.score)
			}
		}
	}
</script>

<style lang="scss">
	$uni-color-primary:#007AFF;

	.slider-box {
		display: flex;
		width: 100%;
		height: 32rpx;
		position: relative;

		&::before {
			content: '';
			position: absolute;
			height: 8rpx;
			border-radius: 8rpx;
			background-color: #EEEEEE;
			top: 50%;
			left: 0;
			transform: translateY(-50%);
			width: 100%;
		}

		.flex {
			flex: 1;
			height: 8rpx;
			border-radius: 8rpx 0 0 8rpx;
			background-color: $uni-color-primary;
			margin-top: 12rpx;
			position: relative;
			z-index: 1;
		}

		.sliderBar {
			height: 100%;
			border-radius: 8rpx;
			width: 100%;

			.gone {
				background-color: $uni-color-primary;
				height: 100%;
				position: absolute;
				left: 0;
				height: 8rpx;
				top: 12rpx;
				max-width: 100%;
				z-index: 1;
				border-radius: 0 8rpx 8rpx 0;
			}

			.slider {
				width: 0rpx;
				height: 100%;
				position: relative;
				z-index: 2;

				&::after {
					content: '';
					position: absolute;
					border-radius: 16rpx;
					background-color: $uni-color-primary;
					width: 32rpx;
					height: 100%;
					transform: translatex(-50%);
				}

				text {
					position: absolute;
					width: 60rpx;
					color: white;
					border-radius: 14rpx;
					top: -140%;
					left: 50%;
					text-align: center;
					transform: translateX(-50%);
					background-color: $uni-color-primary;

					&::after {
						content: '';
						position: absolute;
						border: 6rpx solid transparent;
						border-top-color: $uni-color-primary;
						top: 99%;
						left: 50%;
						transform: translateX(-50%);
					}
				}
			}
		}
	}
</style>
