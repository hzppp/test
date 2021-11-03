import api from '@/public/api/index'
export default {

	async pay(id, callback) {
		
		// #ifndef MP-WEIXIN
		uni.showToast({
			title: '在微信搜索本小程序参与',
			icon: "none"
		})
		return
		// #endif
		 
		let {
			data = {}
		} = await api.getActivityContent(id)
		if (!data.products || data.products.stock <= 0  ) {
			uni.showToast({
				title: '商品太火爆，被抢完了',
				icon: "none"
			})
			return
		}
		// 留资成功生成订单
		let clueInfo = await api.getClueInfo({
			activityId: id
		})
		let clueDetail
		if (clueInfo.code == 1) clueDetail = clueInfo.data.clueDetail

		// yuchen 测试
		// api.preOrderBack({"op":3,"id":clueInfo.data.orderDetail.orderId})

		//0待支付 1已支付 2待使用 3退款审核中 4已核销 5已退款 6已失效
		if (clueInfo.code == 1 && clueInfo.data.orderDetail && clueInfo.data.orderDetail.orderId && clueInfo.data.orderDetail.orderStatus != 0 ) {
			// 说明有在进行中的到查看订单
			uni.showToast({
				title: "已有支付订单,请勿重复操作",
				icon: "none"
			})
			if (callback) {
				callback(0)
			} else {
				uni.redirectTo({
					url: `/pages/orderDetail?id=${this.content.id}`
				})
			}

			return
		}
		console.log('clueDetail', clueDetail)
		if (!clueDetail) {
			console.log('订单生成失败')
			uni.showToast({
				title: clueInfo.msg,
				icon: "none"
			})
			return
		}
		let data1 = await api.preOrder({
			"clueId": clueDetail.clueId
		})
		if (data1.code = 1 && data1.data) {
			let order = data1.data
			let that = this
			uni.requestPayment({
				provider: 'wxpay', // 平台
				timeStamp: order.timeStamp, // 时间戳
				nonceStr: order.nonceStr, // 随机字符串
				package: order.package, //  统一下单接口返回的 prepay_id 参数值
				signType: order.signType, // 签名算法，暂支持 MD5。
				paySign: order.paySign, // 签名
				success: function(res) {
					console.log('success:' + JSON.stringify(res));
					uni.showToast({
						title: '支付成功',
						icon: "none"
					})
					api.preOrderBack({
						"op": 1,
						"id": order.orderId
					})
					if (callback) {
						callback(1)
					} else {
						uni.redirectTo({
							url: `/pages/orderDetail?id=${order.orderId}&pay=1`
						})
					}

				},
				fail: function(err) {
					uni.showToast({
						title: '支付失败请稍后重试',
						icon: "none"
					})
					console.log('fail:' + JSON.stringify(err));
					api.preOrderBack({
						"op": 3,
						"id": order.orderId
					})


					if (callback) {
						callback(0)
					} else {
						uni.redirectTo({
							url: `/pages/orderDetail?id=${order.orderId}&pay=0`
						})
					}

				},
				complete: () => {
					console.log("payment结束")
				}
			});

		} else {
			uni.showToast({
				title: "商品太火爆，被抢完了",
				icon: "none"
			})
		}


	}
}
