<template>
	<view class="dengLoadingVue">
		<view class="maskVueHiddenShow" v-if="status" @click="onCheckHiddenApi">
			<view class="maskVueHiddenShowWrapper">
				<image src="https://image.weilanwl.com/gif/rhomb-white.gif" class="maskVueHiddenShowWrapperGif"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			status: false,
		},
		data() {
			return {

			};
		},
		methods: {
			onCheckHiddenApi() {
				
			}
		}
	}
</script>

<style lang="stylus" scoped>
	.dengLoadingVue 
		.maskVueHiddenShow 
			z-index 101
			position fixed
			top: 0
			left: 0
			right: 0
			bottom: 0
			background-color #ccc
			background-color #fff
			// opacity 0.8
			//
			display flex
			align-items center
			justify-content center

			.maskVueHiddenShowWrapper 
				width: 80%
				height: 300rpx
				// background-color red
				display flex
				align-items center
				justify-content center
				transform rotate(90deg)

				.maskVueHiddenShowWrapperGif 
					width 400rpx
					height 300rpx
					// background-color red
</style>
