<template>
	<view class="book-catalogue">
		<view class="title">
			目录
		</view>
		<view class="chapter">
			{{undateTime}} · 连载至 · {{bookDetail.lastChapter}}
		</view>
		<view class="icon">
			<image class="icon-ima" src="../../static/img/iconfont/youjiantou.png" mode=""></image>
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
			undateTime() {
				// this.bookDetail.updated
				let date = +new Date(this.bookDetail.updated)
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
	.book-catalogue
		height 100rpx
		line-height 100rpx
		display flex
		.title
			font-size 32rpx
			padding-left 30rpx
			width 100rpx
			flex-shrink 0
		.chapter
			flex 1
			font-size 26rpx
			white-space nowrap
			text-overflow ellipsis
			overflow hidden
		.icon
			// width 70rpx
			flex-shrink 0
			display flex
			justify-content flex-end
			align-items center
			margin 0 30rpx
			.icon-ima
				width 24rpx
				height 24rpx
</style>

