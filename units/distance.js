import api from '@/public/api/index'
let app = getApp()
export default {
	// 获取定位信息
    async getLocation(){
		const currentLocation = app.globalData.currentLocation
		if(currentLocation.wxPosition.provider && currentLocation.wxPosition.provider == 'default'){
			try {
				const crtPosition = await this.reqLocation()
				const crtCityData = await api.getIpAreaCoord(`${crtPosition.longitude},${crtPosition.latitude}`)
				currentLocation.wxPosition = crtPosition
				currentLocation.cityData = crtCityData
			} catch (err) {
				currentLocation.wxPosition = {
					wsq: true,
					latitude: 0,
					longitude: 0,
					provider: 'default',
				}
				currentLocation.cityData = {
					"city": "重庆市",
					"cityCode": "500000",
					"error": "",
					"pro": "重庆市",
					"proCode": "500000",
					"region": "江北区",
					"regionCode": "500105"
				}
				console.error(err)
			}
			
			if (!currentLocation.selectedCityData.isChange) {
				// 设置当前选择的省市
				currentLocation.selectedCityData.pro = currentLocation.cityData.pro
				currentLocation.selectedCityData.city = currentLocation.cityData.city
				try {
					const provinceList = await this.reqProvinceCityList()
					const crtLocationProvinceItem = provinceList.find(item => item.name.replace('省', '').replace('市', '') == currentLocation.selectedCityData.pro.replace('省', '').replace('市', ''))
					if (crtLocationProvinceItem) {
						const crtLocationCityItem = crtLocationProvinceItem.cities.find(item => item.name.replace('市', '') == currentLocation.selectedCityData.city.replace('市', ''))
						currentLocation.selectedCityData.proId = crtLocationProvinceItem.id
						currentLocation.selectedCityData.cityId = crtLocationCityItem.id
					}				
				} catch(err) {}
			}
		}
    },
	// 请求定位信息
	async reqLocation () {
		return new Promise(async (resolve, reject)=>{
			uni.getLocation({
				type: 'wgs84',
				success(res) {
					resolve(res)
				},
				fail(){
					reject("获取定位失败！！！")
				}
			})
		})
	},
	// 请求省份和城市的级联列表
	async reqProvinceCityList () {		
		try {
		  const res = await api.fetchProvinceCityList()
		  if (res.code == 1) {
			return res.data
		  }
		} catch(err) {
		  console.error(err)
		  throw new Error('获取省份和城市信息失败')
		}
	},
    // 百度坐标转火星坐标
    bd_decrypt(bd_lon, bd_lat) {
        var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
        var PI = 3.1415926535897932384626;
        var bd_lon = +bd_lon;
        var bd_lat = +bd_lat;
        var x = bd_lon - 0.0065;
        var y = bd_lat - 0.006;
        var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_PI);
        var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_PI);
        var gg_lng = z * Math.cos(theta);
        var gg_lat = z * Math.sin(theta);
        return [gg_lng, gg_lat]
    },
    /*
         * 获取两个经纬度之间的距离
         * @param lat1 第一点的纬度
         * @param lng1 第一点的经度
         * @param lat2 第二点的纬度
         * @param lng2 第二点的经度
         * @returns {Number}
    */
    countLatLng(lat1, lng1, lat2, lng2) {
        if(!lat1){
          return
        }
        var EARTH_RADIUS = 6378137.0;    //单位M
        var PI = Math.PI;
      
        function getRad(d) {
          return d * PI / 180.0;
        }
      
        var f = getRad((lat1 + lat2) / 2);
        var g = getRad((lat1 - lat2) / 2);
        var l = getRad((lng1 - lng2) / 2);
      
        var sg = Math.sin(g);
        var sl = Math.sin(l);
        var sf = Math.sin(f);
      
        var s, c, w, r, d, h1, h2;
        var a = EARTH_RADIUS;
        var fl = 1 / 298.257;
      
        sg = sg * sg;
        sl = sl * sl;
        sf = sf * sf;
      
        s = sg * (1 - sl) + (1 - sf) * sl;
        c = (1 - sg) * (1 - sl) + sf * sl;
      
        w = Math.atan(Math.sqrt(s / c));
        r = Math.sqrt(s * c) / w;
        d = 2 * w * a;
        h1 = (3 * r - 1) / 2 / c;
        h2 = (3 * r + 1) / 2 / s;
        return (parseInt(d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg))));
    },
    //给每个item计算出distance并加上字段
    addItemDistance(curMapX, curMapY, list) {
        if (!list) return
        list.forEach((item, index) => {
          //百度坐标转火星坐标
          if (item.mapX && item.mapY) {
            var njwd = this.bd_decrypt(item.mapY, item.mapX)
            item.mapX = njwd[1];
            item.mapY = njwd[0];
          }
          // 算出两坐标直线距离
          var distance = 0;
          if (curMapX && curMapY) {
            distance = this.countLatLng(parseFloat(curMapX), parseFloat(curMapY), parseFloat(item.mapY), parseFloat(item.mapX));
            if (distance == 'NaN') {
              distance = 0;
            }
          }
          item.distance = distance;
          
          
        })
        return list
    },
    // x lat
    sortByDistance(curMapX, curMapY,list){
        if (!list) return
        let listWithDistance = this.addItemDistance(curMapX, curMapY, list)
        //根据distance从小到大排列
        return listWithDistance.sort((prev, next) => (+prev.distance) - (+next.distance))
    },
	
	
	// 根据坐标排经销商
	sortDealersByDistance(list){
		let  crtPosition = app.globalData.currentLocation.wxPosition
		let longitude =  crtPosition.longitude
		let latitude   =  crtPosition.latitude
		if(longitude && latitude){
			console.log('用户当前定位',longitude,latitude)
			list.forEach((item,index)=>{
				// item 加距离
				if(item.lngX && item.lngY){
				item.distance  =  this.countLatLng(parseFloat(latitude),parseFloat(longitude),parseFloat(item.lngY),parseFloat(item.lngX))
				console.log(item.name,item.distance)	
				}else{
					item.distance  = Infinity
				}
			// item.distance = 889
			})
			
			
			return list.sort((one,two)=>one.distance - two.distance)
		}else{
			return list
		}
	}

}