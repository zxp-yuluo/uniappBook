<template>
	<view class="readBook" id="readBook" :style="{backgroundColor: bgcolor}">
		<!-- 操作 -->
		<view class="page-read-option" v-if="isShow" @click="isShowClick">
			<!-- #ifdef H5 -->
			<view class="header">
				<view class="header-left" @click.stop="backClick">
					返回
				</view>
				<view class="header-center">
					{{book}}
				</view>
				<view class="header-right">
				</view>
			</view>
			<!-- #endif -->
			<view class="footer">
				<view class="fontSize">
					<view class="decrease" @click.stop="decreaseClick">
						Aa-
					</view>
					<view class="increase" @click.stop="increaseClick">
						Aa+
					</view>
				</view>
				<view class="eyeshieldWrap">
					<view class="eyeshield">
						<view class="bgc fcfaef" :class="{active: isActive==='#fff'}" @click.stop="bgcClick('#fff','#666')" style="background-color: #fcfaef;">
							
						</view>
						<view class="bgc fcfaef" :class="{active: isActive==='#fcfaef'}" @click.stop="bgcClick('#fcfaef','#3b3b38')" style="background-color: #fcfaef;">
							
						</view>
						<view class="bgc ecd9ac" :class="{active: isActive==='#ecd9ac'}" @click.stop="bgcClick('#ecd9ac','#4d4d4d')" style="background-color: #ecd9ac;">
							
						</view>
						<view class="bgc b5eecd" :class="{active: isActive==='#b5eecd'}" @click.stop="bgcClick('#b5eecd','#434e43')" style="background-color: #b5eecd;">
							
						</view>
						<view class="bgc efefce" :class="{active: isActive==='#efefce'}" @click.stop="bgcClick('#efefce','#6f4d1b')" style="background-color: #efefce;">
							
						</view>
						<view class="bgc 2f3e3e" :class="{active: isActive==='#2f3e3e'}" @click.stop="bgcClick('#2f3e3e','#a7c0c0')" style="background-color: #2f3e3e;">
							
						</view>
					</view>
				</view>
				<view class="operation">
					<view class="prev" @click.stop="prevClick">
						上一页
					</view>
					<view class="catalogue" @click.stop="catalogueClick">
						目录
					</view>
					<view class="next" @click.stop="nextClick">
						下一页
					</view>
				</view>
			</view>
		</view>
		<!-- 内容 -->
		<scroll-view class="scroll" 
					 :scroll-y="true" 
					 :scroll-top="scrollTop"
					 @click="scrollClick"
					 ref="scroll"
					 id="scroll"
					 :lower-threshold="100"
					 @scrolltolower="scrolltolower"
					 @scroll="scrollEvent"
		>
			<!-- #ifdef H5 -->
				<view class="scroll-title">
					{{title}}
				</view>
			<!-- #endif -->
			<view class="warp" id="warp" ref="warp" :style="{color: textColor,background: bgcolor}">
				<view class="warp-item" v-for="(item,index) in newContent" :key="index">
					<view class="title" :style="{fontSize: tFontSize + 'px'}">
						{{item.title}}
					</view>
					<view class="content">
						<view class="item" v-for="(item,index) in item.cpContent" :key="index" :style="{fontSize: cFontSize + 'px',color: textColor}">
							{{item}}
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<!-- 目录 -->
		<view class="catalogueWrap" @click="isZheZhao" :class="{translate: translate}">
			<view class="catalogue">
				<view class="title">
					目录
				</view>
				<scroll-view scroll-y="true" class="bookScroll" :scroll-top="bookScrollTop" id="bookScroll">
					<view class="bookList">
						<view class="listItem" v-for="(item,index) in chapterList" :class="{activeColor: index == chapter}" @click.stop="toReadBook(item.order)">
							{{item.title}}
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<loading :status="loading" />
	</view>
</template>

