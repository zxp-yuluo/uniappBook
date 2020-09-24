<template>
	<view class="book-comment">
		<view class="title">
			书评
		</view>
		<view class="book-comment-list" v-if="bookComment.reviews">
			<view class="book-comment-item" v-for="(item,index) in bookComment.reviews" :key="index">
				<view class="user-avatar">
					<image class="user-avatar-img" :src="'http://statics.zhuishushenqi.com/'+item.author.avatar" mode=""></image>
					<view class="user-name">
						{{item.author.nickname}}
					</view>
				</view>
				<view class="xingxing">
					<view class="xing">
						<text class="iconfont icon-xing color" v-for="(item,index) in item.rating" :key="index"></text>
						<text class="iconfont icon-xing" v-for="(item,index) in (5-item.rating)" :key="index + 1000"></text>
					</view>
					<view class="advice" v-if="item.rating==1">
						浪费生命
					</view>
					<view class="advice" v-if="item.rating==2">
						打发时间
					</view>
					<view class="advice" v-if="item.rating==3">
						值得一看
					</view>
					<view class="advice" v-if="item.rating==4">
						非常喜欢
					</view>
					<view class="advice" v-if="item.rating==5">
						必看神作
					</view>
				</view>
				<view class="other">
					<view class="comment-title">
						{{item.title}}
					</view>
					<view class="comment-content">
						{{item.content}}
					</view>
					<view class="comment-other">
						<view class="comment-other-left">
							<view class="time">
								{{item.updated | undateTime}}
							</view>
							<view class="read">
								<!-- 8.13万人阅读 -->
							</view>
						</view>
						<view class="comment-other-right">
							<view class="pinglun">
								<text class="iconfont icon-pinglun"></text>
								{{item.commentCount}}
							</view>
							<view class="zan">
								<text class="iconfont icon-dianzan"></text>
								{{item.helpful.yes}}
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="more" @click="lazyMore">
			查看更多({{bookComment.total}})
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			bookComment: {
				type: Object
			}
		},
		data() {
			return {
				
			}
		},
		methods: {
			lazyMore() {
				this.$emit('lazyMore')
			}
		},
		computed: {

		},
		filters: {
			undateTime(value) {
				let date = +new Date(value)
				let currentDate = +new Date()
				let time = currentDate - date
				// console.log(date,currentDate)
				let info
				if(time < 3600000) {
					let msg = Math.floor(time/60000)>0?Math.floor(time/60000) + '分钟前':'刚刚'
					info =  msg
				}else if(time > 3600000 && time < 86400000) {
					info = Math.floor(time/3600000) + '小时前'
				}else {
					info = Math.floor(time/86400000) + '天前'
				}
				return info
			}
		}
	}
</script>

<style scoped lang="stylus">
	.book-comment
		.title
			margin-left 30rpx
			font-size 32rpx
			line-height 80rpx
			border-bottom 1px solid #eee
		.book-comment-item
			padding 20rpx 30rpx
			border-bottom 1px solid #eee
			.user-avatar
				display flex
				align-items center
				.user-avatar-img
					width 50rpx
					height 50rpx
					border-radius 50%
					margin-right 10rpx
					vertical-align middle
				.user-name
					font-size 24rpx
			.xingxing
				display flex
				align-items center
				margin 10rpx 0
				.advice
					font-size 24rpx
					color #999
				.xing
					display flex
					align-items center
					margin-right 10rpx
					.iconfont
						&.color
							color rgb(255, 215, 0)
			.other
				.comment-title
					font-size 28rpx
					margin-bottom 10rpx
				.comment-content
					text-indent 2em
					font-size 24rpx
					color #999
					line-height 1.5
					display -webkit-box
					-webkit-box-orient vertical
					-webkit-line-clamp 3
					overflow hidden
					margin-bottom 10rpx
				.comment-other
					display flex
					justify-content space-between
					align-items center
					margin-bottom 10rpx
					font-size 24rpx
					color #999
					.comment-other-left
						display flex
						.time
							margin-right 10rpx
					.comment-other-right
						display flex
						align-items center
						.pinglun
							margin-right 10rpx
						.iconfont
							margin-right 10rpx
		.more
			text-align center
			line-height 80rpx
			font-size 24rpx
			color rgb(255, 215, 0)
</style>


