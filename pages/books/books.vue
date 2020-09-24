<template>
	<view class="books">
		<swiper :circular="true" :autoplay="true" :interval="4000" :duration="1000">
			<block v-for="(item,index) in banner" :key="index">
				<swiper-item>
					<view class="swiper-item">
						<image :src="item.cover" mode="widthFix"></image>
					</view>
				</swiper-item>
			</block>
		</swiper>
		<view class="searchWrap">
			<view class="search" @click="toSearch">
				<image src="../../static/img/iconfont/search.png" mode="" />
				两世欢
			</view>
		</view>
		<hot :hotList="hotList" />
		<book-list :list="list" />
		<loading :status="loading" />
	</view>
</template>

<script>
	import ajax from '../../network/ajax.js'
	import hot from '../../components/books/hot.vue'
	import bookList from '../../components/books/bookList.vue'
	import loading from '../../components/loading/loading.vue'
	export default {
		data() {
			return {
				banner: [{
						id: 111111,
						title: '我家裴先生又苏又撩',
						acthor: '枫独秀',
						cover: 'https://bossaudioandcomic-1252317822.image.myqcloud.com/activity/document/7ce532ea5e051db8ba76359e19c99a42.jpg'
					},
					{
						id: 222222,
						title: '驸马是个高危职业',
						acthor: '拾筝',
						cover: 'https://bossaudioandcomic-1252317822.image.myqcloud.com/activity/document/03168f1bb0fd53d08924f856650c0381.jpg'
					},
					{
						id: 333333,
						title: '他太太才是真大佬',
						acthor: '笑倾一世',
						cover: 'https://bossaudioandcomic-1252317822.image.myqcloud.com/activity/document/a28e365ad786d4225fe55f5a64940ddb.jpg'
					},
					{
						id: 444444,
						title: '恃婚而骄',
						acthor: '妖妖逃之',
						cover: 'https://bossaudioandcomic-1252317822.image.myqcloud.com/activity/document/585086276a8bdd533d74245754a00d3f.jpg'
					}
				],
				hotList: [],
				list: [],
				loading: true
			}
		},
		onLoad() {
			this.getHotListData()
			this.getListData()
		},
		methods: {
			async getHotListData() {
				const result = await ajax({
					// #ifdef MP-WEIXIN
					// url: 'http://ctzl.top/api/ranking/54d42d92321052167dfb75e3',
					url: 'http://api.zhuishushenqi.com/ranking/54d42d92321052167dfb75e3',
					// #endif

					// #ifdef H5
					url: '/api/ranking/54d42d92321052167dfb75e3'
					// #endif
				})
				// console.log(result.data)
				this.hotList = result.data.ranking.books.slice(0, 5)
			},
			async getListData() {
				const result = await ajax({
					// #ifdef MP-WEIXIN
					// url: 'http://ctzl.top/api/ranking/54d43437d47d13ff21cad58b',
					url: 'http://api.zhuishushenqi.com/ranking/54d43437d47d13ff21cad58b',
					// #endif
			
					// #ifdef H5
					url: '/api/ranking/54d43437d47d13ff21cad58b'
					// #endif
				})
				// console.log(result.data)
				this.list = result.data.ranking.books.slice(0, 4)
				this.loading = false
			},
			toSearch() {
				// console.log(11)
				uni.navigateTo({
					url: '../search/search'
				})
			}
		},
		components: {
			hot,
			bookList,
			loading
		}
	}
</script>

<style lang="stylus" scoped>
.books 
	swiper 
		height 284rpx 
		.swiper-item 
			image 
				vertical-align middle 
				width 100% 
	.searchWrap 
		margin-top 24rpx 
		.search 
			margin 0 24rpx 
			display flex 
			justify-content center 
			align-items center 
			font-size 24rpx 
			height 64rpx 
			line-height 1 
			border-radius 32rpx 
			background-color #f2f4f5 
			color grey 
			image 
				margin-right 10rpx 
				width 24rpx 
				height 24rpx
</style>
