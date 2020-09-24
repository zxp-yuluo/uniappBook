<template>
	<view class="honor-labels">
		<view class="item" v-if="bookDetail.rating">
			<view class="num">
				{{bookDetail.rating.count}}
			</view>
			<view class="tit">
				参与评论
			</view>
		</view>
		<view class="item">
			<view class="num">
				{{bookDetail.latelyFollower  | follower}}
				<text class="txt">万</text>
			</view>
			<view class="tit">
				7日人气
			</view>
		</view>
		<view class="item">
			<view class="num">
				{{bookDetail.retentionRatio}}
				<text class="txt">%</text>
			</view>
			<view class="tit">
				读者留存
			</view>
		</view>
		<view class="item">
			<view class="num">
				{{bookDetail.totalFollower | follower}}
				<text class="txt">万</text>
			</view>
			<view class="tit">
				累计人气
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			bookDetail: {
				type: Object
			}
		},
		data() {
			return {
				
			}
		},
		methods: {
			
		},
		computed: {
			
		},
		filters: {
			follower(value) {
				value = value>10000? (value/10000).toFixed(1): value
				return value
			}
		}
	}
</script>

<style scoped lang="stylus">
.honor-labels
	display flex
	background-color #fff
	.item
		flex 1
		text-align center
		.num
			color #333
			font-size 28rpx
			font-family sans-serif
			font-weight 600
			.txt
				margin-left 6rpx
				color #999
				font-size 24rpx
		.tit
			color #999
			font-size 24rpx
</style>
