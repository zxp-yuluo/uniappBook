<template>
	<view class="book-summary">
		<view class="boxhd">
			<view class="title">
				简介
			</view>
			<view class="tags" v-if="bookDetail.tags">
				<text class="tag" v-for="(item,index) in tags">{{item}}</text>
			</view>
		</view>
		<view class="book-desc">
			<view class="contanier" :style="{height: isUnfold?'auto':'120rpx'}"  @click="unfoldClick">
				<view v-for="(item, index) in desc" :key="index">
					　　{{item}}
				</view>
				<view>
					　　<image class="icon-img" :class="{rotate: isUnfold}" src="../../static/img/iconfont/jiantou.png" mode=""></image>
				</view>
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
				isUnfold: false
			}
		},
		methods: {
			unfoldClick() {
				this.isUnfold = !this.isUnfold
			}
		},
		computed: {
			desc() {
				if(this.bookDetail.longIntro) {
					return this.bookDetail.longIntro.split('\r\n')
				}
			},
			tags() {
				if(this.bookDetail.tags.length > 6) {
					return this.bookDetail.tags.slice(0,6)
				}else {
					return this.bookDetail.tags
				}
				
			}
		}
	}
</script>

<style scoped lang="stylus">
.book-summary
	.boxhd
		display flex
		height 100rpx
		align-items center
		.title
			padding 0 30rpx
			font-size 32rpx
		.tags
			flex 1
			display flex
			flex-direction row-reverse
			margin-right 30rpx
			.tag
				font-size 24rpx
				color #999999
				margin-left 15rpx
				padding 0 10rpx
				background-color #f5f5f5
				border-radius 2rpx
				white-space nowrap
	.book-desc
		border-bottom 1px solid #EEEEEE
		padding 30rpx
		padding-top 0
		.contanier
			font-size 24rpx
			line-height 40rpx
			color #999
			overflow hidden
			position relative
			transition all 1s ease
			.icon-img
				position absolute
				bottom 0
				right 30rpx
				width 24rpx
				height 24rpx
				transition all 1s ease
				&.rotate
					transform rotate(180deg)
			
</style>


