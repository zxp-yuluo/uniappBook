<template>
	<view class="hot">
		<view class="title">
			热门小说
		</view>
		<view class="main">
			<view class="main-up" @click="toDetail(newBookCover[0]._id)">
				<view class="main-up-cover" v-if="newBookCover[0]">
					<image class="cover-img" :src="newBookCover[0].cover" mode="widthFix"></image>
				</view>
				<view class="main-up-info" v-if="newBookCover[0]">
					<view class="book-name">
						{{newBookCover[0].title}}
					</view>
					<view class="book-desc">
						{{newBookCover[0].shortIntro}}
					</view>
					<view class="book-meta">
						<view class="book-meta-l">
							<text class="book-author">{{newBookCover[0].author}}</text>
						</view>
						<view class="book-meta-r">
							<text class="book-tag lightgreen">{{newBookCover[0].minorCate}}</text>
							<text class="book-tag lightblue">连载中</text>
							<text class="book-tag smallblue">{{newBookCover[0].latelyFollower | latelyFollower}}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="main-down">
				<view class="book-li" v-for="(item,index) in newBookCover" :key="index" @click="toDetail(item._id)">
					<view class="book-layout">
						<view class="book-cover">
							<image class="book-cover-image" :src="item.cover" mode="widthFix"></image>
						</view>
						<view class="book-cell">
							<view class="book-title">
								{{item.title}}
							</view>
							<view class="book-meta">
								{{item.author}}
							</view>
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
			hotList: {
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
				let list = this.hotList
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
.hot
	margin 24rpx 0
	.title
		margin 0 32rpx
		font-size 32rpx
		font-weight 600
		margin-bottom 24rpx
	.main
		.main-up
			display flex
			padding 32rpx
			.cover-img
				width 132rpx
				height 176rpx
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
	    .main-down
			padding 16rpx 0
			display flex
			flex-wrap wrap
			.book-li
				width 50%
				padding 16rpx 32rpx
				box-sizing border-box
				&:first-of-type
					display none
				.book-layout
					display flex
					.book-cover-image
						width 96rpx
						height 128rpx
						margin-right 16rpx
					.book-cell
						display flex
						flex-direction column
						justify-content space-between
						padding 10rpx 0
						.book-title
							margin-bottom 8rpx
							font-weight 600
							line-height 38rpx
							font-size 28rpx
							display -webkit-box
							-webkit-box-orient vertical
							-webkit-line-clamp 2
							overflow hidden
						.book-meta
							font-size 26rpx
							color grey
							overflow hidden
							text-overflow ellipsis
							white-space nowrap
</style>					