<script>
	import ajax from '../../network/ajax.js'
	import loading from '../../components/loading/loading.vue'
	export default {
		data() {
			return {
				id: '',
				sources: [],
				chapterList: [],
				bookContent: [],
				// nextContent: {},
				// prevContent: {},
				chapter: 0,
				loading: true,
				scrollTop: 0,
				old: {
					scrollTop: 0
				},
				height: 0,
				msg: '',
				clHeight: '',
				warpHeight: '',
				title: '',
				chapterHeightArray: [],
				book: '',
				isShow: false,
				tFontSize: 16,
				cFontSize: 14,
				textColor: '#666',
				bgcolor: '#fff',
				isActive: '#fff',
				translate: false,
				bookScrollTop: 0
			}
		},
		onLoad(option) {
			// console.log(option.id)
			this.id = option.id
			this.sourcesData(option.id)
			// #ifdef H5
			this.book = option.title
			// #endif
			// #ifdef MP-WEIXIN
			uni.setNavigationBarTitle({
				title: option.title,
			})
			// #endif
			this.setChapter()
		},
		onReady() {
			this.createBook()
			uni.createSelectorQuery().select('#scroll').boundingClientRect(function (rect) {
				rect.height // 节点的高度
			}, ).exec((res) => {
				// console.log(res)
				this.clHeight = res[0].height
			})
		},
		methods: {
			// 判断是否加入书架 是否临时存储 如过加入了书架，章节选择书架中的。没加入书架，临时存储了，就用临时存储的，两者都没，章节为 0
			setChapter() {
				let books = uni.getStorageSync('books')
				if(books) {
					books = JSON.parse(books)
				}else {
					books = []
				}
				let tempBooks = uni.getStorageSync('tempBooks')
				if(tempBooks) {
					tempBooks = JSON.parse(tempBooks)
				}else {
					tempBooks = []
				}
				let isAddBookshelf = books.find(item => {
					return this.id == item.id
				})
				console.log(isAddBookshelf)
				let isAddTemp = tempBooks.find(item => {
					return this.id == item.id
				})
				console.log(isAddTemp)
				if(isAddBookshelf) {
					this.chapter = isAddBookshelf.chapter
					return
				}
				 
				if(isAddTemp) {
					this.chapter = isAddTemp.chapter
					return
				}
			},
			async toReadBook(chapter) {
				// console.log(chapter)
				this.translate = false
				this.chapter = chapter - 1
				console.log(this.chapter)
				if(this.chapter <= this.chapterList.length) {
					let bookContent = await this.chapterContentData(this.chapterList[this.chapter].link)
					this.bookContent = []
					this.bookContent.push(bookContent)
					console.log(this.bookContent)
					this.title = this.bookContent[0].title
					console.log(this.chapter)
					this.createChapter(this.chapter)
					this.updateChapter(this.chapter)
				}else {
					this.msg="没有下一章了"
					console.log(this.chapter,"没有下一章了")
				}
				this.scrollTop = Number.MIN_VALUE
			},
			isZheZhao() {
				this.translate = false
			},
			catalogueClick() {
				console.log('目录')
				uni.createSelectorQuery().select('#bookScroll').boundingClientRect(function (rect) {
					rect.height // 节点的高度
				}, ).exec((res) => {
					console.log(res)
					this.chapter*40
					let height = parseInt((res[0].height - 40)/2)
					console.log(height,this.chapter*40)
					this.bookScrollTop = (this.chapter + 3)*40 - height
				})
				this.isShow = false
				this.translate = true
			},
			decreaseClick() {
				console.log('decreaseClick')
				if(this.tFontSize <= 16) {
					this.tFontSize = 16
				}else {
					this.tFontSize -= 2
				}
				if(this.cFontSize <= 14) {
					this.cFontSize = 14
				}else {
					this.cFontSize -= 2
				}
			},
			increaseClick() {
				console.log('increaseClick')
				if(this.tFontSize >= 32) {
					this.tFontSize = 32
				}else {
					this.tFontSize += 2
				}
				if(this.cFontSize >= 30) {
					this.cFontSize = 30
				}else {
					this.cFontSize += 2
				}
			},
			bgcClick(bgc,textColor) {
				console.log(bgc,textColor)
				this.textColor = textColor
				this.bgcolor = bgc
				this.isActive = bgc
				let color 
				if(bgc == "#2f3e3e") {
					color = '#ffffff'
				}else {	
					color = "#000000"
				}
				uni.setNavigationBarColor({
					frontColor: color,	//文字颜色
					backgroundColor: bgc	//底部背景色
				})
			},
			backClick() {
				this.$router.back()
			},
			// 书源
			async sourcesData(id) {
				const result = await ajax({
					// #ifdef MP-WEIXIN
					// url: `http://ctzl.top/api/atoc/?view=summary&book=${id}`,
					url: `http://api.zhuishushenqi.com/atoc/?view=summary&book=${id}`,
					// #endif

					// #ifdef H5
					url: `/api/atoc/?view=summary&book=${id}`
					// #endif
				})
				// console.log(result)
				this.sources = result.data
			},
			// 章节数组
			async chapterListData(id) {
				const result = await ajax({
					// #ifdef MP-WEIXIN
					// url: `http://ctzl.top/api/btoc/${id}?view=chapters&channel=mweb`,
					url: `http://api.zhuishushenqi.com/btoc/${id}?view=chapters&channel=mweb`,
					// #endif

					// #ifdef H5
					url: `/api/btoc/${id}?view=chapters&channel=mweb`
					// #endif
				})
				// console.log(result)
				let chapterList = result.data.chapters
				chapterList.forEach(item => {
					item.link = encodeURIComponent(item.link)
				})
				this.chapterList = result.data.chapters
			},
			// 章节详情
			async chapterContentData(link) {
				const result = await ajax({
					// #ifdef MP-WEIXIN
					url: `http://chapter2.zhuishushenqi.com/chapter/${link}`,
					// #endif

					// #ifdef H5
					url: `/content/chapter/${link}`
					// #endif
				})
				// console.log(result.data.chapter)
				return result.data.chapter
			},
			async prevClick() {
				console.log('上一章')
				// console.log(this.chapter)
				if(this.chapter != 0) {
					this.chapter -= 1
					// console.log(this.chapter)
					this.bookContent = []
					let bookContent = await this.chapterContentData(this.chapterList[this.chapter].link)
					this.bookContent.push(bookContent)
					console.log(this.bookContent,'==============')
					this.title = this.bookContent[0].title
					console.log(this.chapter)
					this.createChapter(this.chapter)
					this.updateChapter(this.chapter)
				}else {
					this.msg="已经是第一章了"
					console.log(this.chapter,"已经是第一章了")
				}
				this.scrollTop = 0
			},
			async nextClick() {
				console.log('下一章')
				// console.log(this.chapter,this.chapterList.length)
				if(this.chapter <= this.chapterList.length) {
					this.chapter += 1
					// console.log(this.chapter)
					let bookContent = await this.chapterContentData(this.chapterList[this.chapter].link)
					this.bookContent = []
					this.bookContent.push(bookContent)
					console.log(this.bookContent)
					this.title = this.bookContent[0].title
					console.log(this.chapter)
					this.createChapter(this.chapter)
					this.updateChapter(this.chapter)
				}else {
					this.msg="没有下一章了"
					console.log(this.chapter,"没有下一章了")
				}
				this.scrollTop = Number.MIN_VALUE
				// this.scrollTop = this.old.scrollTop
				// this.$nextTick(function() {
				// 	this.scrollTop = 0
				// });
			},
			scrollClick(e) {
				// let clHeight = document.documentElement.clientHeight || document.body.clientHeight;
				uni.createSelectorQuery().select('#readBook').boundingClientRect(function (rect) {
					rect.id // 节点的ID
					rect.dataset // 节点的dataset
					rect.left // 节点的左边界坐标
					rect.right // 节点的右边界坐标
					rect.top // 节点的上边界坐标
					rect.bottom // 节点的下边界坐标
					rect.width // 节点的宽度
					rect.height // 节点的高度
				}, ).exec((res) => {
					console.log(res)
					this.clHeight = res[0].height
					// let clHeight = this.$refs.scroll.$el.offsetHeight
					let currentY = e.detail.y;
					let offsetY = this.clHeight / 3;
					// console.log(this.clHeight,currentY,offsetY)
					// console.log(this.$refs.scroll.$el.offsetHeight)
					// let height = this.$refs.scroll.$el.offsetHeight
					// console.log(this.clHeight)
					let height = this.clHeight
					if (currentY <= offsetY) {
						console.log('上三分之一')
						this.height = this.height - height
						if(this.height < 0) {
							this.msg="到顶了"
							this.scrollTop = 0
						}else {
							this.scrollTop = this.height
						}
					}else if (offsetY <= currentY && currentY <= offsetY * 2) {
						console.log('中三分之一')
						this.isShow = true
					}else if (currentY >= offsetY * 2 && currentY <= this.clHeight) {
						console.log('下三分之一')
						this.height = this.height + height
						// #ifdef H5
						this.scrollTop = this.height - 60
						// #endif
						
						// #ifdef MP-WEIXIN
						this.scrollTop = this.height - 30
						// #endif
						
					}
				})
				// console.log(e)
			},
			async scrolltolower() {
				console.log('到底了')
				if(this.chapter != this.chapterList.length - 1) {
					this.chapter += 1
					let bookContent = await this.chapterContentData(this.chapterList[this.chapter].link)
					this.bookContent.push(bookContent)
					// this.title = this.chapterList[this.chapter].title
				}
			},
			// 临时把书籍储存到本地
			createBook() {
				let obj = {}
				obj.id = this.id
				obj.chapter = 0
				let tempBooks = uni.getStorageSync('tempBooks')
				if(tempBooks) {
					tempBooks = JSON.parse(tempBooks)
				}else {
					tempBooks = []
				}
				console.log(tempBooks)
				let book = tempBooks.find(item => {
					return this.id == item.id
				})
				console.log(book)
				if(!book) {
					tempBooks.push(obj)
					uni.setStorageSync('tempBooks',JSON.stringify(tempBooks))
				}
			},
			// 章节改变储存到本地
			createChapter(chapter) {
				let tempBooks = JSON.parse(uni.getStorageSync('tempBooks'))
				let bookIndex = tempBooks.findIndex(item => {
					return this.id == item.id
				})
				// console.log(tempBooks,bookIndex)
				tempBooks[bookIndex].chapter = chapter
				uni.setStorageSync('tempBooks',JSON.stringify(tempBooks))
			},
			scrollEvent(event) {
				// console.log(event.detail,'11111')
				// this.old.scrollTop = event.detail.scrollTop
				// #ifdef H5
				this.height = event.detail.scrollTop
				let height = event.detail.scrollTop
				let chapterHeightArray = this.chapterHeightArray
				let currentIndex = 0
				// console.log(chapterHeightArray,height)
				let resultArray = chapterHeightArray.filter(item=> {
					return height < item
				})
				// console.log(chapterHeightArray.indexOf(resultArray[0]))
				currentIndex = chapterHeightArray.indexOf(resultArray[0])
				// console.log(currentIndex,this.bookContent[0],this.bookContent[currentIndex],'--------------------')
				if(this.bookContent.length) {
					this.title = this.bookContent[currentIndex].title
				}
				// #endif
				// console.log(this.chapter)
				this.createChapter(this.chapter)
				this.updateChapter(this.chapter)
			},
			// 更新书架中的章节
			updateChapter(chapter) {
				let books = uni.getStorageSync('books')
				if(books) {
					books = JSON.parse(books)
				}else {
					books = []
				}
				let bookIndex = books.findIndex(item => {
					return this.id == item.id
				})
				// console.log(tempBooks,bookIndex)
				if(bookIndex != -1) {
					books[bookIndex].chapter = chapter
					uni.setStorageSync('books',JSON.stringify(books))
				}
			},
			isShowClick() {
				console.log('遮罩层')
				this.isShow = false
			}
		},
		computed: {
			newContent() {
				// if(this.bookContent.cpContent) {
				// 	let arr = this.bookContent.cpContent.split('\r\n')
				// 	return arr
				// }
				let arr = JSON.parse(JSON.stringify(this.bookContent))
				if(arr.length != 0) {
					arr.forEach(item => {
						item.cpContent = item.cpContent.split('\r\n')
					})
				}
				return arr
			}
		},
		components: {
			loading
		},
		watch: {
			async sources() {
				await this.$nextTick()
				this.chapterListData(this.sources[0]._id)
			},
			async chapterList() {
				await this.$nextTick()
				if(this.chapter != 0) {
					// this.bookContent = await this.chapterContentData(this.chapterList[this.chapter].link)
					let bookContent = await this.chapterContentData(this.chapterList[this.chapter].link)
					// this.prevContent = await this.chapterContentData(this.chapterList[this.chapter-1].link)
					// this.nextContent = await this.chapterContentData(this.chapterList[this.chapter+1].link)
					this.bookContent.push(bookContent)
					this.title = this.chapterList[this.chapter].title
				}else {
					// this.bookContent = await this.chapterContentData(this.chapterList[this.chapter].link)
					// this.nextContent = await this.chapterContentData(this.chapterList[this.chapter+1].link)
					let bookContent = await this.chapterContentData(this.chapterList[this.chapter].link)
					this.bookContent.push(bookContent)
					this.title = this.chapterList[this.chapter].title
				}
				this.loading = false
			},
			async bookContent() {
				await this.$nextTick()
				uni.createSelectorQuery().select('#warp').boundingClientRect(function (rect) {
					rect.height // 节点的高度
				}, ).exec((res) => {
					console.log(res)
					this.warpHeight = res[0].height
				})
				// #ifdef H5
				// console.log(this.$refs.warp.$el.children)
				let arr = Array.from(this.$refs.warp.$el.children)
				if(arr.length == 1) {
					this.chapterHeightArray = []
					this.chapterHeightArray.push(arr[0].offsetHeight)
				}else {
					let childArray = []
					// console.log(arr)
					childArray = arr.reduce((pre,next) => {
						console.log(pre,next)
						return pre + next.offsetHeight
					},0)
					// console.log(childArray)
					this.chapterHeightArray.push(childArray)
					console.log(this.chapterHeightArray.length)
				}
				// #endif	
			}
		}
	}
