<template>
	<view class="category">
		<view class="header">
			<view class="h-item" @click="tabCategoryClick('male')">
				<text :class="{'h-item-active': category=='male'}">男生</text>
			</view>
			<view class="h-item" @click="tabCategoryClick('female')">
				<text :class="{'h-item-active': category=='female'}">女生</text>
			</view>
			<view class="h-item" @click="tabCategoryClick('press')">
				<text :class="{'h-item-active': category=='press'}">出版</text>
			</view>
		</view>
		<view class="itemWrap">
			<view class="item" v-for="(item,index) in newCategoryList[category]" :key="index" @click="toCategoryDateil(category,item.name)">
				<view class="info">
					<view class="title">
						{{item.name}}
					</view>
					<view class="pl">
						
					</view>
					<view class="count">
						{{item.bookCount}}本
					</view>
				</view>
				<view class="cover">
					<image class="img1" :src="item.bookCover[0]" mode=""></image>
					<image class="img2" :src="item.bookCover[1]" mode=""></image>
				</view>
			</view>
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
					'male': [],
					'female': [],
					'press': []
				}
			}
		},
		onLoad() {
			this.getCategoryListData()
		},
		methods: {
			async getCategoryListData() {
				const result = await ajax({
					// #ifdef MP-WEIXIN
					// url: 'http://ctzl.top/api/ranking/54d42d92321052167dfb75e3',
					url: 'http://api.zhuishushenqi.com/cats/lv2/statistics',
					// #endif
			
					// #ifdef H5
					url: '/api/cats/lv2/statistics'
					// #endif
				})
				// console.log(result.data)
				this.categoryList.male = result.data.male
				this.categoryList.female = result.data.female
				this.categoryList.press = result.data.press
				
			},
			tabCategoryClick(category) {
				// console.log(category)
				this.category = category
			},
			toCategoryDateil(gender,major) {
				// console.log(gender,major)
				uni.navigateTo({
					url: '/pages/category/categoryDetail?gender=' + gender + '&major=' + major
				})
			}
		},
		computed: {
			newCategoryList() {
				let list = this.categoryList
				let newList = JSON.parse(JSON.stringify(list))
				// console.log(newList)
				for(var key in newList) {
					// console.log(newList[key])
					newList[key].forEach(item => {
						// console.log(item.bookCover)
						item.bookCover = item.bookCover.map(item => {
							let patt = '%2F'
							let patt1 = '%3A'
							let patt2 = '/agent/'
							let arr = []
							item = item.replace(new RegExp(patt,'g'),'/')
							item = item.replace(new RegExp(patt1,'g'),':')
							item = item.replace(patt2,'')
							return item
						})
						// console.log(item)
					})
				}
				return newList
			},
		}
	}
</script>

<style lang="stylus" scoped>
.category
	.header
		position fixed
		top 0
		left 0
		right 0
		background-color #FFFFFF
		display flex
		height 86rpx
		line-height 86rpx
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
	.itemWrap
		margin 30rpx
		margin-bottom 100rpx
		padding-top 86rpx
		display flex
		flex-wrap wrap
		justify-content space-between
		.item
			margin-bottom 30rpx
			padding 30rpx
			position relative
			background-color #f6f5f6
			border-radius 8rpx 0 0 8rpx
			overflow hidden
			width 332rpx
			box-sizing border-box
			.info
				display flex
				flex-direction column
				justify-content space-between
				.title
					font-size 28rpx
					line-height 45rpx
				.count
				.pl
					font-size 24rpx
					color #666
					height 43rpx
					line-height 43rpx
			.cover
				position absolute
				top 30rpx
				right 0
				.img1
					width 79rpx
					height 107rpx
					margin-top 11.5rpx
					margin-right -55rpx
					vertical-align middle
				.img2
					width 96rpx
					height 130rpx
					vertical-align middle
</style>
