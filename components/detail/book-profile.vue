<template>
	<view class="book-profile">
		<image class="book-profile-blur" :src="newBookDetail.cover" mode="widthFix"></image>
		<view class="book-info">
			<view class="book-cover">
				<image class="book-cover-tu" :src="newBookDetail.cover" mode="widthFix"></image>
			</view>
			<view class="book-other">
				<view class="book-title">
					{{newBookDetail.title}}
				</view>
				<view class="book-author">
					{{newBookDetail.author}}
				</view>
				<view class="book-tatus">
					{{newBookDetail.cat}}
					<text class="line">/</text>
					{{newBookDetail.isSerial?'连载中':'完结'}}
				</view>
				<view class="book-metas">
					{{newBookDetail.wordCount | latelyFollower}}字
					<text class="line">|</text>
					{{newBookDetail.totalFollower  | latelyFollower}}阅读
				</view>
				<view class="book-update">
					{{undateTime}}更新
				</view>
			</view>	
		</view>
		<view class="block"></view>
		<loading :status="loading" />
	</view>
</template>

<script>
	import loading from '../loading/loading.vue'
	export default {
		props: {
			bookDetail: {
				type: Object
			}
		},
		data() {
			return {
				loading: true
			}
		},
		computed: {
			newBookDetail() {
				let list = this.bookDetail
				let newList = JSON.parse(JSON.stringify(list))
				// console.log(newList)
				if(newList.cover) {
					let patt = '%2F'
					let patt1 = '%3A'
					let patt2 = '/agent/'
					newList.cover = newList.cover.replace(new RegExp(patt,'g'),'/')
					newList.cover = newList.cover.replace(new RegExp(patt1,'g'),':')
					newList.cover = newList.cover.replace(patt2,'')
				}
				return newList
			},
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
		},
		components: {
			loading
		},
		watch: {
			async bookDetail() {
				await this.$nextTick()
				this.loading = false
			}
		}
	}
</script>

<style lang="stylus" scoped>
.book-profile
	position relative
	overflow hidden
	.book-profile-blur
		position absolute
		left 0
		top 50%
		transform translateY(-50%)
		display block
		width 100%
		z-index 0
		filter blur(8px)
		-webkit-filter blur(8px)
		opacity .1
	.book-info
		display flex
		padding 13rpx 40rpx 0 20rpx
		.book-cover
			margin-right 28rpx
			.book-cover-tu
				vertical-align middle
				margin 17rpx 0 0 10rpx
				width 200rpx
				height 268rpx
		.book-other
			.book-title
				margin-top 24rpx
			.book-author
				margin-top 15rpx
				font-size 28rpx
				color rgb(255, 215, 0)
				line-height 50rpx
			.book-tatus
			.book-metas
			.book-update
				color #999999
				font-size 26rpx
				line-height 50rpx
				.line
					margin 0 10rpx
					font-size 24rpx
	.block
		position relative
		height 30rpx
		background-image: linear-gradient(hsla(0,0%,100%,0) 0,#fff);
		z-index 2
</style>
