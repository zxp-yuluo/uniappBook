<template>
	<view class="book-info-btns">
		<view class="redBtn btn" @click="readBook">
			立即阅读
		</view>
		<view class="btn" v-if="isAdd" @click="addBookshelf">
			加入书架
		</view>
		<view class="btn" v-else>
			已加入书架
		</view>
		<!-- <view class="btn">
			离线阅读
		</view> -->
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
				isAdd: true
			}
		},
		created() {
			
		},
		methods: {
			addBookshelf() {
				this.isAdd = false
				let books
				if(!uni.getStorageSync('books')) {
					books = []
				}else {
					books = uni.getStorageSync('books')
					books = JSON.parse(books)
				}
				let obj = {}
				obj.cover = this.bookDetail.cover
				obj.title = this.bookDetail.title
				obj.id = this.bookDetail._id
				obj.desc = this.bookDetail.longIntro
				obj.chapter = 0,
				obj.checked = false
				if(books) {
					console.log(books)
					let data = books.filter(item => {
						return item.id == obj.id 
					})
					if(!data.length) {
						books.unshift(obj)
						uni.setStorageSync('books',JSON.stringify(books))
					}
				}else {
					books = []
					books.unshift(obj)
					uni.setStorageSync('books',JSON.stringify(books))
				}
				
			},
			isAddBoolern() {
				let books
				if(!uni.getStorageSync('books')) {
					books = []
				}else {
					books = uni.getStorageSync('books')
					books = JSON.parse(books)
				}
				if(books) {
					let data = books.filter(item => {
						return item.id == this.bookDetail._id
					})
					console.log(data)
					if(data.length) {
						return false
					}else {
						return true
					}
				}else {
					return true
				}
			},
			readBook() {
				// console.log(this.bookDetail._id)
				uni.navigateTo({
					url: '../../pages/readBook/readBook?id=' + this.bookDetail._id + '&title=' + this.bookDetail.title
				})
			}
		},
		watch: {
			async bookDetail() {
				await this.$nextTick()
				this.isAdd = this.isAddBoolern()
			}
		}
	}
</script>

<style scoped lang="stylus">
.book-info-btns
	margin 35rpx 30rpx 0 30rpx
	padding-bottom 30rpx
	display flex
	justify-content space-around
	border-bottom 1px solid #eee
	.btn
		flex 1
		height 70rpx
		// width 182rpx
		line-height 70rpx
		text-align center
		border 1px solid rgb(255, 215, 0)
		border-radius 8rpx
		color rgb(255, 215, 0)
		font-size 32rpx
		&.redBtn
			// width 278rpx
			margin-right 16rpx
			background rgb(255, 215, 0)
			color #fff
</style>

