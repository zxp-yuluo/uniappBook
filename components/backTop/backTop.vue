<template>
	<view class="backTop" v-if="isShow" @click="backTop">
		Top
	</view>
</template>

<script>
	export default {
		props: {
			scrollTop: {
				type: Number,
				value: 0
			}
		},
		data() {
			return {
				height: 900
			}
		},
		methods: {
			backTop() {
				console.log('回到顶部')
				this.$emit('huiDaoDingBu')
			}
		},
		computed: {
			isShow() {
				if(this.scrollTop > this.height) {
					return true
				}else {
					return false
				}
			}
		}
	}
</script>

<style lang="stylus" scoped>
.backTop
	color #007AFF
	background-color #FFFFFF
	border-radius 50%
	width 100rpx
	height 100rpx
	line-height 100rpx
	text-align center
	box-shadow 0 0 10px rgba(0,0,0,.5)
	position fixed
	bottom 80rpx
	right 32rpx
</style>
