/*添加、删除、获取添加车型的本地数据*/

var ContrastCar = {
  /**
   * 设置本地对比车型数据
   * @param {Number} id   车型id
   * @param {String} name 车型名
   * @param {Boolean} status 选中状态，默认为true
   * @return {Object} 已添加对比车型
   */
  add: function(id, name, price, status) {

    var contrastCar = this.get();

    var len = Object.keys(contrastCar); //获取已添加的车型数
    //console.log(contrastCar)

    var key = this._getKey(id);



    if(len.length < 4) {//判断车型是否小于4
      var ret = contrastCar[key] = {};
      ret.id = parseInt(id);
      ret.price = price;
      ret.name = name;
      ret.selected = (status == undefined) ? true : status;
    }else {
      for (var delayKey in contrastCar) {
        if (contrastCar[delayKey].selected == false) {
          delete contrastCar[delayKey];

          var ret = contrastCar[key] = {};
          ret.id = parseInt(id);
          ret.price = price;
          ret.name = name;
          ret.selected = (status == undefined) ? true : status;

          break;
        }
      }
    }

    try {
      uni.setStorageSync('contrastCar', contrastCar)
    } catch (e) {}

    return contrastCar;
  },

  /**
   * 改变对比车型的选择状态
   * @return {Object} 已添加对比车型
   */
  changeStatus: function(id, status) {
    var contrastCar = this.get();

    var key = this._getKey(id);

    if (!contrastCar[key]) return;

    contrastCar[key].selected = status;

    try {
      uni.setStorageSync('contrastCar', contrastCar)
    } catch (e) {}


    return contrastCar;
  },

  /**
   * 删除本地添加车型数据
   * @param  {Number} id 车型id
   * @return {Object}    已添加对比车型
   */
  remove: function(id) {
    var contrastCar = this.get();

    var key = this._getKey(id);

    delete contrastCar[key];

    try {
      uni.setStorageSync('contrastCar', contrastCar)
    } catch (e) {}


    return contrastCar;

  },

  /**
   * 清除本地添加车型数据
   * @return {null} 
   */
  clear: function() {
    try {
      uni.setStorageSync('contrastCar', {})
    } catch (e) {}
  },

  /**
   * 获取已添加对比车型
   * @return {Object} 已选择车型数据
   */
  get: function() {
    var contrastCar = {};
    try {
      contrastCar = uni.getStorageSync('contrastCar') || {};
    } catch (e) {}

    return contrastCar;

  },
  _getKey: function(id) {
    return "id_" + id;
  },

  /**
   * 获取已对比车型
   * @return {Object} 已对比车型数据
   */
  getHadCompare: function() {
    var hadCompareCar = {};
    try {
      hadCompareCar = uni.getStorageSync('hadCompareCar') || {};
    } catch (e) {}

    return hadCompareCar;
  },

  /**
   * 添加已对比车型
   * @return {Object} 已对比车型数据
   */
  addHadCompare: function(addCompare) {
    var hadCompareCar = this.getHadCompare();

    var len = Object.keys(hadCompareCar)
    //console.log(hadCompareCar);
    //console.log(len);
    //console.log(len.length);
    var key = this._getKey(addCompare.id);
    if (!hadCompareCar[key]) {
      if (len.length < 10) {
        var ret = hadCompareCar[key] = {};

        ret.id = addCompare.id;
        ret.price = addCompare.price;
        ret.name = addCompare.name;
        ret.selected = (addCompare.status == undefined) ? true : addCompare.status;
      } else {
        delete hadCompareCar[len[0]];
        var ret = hadCompareCar[key] = {};

        ret.id = addCompare.id;
        ret.price = addCompare.price;
        ret.name = addCompare.name;
        ret.selected = (addCompare.status == undefined) ? true : addCompare.status;
      }
    } else {
      delete hadCompareCar[key];
      var ret = hadCompareCar[key] = {};

      ret.id = addCompare.id;
      ret.price = addCompare.price;
      ret.name = addCompare.name;
      ret.selected = (addCompare.status == undefined) ? true : addCompare.status;
    }

    try {
      uni.setStorageSync('hadCompareCar', hadCompareCar)
    } catch (e) {}

    return hadCompareCar;
  }
}


module.exports = ContrastCar;