<template>
	<view class="detail" id="detail">
		<book-profile :bookDetail="bookDetail" />
		<honor-labels :bookDetail="bookDetail" />
		<book-info-btns :bookDetail="bookDetail" />
		<book-summary :bookDetail="bookDetail" />
		<book-catalogue :bookDetail="bookDetail" />
		<view class="bg"></view>
		<book-comment @lazyMore="lazyMore" :bookComment="bookComment" />
		<loading :status="loading" />
		<back-top :scrollTop="scrollTop" @huiDaoDingBu="huiDaoDingBu" />
	</view>
</template>

<script>
	import ajax from '../../network/ajax.js'
	import bookProfile from '../../components/detail/book-profile.vue'
	import honorLabels from '../../components/detail/honor-labels.vue'
	import bookInfoBtns from '../../components/detail/book-info-btns.vue'
	import bookSummary from '../../components/detail/book-summary.vue'
	import bookCatalogue from '../../components/detail/book-catalogue.vue'
	import bookComment from '../../components/detail/book-comment.vue'
	import loading from '../../components/loading/loading.vue'
	import backTop from '../../components/backTop/backTop.vue'
	export default {
		data() {
			return {
				bookDetail: {},
				bookComment: {},
				limit: 10,
				loading: true,
				id: '',
				scrollTop: 0,
			}
		},
		// created() {
		// 	console.log(this.$route.query.id)
		// },
		onLoad: function(opiton) {
			console.log(opiton.id)
			this.id = opiton.id
			// this.getBookDetailData('59ba0dbb017336e411085a4e')
			// this.getBookCommentData('59ba0dbb017336e411085a4e',10)
			this.getBookDetailData(opiton.id)
			this.getBookCommentData(opiton.id,this.limit)
			
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop
		},
		methods: {
			async huiDaoDingBu() {
				await this.$nextTick()
				uni.createSelectorQuery().select('#detail').boundingClientRect(data=>{//目标节点
				　　uni.createSelectorQuery().select('#detail').boundingClientRect((res)=>{//最外层盒子节点 　　　　
				　　　　uni.pageScrollTo({ 　　　　　　
				　　　　　　duration: 0,//过渡时间必须为0，否则运行到手机会报错
				　　　　　　scrollTop: 0 //滚动到实际距离是元素距离顶部的距离减去最外层盒子的滚动距离（如res.top - data.top）
				　　　　})
				　　}).exec()
				}).exec()
			},
			async getBookDetailData(id) {
				const result = await ajax({
					// #ifdef MP-WEIXIN
					// url: `http://ctzl.top/api/book/${id}`,
					url: `http://api.zhuishushenqi.com/book/${id}`,
					// #endif
					
					// #ifdef H5
					url: `/api/book/${id}`
					// #endif
				})
				console.log(result)
				if(result.errMsg === 'request:ok') {
					this.bookDetail = result.data
				}
			},
			async getBookCommentData(id,limit) {
				const result = await ajax({
					// #ifdef MP-WEIXIN
					// url: `http://ctzl.top/api/post/review/best-by-book?book=${id}&limit=${limit}`,
					url: `http://api.zhuishushenqi.com/post/review/best-by-book?book=${id}&limit=${limit}`,
					// #endif
					
					// #ifdef H5
					url: `/api/post/review/best-by-book?book=${id}&limit=${limit}`
					// #endif
				})
				console.log(result)
				if(result.errMsg === 'request:ok') {
					this.bookComment = result.data
					this.loading = false
				}
			},
			lazyMore() {
				console.log(11111)
				this.limit += 10 
				this.getBookCommentData(this.id,this.limit)
			}
		},
		components: {
			bookProfile,
			honorLabels,
			bookInfoBtns,
			bookSummary,
			bookCatalogue,
			bookComment,
			loading,
			backTop
		}
	}
</script>

<style lang="stylus" scoped>
	.bg
		height 12rpx
		background-color #efefef
</style>
