<template>
	<view class="profiles">
		<view class="header">
			<view class="h-item" @click="tabCategoryClick('male')">
				<text :class="{'h-item-active': category=='male'}">男生</text>
			</view>
			<view class="h-item" @click="tabCategoryClick('female')">
				<text :class="{'h-item-active': category=='female'}">女生</text>
			</view>
		</view>
		<view class="main">
			<scroll-view scroll-y="true" class="scroll-left" :scroll-top="leftScrollTop">
				<view class="left">
					<view 
						class="left-item" 
						:class="{active: categoryListItemIndex == index}" 
						v-for="(item,index) in categoryList[category]" 
						:key="index" 
						@click="categoryListItemClick(index,item._id)"
					>
						{{item.shortTitle}}
					</view>
					
				</view>
			</scroll-view>
			<scroll-view scroll-y="true"  class="scroll-right" :lower-threshold="50" @scrolltolower="scrolltolower">
				<view class="bookList" v-if="newBookList.length">
					<view class="item" v-for="(item,index) in newBookList" :key="index" @click="toDetail(item._id)">
						<view class="cover">
							<image :src="item.cover" mode=""></image>
						</view>
						<view class="info">
							<rich-text class="title" :nodes="item.title"></rich-text>
							<rich-text class="desc" :nodes="item.shortIntro"></rich-text>
							<view class="other">
								<text class="author">{{item.author}}</text>
								<text class="dian">·</text>
								<text class="categroy">{{item.minorCate}}</text>
								<text class="dian">·</text>
								<text class="wordCount">{{item.latelyFollower}}人气</text>
							</view>
						</view>
					</view>
					<view class="down" v-if="isShow">
						到底了，别再拉了！！！
					</view>
				</view>
				<view class="msg" v-if="msg">
					{{msg}}
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import ajax from '../../network/ajax.js'
	export default {
		data() {
			return {
				category: 'male',
				categoryList: {
					male: [],
					female: []
				},
				currentIndex: 0 ,
				categoryListItemIndex: 0,
				leftScrollTop: 0,
				rankId:'',
				bookList: [],
				total: '',
				start: 0,
				limt: 10,
				isShow: false,
				msg: ''
			}
		},
		onLoad:function(opiton){
			this.isShow = false
			this.getData()
		},
		methods: {
			scrolltolower() {
				console.log('到底了')
				if(this.start < this.total) {
					this.getBookListData()
				}else {
					this.isShow = true
				}
			},
			toDetail(id) {
				uni.navigateTo({
				    url: '../../pages/detail/detail?id=' + id
				});
			},
			categoryListItemClick(index,id) {
				
				this.leftScrollTop = (index - this.categoryListItemIndex) * 50
				this.categoryListItemIndex = index
				this.rankId = id
				if(index !== this.currentIndex) {
					this.start = 0
					this.bookList = []
				}
				this.currentIndex = index
			},
			tabCategoryClick(category) {
				if(category != this.category) {
					this.bookList = []
					this.start = 0
				}
				console.log(category)
				this.category = category
				this.categoryListItemIndex = 0
				this.leftScrollTop = 0
				this.rankId = this.categoryList[category][0]._id
			},
			async getData() {
				const result = await ajax({
					// #ifdef MP-WEIXIN
					// url: `http://ctzl.top/api/book/${id}`,
					url: `http://api.zhuishushenqi.com/ranking/gender`,
					// #endif
					
					// #ifdef H5
					url: `/api/ranking/gender`
					// #endif
				})
				// console.log(result.data)
				this.categoryList.female = result.data.female
				this.categoryList.male = result.data.male
				this.rankId = result.data.male[0]._id
			},
			async getBookListData() {
				const result = await ajax({
					// #ifdef MP-WEIXIN
					// url: `http://ctzl.top/api/book/${id}`,
					url: `http://api.zhuishushenqi.com/ranking/${this.rankId}`,
					// #endif
					
					// #ifdef H5
					url: `/api/ranking/${this.rankId}`
					// #endif
				})
				console.log(result.data)
				if(result.data.ok == true) {
					this.total = result.data.ranking.total
					this.bookList.push(...result.data.ranking.books.slice(this.start,this.start + this.limt))
					this.start = this.start + this.limt
					this.msg = ''
				}else {
					this.msg = '暂时没有相关书籍'
				}
			},
		},
		computed: {
			newBookList() {
				let newBookList = JSON.parse(JSON.stringify(this.bookList))
				newBookList.map(item => {
					let patt = '%2F'
					let patt1 = '%3A'
					let patt2 = '/agent/'
					if(item.latelyFollower > 10000) {
						item.latelyFollower = (item.latelyFollower/10000).toFixed(2) + '万'
					}else {
						item.latelyFollower = item.latelyFollower
					}
					item.cover = item.cover.replace(new RegExp(patt,'g'),'/')
					item.cover = item.cover.replace(new RegExp(patt1,'g'),':')
					item.cover = item.cover.replace(patt2,'')
					return item
				})
				return newBookList 
			}
		},
		watch: {
			async rankId() {
				await this.$nextTick()
				this.getBookListData()
			}
		}
	}
</script>

<style lang="stylus" scoped>
.down
	font-size 28rpx
	text-align center
	color #666666
	margin 12px 15px
	line-height 60rpx
	background-color #eeecdf
.msg
	padding-top 24rpx
	font-size 28rpx
	text-align center
	color #666666
.profiles
	// padding 86rpx 0 50px 0 
	height 100%
	.header
		position fixed
		top 0
		left 0
		right 0
		background-color #FFFFFF
		display flex
		height 43px
		line-height 43px
		border-bottom 1rpx solid #F1F1F1
		z-index 99
		.h-item
			flex 1
			font-size 32rpx
			display flex
			justify-content center
			text
				height 100%
				box-sizing border-box
				&.h-item-active
					color #FFD700
					font-weight 600
					border-bottom 6rpx solid #FFD700
	.main
		height 100%
		padding-top 43px
		box-sizing border-box
		position relative
		.scroll-left
			width 137rpx
			position absolute
			top 43px
			left 0
			bottom 0
			background-color #f8f7f2
			::-webkit-scrollbar
				width 0
				height 0
				background-color transparent
			.left-item
				line-height 50px
				height 50px
				font-size 28rpx
				color #666666
				text-align center
				border-bottom 1rpx solid #eeecdf
				&.active
					background-color #FFFFFF
					border-left 6rpx solid #FFD700
		.scroll-right
			padding-left 137rpx
			padding-top 30rpx
			height 100%
			box-sizing border-box
			.item
				display flex
				padding 0 30rpx
				margin-top 24rpx
				.cover
					margin-right 24rpx
					border 1rpx solid #dedede
					padding 5rpx 0 0 5rpx
					box-sizing border-box
					flex-shrink 0
					image
						vertical-align middle
						width 130rpx
						height 176rpx
						border-radius 4rpx
				.info
					overflow hidden
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
						overflow hidden
						text-overflow ellipsis 
						white-space nowrap
						.dian
							margin 0 10rpx
</style>
