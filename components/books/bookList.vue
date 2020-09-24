<template>
	<view class="bookList">
		<view class="title">
			热门小说
		</view>
		<view class="main">
			<view class="main-up" v-for="(item,index) in newBookCover" :key="index" @click="toDetail(item._id)">
				<view class="main-up-cover">
					<image class="main-up-cover-img" :src="item.cover" mode="widthFix"></image>
				</view>
				<view class="main-up-info">
					<view class="book-name">
						{{item.title}}
					</view>
					<view class="book-desc">
						{{item.shortIntro}}
					</view>
					<view class="book-meta">
						<view class="book-meta-l">
							<text class="book-author">{{item.author}}</text>
						</view>
						<view class="book-meta-r">
							<text class="book-tag lightgreen">{{item.minorCate}}</text>
							<text class="book-tag lightblue">连载中</text>
							<text class="book-tag smallblue">{{item.latelyFollower | latelyFollower}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			list: {
				type: Array
			}
		},
		data() {
			return {

			}
		},
		methods: {
			toDetail(id) {
				// console.log(id)
				uni.navigateTo({
				    url: '../../pages/detail/detail?id=' + id
				});
			}
		},
		computed: {
			newBookCover() {
				let list = this.list
				let newList = JSON.parse(JSON.stringify(list))
				let patt = '%2F'
				let patt1 = '%3A'
				let patt2 = '/agent/'
				newList.forEach(item => {
					item.cover = item.cover.replace(new RegExp(patt,'g'),'/')
					item.cover = item.cover.replace(new RegExp(patt1,'g'),':')
					item.cover = item.cover.replace(patt2,'')
				})
				return newList
			}
		}
	}
</script>

<style lang="stylus" scoped>
.bookList
	margin 24rpx 0
	margin-bottom 100rpx
	.title
		margin 0 32rpx
		font-size 32rpx
		font-weight 600
		margin-bottom 24rpx
	.main
		.main-up
			display flex
			padding 32rpx
			.main-up-cover-img
				width 132rpx
				height 184rpx
				margin-right 16rpx
			.main-up-info
				overflow  hidden
				.book-name
					font-size 28rpx
					font-weight 600
					line-height 1.4
				.book-desc
					margin 12rpx 0 18rpx
					font-size 26rpx
					color #999999
					line-height 1.4
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
				.book-meta
					display flex
					justify-content space-between
					align-items center
					font-size 26rpx
					color #999999
					line-height 1.5
					.book-tag
						position relative
						margin 0 6rpx
						padding 0 10rpx
						font-size 24rpx
						&.lightblue
							color #f69a48
						&.lightgreen
							color #f16299
						&.smallblue
							color #65b1f5
						&::after
							content ''
							position absolute
							top 0px
							left 0
							right 0
							bottom -1px
							border-bottom 1px solid
							border-right 1px solid
							border-radius 4rpx
							opacity .5
							z-index -1
</style>