</script>

<style scoped lang="stylus"> 
#warp
	transition all 1s ease
/deep/::-webkit-scrollbar
	width 0
	height 0
	color: transparent
.readBook
	height 100%
	background-color rgb(195, 212, 230)
	position relative
	.catalogueWrap
		position fixed
		left 0
		top 0
		bottom 0
		right 0
		transform translateX(-100%)
		transition all 1s ease
		&.translate
			transform translateX(0)
		// background-color rgba(0,0,0,.3)
		.catalogue
			background-color #F1F1F1
			height 100%
			width 70%
			.title
				line-height 60px
				padding-left 24rpx
				font-size 32rpx
				color #666666
				border-bottom 1rpx solid #ebebeb
				box-sizing border-box
			.bookScroll
				height calc(100% - 60px)
				.bookList
					padding-left 24rpx
					.listItem
						font-size 24rpx
						line-height 40px
						border-top 1rpx solid #ebebeb
						&:first-of-type
							border-top 0
						&.activeColor
							color #FFD700
	.page-read-option
		position absolute
		left 0
		top 0
		bottom 0
		right 0
		z-index 999
		display flex
		flex-direction column
		justify-content space-between
		.header
			display flex
			align-items center
			text-align center
			font-size 28rpx
			height 80rpx
			line-height 80rpx
			background rgba(0,0,0,.9)
			color #FFFFFF
			.header-left
			.header-right
				flex-shrink 0
				width 100rpx
			.header-center
				flex 1
		.footer
			background rgba(0,0,0,.9)
			color #FFFFFF
			padding-top 24rpx
			// #ifdef MP-WEIXIN
			position absolute
			bottom 0
			left 0
			right 0
			// #endif
			.fontSize
				display flex
				padding 0 24rpx
				margin-bottom 20rpx
				justify-content space-around
				font-size 32rpx
				.decrease
				.increase
					margin 0 10rpx
					width 200rpx
					height 60rpx
					line-height 60rpx
					text-align center
					border 1rpx solid #535353
					border-radius 4rpx 
			.eyeshieldWrap
				display flex
				margin-bottom 20rpx
				padding 0 24rpx
				justify-content space-around
				.eyeshield
					display flex
					.bgc
						flex 1
						margin 0 20rpx
						border-radius 50%
						width 64rpx
						height 64rpx
						&.active
							border: 1rpx solid #f47983;
			.operation
				display flex
				font-size 32rpx
				justify-content space-around
				border-top 1rpx solid #C0C0C0
				.catalogue
					margin 0 10rpx
					flex 1
					text-align center
					line-height 80rpx
				.prev
					flex 1
					text-align center
					line-height 80rpx
					border-right 1rpx solid #C0C0C0
				.next
					flex 1
					text-align center
					line-height 80rpx
					border-left 1rpx solid #C0C0C0
	.scroll
		height 100%
		// #ifdef H5
		padding-top 30px
		// #endif
		box-sizing border-box
		position relative
		// #ifdef H5
		.scroll-title
			position fixed
			left 0
			right 0
			top 0
			margin-left 32rpx
			height 30px
			line-height 30px
			font-size 12rpx
			font-weight 600
			overflow hidden
			text-overflow ellipsis
			white-space nowrap
		// #endif
		.title
			margin 10rpx
			padding 0 32rpx
			font-size 32rpx
			font-weight 600
		.content
			padding 0 32rpx
			.item
				font-size 28rpx
				line-height 1.5
				// #ifdef MP-WEIXIN
				// text-indent 2em
				// #endif
				text-indent 2em
				margin-bottom 10rpx
				color #333
		.change
			display flex
			padding 0 32rpx
			justify-content center
			margin 20rpx 0
			.prev
			.next
				line-height 60rpx
				border 1rpx solid rgb(255, 215, 0)
				border-radius 8rpx
				width 188rpx
				text-align center
				font-size 28rpx
				color rgb(255, 215, 0)
				&.marginRight
					margin-right 20rpx
</style>
