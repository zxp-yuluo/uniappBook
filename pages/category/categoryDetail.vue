<template>
	<view class="categoryDateil">
		<view class="type">
			<view 
				class="type-item" 
				:class="{active: type == item.type}" 
				v-for="(item,index) in selectBar" 
				:key="index" 
				@click="tabTypeClick(item.type)"
			>
				{{item.name}}
			</view>
		</view>
		<view class="mins">
			<view
				class="mins-item" 
				:class="{active: minor == ''}" 
				@click="tabMajorClick('')"
			>
				全部
			</view>
			<view 
				class="mins-item" 
				:class="{active: minor == item}" 
				v-for="(item,index) in categoryItem.slice(0,4)" 
				:key="index" 
				@click="tabMajorClick(item)">
				{{item}}
			</view>
		</view>
		<scroll-view scroll-y="true" class="scroll" :lower-threshold="50" @scrolltolower="scrolltolower" @scroll="scrollHandle" :scroll-top="sTop">
			<loading :status="loading" />
			<back-top :scrollTop="scrollTop" @huiDaoDingBu="huiDaoDingBu" />
			<view class="bookList" v-if="newBookList">
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
			</view>
			<view class="msg" v-if="!!msg">
				{{msg}}
			</view>
			
		</scroll-view>
	</view>
</template>

<script>
	import ajax from '../../network/ajax.js'
	import loading from '../../components/loading/loading.vue'
	import backTop from '../../components/backTop/backTop.vue'
	export default {
		data() {
			return {
				selectBar: [
					{ name: '热门', type: 'hot' },
					{ name: '新书', type: 'new' },
					{ name: '好评', type: 'reputation' },
					{ name: '完结', type: 'over'},
					{ name: '包月', type: 'monthly' }
				],
				gender: '',
				major: '',
				minor: '',
				type: 'hot',
				category: {},
				bookList: [],
				loading: true,
				msg: '',
				start: 0,
				limit: 10,
				scrollTop: 0,
				sTop: 0,
				old: {
					sTop: 0
				}
			}
		},
		onLoad(option) {
			// console.log(option.gender,option.major)
			this.gender = option.gender
			this.major = option.major
			uni.setNavigationBarTitle({
				title: option.major
			})
			this.get()
			this.getListData()
		},
		methods: {
			async huiDaoDingBu() {
				console.log('huiDaoDingBu')
				this.sTop = this.old.sTop
				await this.$nextTick()
				this.sTop = 0
			},
			scrollHandle(e) {
				// console.log(e.detail)
				this.old.sTop =  e.detail.scrollTop
				this.scrollTop = e.detail.scrollTop
			},
			toDetail(id) {
				uni.navigateTo({
				    url: '../../pages/detail/detail?id=' + id
				});
			},
			tabTypeClick(type) {
				console.log(type)
				this.start = 0
				this.bookList = []
				this.type = type
				this.getListData()
			},
			tabMajorClick(major) {
				this.start = 0
				this.bookList = []
				console.log(major)
				this.minor = major
				this.getListData()
			},
			scrolltolower() {
				console.log('到底了',this.newBookList.length)
				this.start = this.newBookList.length
				this.getListData()
			},
			async get() {
				let result = await ajax({
					// #ifdef H5
					url: `/api/cats/lv2`,
					// #endif
					
					// #ifdef MP-WEIXIN
					url: `http://api.zhuishushenqi.com/cats/lv2`,
					// #endif
				})
				console.log(result)
				this.category = result.data
			},
			async getListData() {
				// this.loading = true
				this.msg = ''
				// this.bookList = []
				let result = await ajax({
					// #ifdef H5
					url: `/api/book/by-categories?gender=${this.gender}&type=${this.type}&major=${this.major}&minor=${this.minor}&start=${this.start}&limit=${this.limit}`,
					// #endif
					
					// #ifdef MP-WEIXIN
					url: `http://api.zhuishushenqi.com/book/by-categories?gender=${this.gender}&type=${this.type}&major=${this.major}&minor=${this.minor}&start=${this.start}&limit=${this.limit}`,
					// #endif
				})
				// console.log(result.data.books)
				if(result.data.ok) {
					if(result.data.books.length != 0) {
						this.bookList.push(...result.data.books)
					}else {
						this.msg = '暂无数据'
					}
					await this.$nextTick()
					this.loading = false
				}
			}
		},
		computed: {
			categoryItem() {
				if(this.category[this.gender]) {
					// console.log(this.category[this.gender])
					let arr = this.category[this.gender]
					return arr.find(item => {
						return item.major == this.major
					}).mins
				}
			},
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
			
		},
		components: {
			loading,
			backTop
		}
	}
</script>

<style lang="stylus" scoped>
.msg
	padding 20rpx
	text-align center
	color #666666
	font-size 18rpx
	box-sizing border-box
.scroll
	height calc(100% - 102px)
	box-sizing border-box
	position relative
.categoryDateil
	height 100%
	.type
	.mins
		height 50px
		line-height 50px
		display flex
		border-bottom 1rpx solid #f2f2f2
		flex-wrap wrap
		.type-item
		.mins-item
			font-size 26rpx
			color #333333
			padding 0 12rpx
			&.active
				color #007AFF
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
