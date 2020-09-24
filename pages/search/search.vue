<template>
	<view class="search">
		<view class="header">
			<!-- #ifdef H5 -->
			<view class="left" @click="backClick">
				<image src="../../static/img/iconfont/jiantou-xia.png" mode=""></image>
			</view>
			<!-- #endif -->
			<view class="center">
				<input type="text" placeholder="搜作品/作者" :value="inputValue" @input="inputClick" />
				<!-- #ifdef H5 -->
				<view class="cha" @click.stop="clearClick" v-show="inputValue.length">
				<!-- #endif -->
				
				
				<!-- #ifdef MP-WEIXIN -->
				<view class="searchIcon">
					<image src="../../static/img/iconfont/search.png" mode=""></image>
				</view>
				<view class="cha" @click.stop="clearClick" v-if="inputValue.length">
				<!-- #endif -->
					<image src="../../static/img/iconfont/deletorerror.png" mode=""></image>
				</view>
			</view>
			<!-- #ifdef H5 -->
			<view class="right" @click="searchClick">
				<image src="../../static/img/iconfont/search.png" mode=""></image>
			</view>
			<!-- #endif -->
		</view>
		<view class="bookList">
			<view class="item" v-for="(item,index) in newBooks" :key="item._id" @click="toDetail(item._id)">
				<view class="cover">
					<image :src="item.cover" mode=""></image>
				</view>
				<view class="info">
					<rich-text class="title" :nodes="item.title"></rich-text>
					<rich-text class="desc" :nodes="item.shortIntro"></rich-text>
					<view class="other">
						<text class="author">{{item.author}}</text>
						<text class="dian">·</text>
						<text class="categroy">{{item.cat}}</text>
						<text class="dian">·</text>
						<text class="wordCount">{{item.wordCount}}字</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import ajax from '../../network/ajax.js'
	import {debounce} from '../../util/util.js'
	export default {
		data() {
			return {
				inputValue: '',
				books: [],
				keyword: [],
			}
		},
		methods: {
			clearClick() {
				console.log('清空输入框')
				this.inputValue = ''
				this.books = []
			},
			// #ifdef H5
			inputClick(e) {
				console.log(e.detail)
				this.inputValue = e.detail.value.trim()
			},
			// #endif
			
			// #ifdef MP-WEIXIN
			inputClick: debounce(function(e) {
				console.log(e[0].detail)
				this.inputValue = e[0].detail.value.trim()
							
				let inputValue = e[0].detail.value.trim()
				if(inputValue) {
					this.getSearchData(inputValue)
				}else {
					this.books = []
				}
			}),
			// #endif
			backClick() {
				uni.navigateBack()
			},
			searchClick() {
				console.log(1111)
				if(this.inputValue.trim()) {
					this.getSearchData(this.inputValue)
				}
			},
			async getSearchData(keyword) {
				const result = await ajax({
					// #ifdef MP-WEIXIN
					// url: 'http://ctzl.top/api/ranking/54d42d92321052167dfb75e3',
					url: 'http://api.zhuishushenqi.com/book/fuzzy-search?query=' + keyword,
					// #endif
			
					// #ifdef H5
					url: '/api/book/fuzzy-search?query=' + keyword
					// #endif
				})
				// console.log(result.data.books)
				this.books = result.data.books
				this.keyword = result.data.books[0].highlight.title
			},
			toDetail(id) {
				uni.navigateTo({
				    url: '../../pages/detail/detail?id=' + id
				});
			}
		},
		computed: {
			newBooks() {
				let newBooks = JSON.parse(JSON.stringify(this.books))
				newBooks.map(item => {
					let patt = '%2F'
					let patt1 = '%3A'
					let patt2 = '/agent/'
					let keyword = this.keyword
					let arr = []
					keyword.forEach(keywordItem => {
						// console.log(item,keywordItem)
						let pat = keywordItem 
						item.title = item.title.replace(new RegExp(pat,'g'),"<span style='color: gold;'>"+pat+"</span>")
						item.shortIntro = item.shortIntro.replace(new RegExp(pat,'g'),"<span style='color: gold;'>"+pat+"</span>")
					})
					if(item.wordCount > 10000) {
						item.wordCount = (item.wordCount/10000).toFixed(2) + '万'
					}else {
						item.wordCount = item.wordCount
					}
					item.cover = item.cover.replace(new RegExp(patt,'g'),'/')
					item.cover = item.cover.replace(new RegExp(patt1,'g'),':')
					item.cover = item.cover.replace(patt2,'')
					return item
				})
				return newBooks
			}
		}
	}
</script>

<style lang="stylus" scoped>
.search	
	.header
		display flex
		align-items center
		height 100rpx
		border-bottom 1rpx solid #eee
		// #ifdef MP-WEIXIN
		padding 0 32rpx
		// #endif
		.left
		.right
			flex-shrink 0
			width 120rpx
			height 100%
			display flex
			align-items center
			justify-content center
			image
				vertical-align middle
				width 40rpx
				height 40rpx
		.center
			flex 1
			height 60rpx
			position relative
			input
				height 100%
				background-color #f5f5f5
				line-height 60rpx
				font-size 24rpx
				color #333
				padding 0 34rpx 0 60rpx
				border-radius 30rpx
			.searchIcon
				position absolute
				height 100%
				display flex
				align-items center
				left 30rpx
				top 0
				z-index 2
				image
					width 28rpx
					height 28rpx
					vertical-align middle
			.cha
				position absolute
				height 100%
				display flex
				align-items center
				right 30rpx
				top 0
				z-index 2
				image
					width 40rpx
					height 40rpx
					vertical-align middle
	.item
		display flex
		padding 0 30rpx
		margin-top 24rpx
		.cover
			margin-right 24rpx
			border 1rpx solid #dedede
			padding 5rpx 0 0 5rpx
			box-sizing border-box
			image
				vertical-align middle
				width 130rpx
				height 176rpx
				border-radius 4rpx
		.info
			.title 
				font-size 28rpx
			.desc
				display -webkit-box
				-webkit-box-orient vertical
				-webkit-line-clamp 2
				overflow hidden
				font-size 24rpx
				color #666666
				margin 17rpx 0
			.other
				font-size 24rpx
				color #666666
				.dian
					margin 0 10rpx
</style>
