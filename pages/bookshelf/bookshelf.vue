<template>
	<view class="bookshelf">
		<scroll-view scroll-y="true" class="scroll">
			<view class="bookList">
				<view class="itemWrap">
				</view>
				<view class="itemWrap" 
					v-for="(item,index) in newBookList" 
					:key="item.id"  
					@touchmove="handletouchmove(item.id,$event)" 
					@touchstart="handletouchstart" 
					@touchend="handletouchend"
					:class="{transition: currentId === item.id}"
					@click="toReadBook(item.id,item.title)"
				>
					<view class="item">
						<view class="cover">
							<image :src="item.cover" mode="widthFix"></image>
						</view>
						<view class="other">
							<view class="title">
								{{item.title}}
							</view>
							<view class="desc" v-html="item.desc">
							</view>
						</view>
					</view>
					<view class="del" @click.stop="delClick(item.id)">
						<text>删除</text>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				bookList: [],
				startLeft: 0,
				moveLfet: 0,
				currentId: ''
			}
		},
		onShow() {
			let books
			if (!uni.getStorageSync('books')) {
				books = []
			} else {
				books = uni.getStorageSync('books')
				books = JSON.parse(books)
			}
			this.bookList = books
			console.log(books)
		},
		onHide() {
			this.currentId = ''
		},
		methods: {
			delClick(id) {
				this.currentId = ''
				let books
				if(!uni.getStorageSync('books')) {
					books = []
				}else {
					books = uni.getStorageSync('books')
					books = JSON.parse(books)
				}
				console.log(books,id)
				let arr = books.filter(item => {
					return item.id != id
				})
				console.log(arr)
				
				uni.setStorageSync('books',JSON.stringify(arr))
				let books1
				if (!uni.getStorageSync('books')) {
					books1 = []
				} else {
					books1 = uni.getStorageSync('books')
					books1 = JSON.parse(books1)
				}
				this.bookList = books1
			},
			handletouchstart(e) {
				// console.log('移动事件',e)
				this.startLeft = e.changedTouches[0].pageX
				// console.log(this.startLeft)
			},
			handletouchmove(id,$event) {
				// console.log('点击事件',e)
				this.moveLfet = $event.changedTouches[0].pageX
				// console.log(this.moveLfet)
				
				if(this.startLeft-this.moveLfet > 60) {
					// console.log(this.startLeft-this.moveLfet)
					// this.isTransition = true
					this.currentId = id
				}
				if(this.startLeft-this.moveLfet < 60) {
					// console.log(this.startLeft-this.moveLfet)
					// this.isTransition = true
					this.currentId = ''
				}
			},
			handletouchend(e) {
				// console.log('点击结束事件',e)
			},
			toReadBook(id,title) {
				// console.log(id,title)
				uni.navigateTo({
					url: '../../pages/readBook/readBook?id=' + id + '&title=' + title
				})
			}
		},
		computed: {
			newBookList() {
				let newBookList
				if (this.bookList) {
					newBookList = JSON.parse(JSON.stringify(this.bookList))
				}
				let patt2 = '/agent/'
				newBookList.forEach(item => {
					item.cover = item.cover.replace(patt2, '')
					item.cover = decodeURIComponent(item.cover)
				})
				return newBookList
			}
		}
	}
</script>

<style lang="stylus" scoped>
/deep/::-webkit-scrollbar 
	width 0 
	height 0 
	color transparent
.bookshelf
.scroll
	height 100%
.itemWrap
	display flex
	// overflow hidden
	transition all 1s ease
	&.transition
		transform translateX(-80px)
	.del
		width 80px
		background-color rgb(255, 215, 0)
		margin-bottom 40rpx
		flex-shrink 0
		display flex
		justify-content center
		align-items center
		color #FFFFFF
.bookList
	margin 24rpx 32rpx	
	// height 100%
	padding-top 4rpx
	overflow hidden
	.item
		width 100%
		flex-shrink 0
		display flex
		margin-bottom 40rpx
		&:last-child
			margin-bottom 24rpx
		.cover
			flex-shrink 0
			padding-left 4rpx
			image
				width 132rpx
				height 176rpx
				margin-right 20rpx
				box-shadow 0 0 5px rgba(0,0,0,.5)
				vertical-align middle
		.other
			flex 1
			overflow hidden
			display flex
			flex-direction column
			justify-content space-between
			padding 15rpx 0
			.title
				font-size 28rpx
				font-weight 600
				color #666
			.desc
				font-size 26rpx
				display: -webkit-box
				-webkit-box-orient: vertical
				-webkit-line-clamp: 3
				overflow: hidden;
				color #808080
				padding-right 10rpx
</style>
