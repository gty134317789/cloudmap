var collections=new Array()
Page({
  //定义数据段
  data:{
    //collections存储展示的数据，centrex与y用来存储当前用户的位置，默认是上海市
    showData:collections,
    centerX: 121.50515,
    centerY: 31.26451,
    //标记markers
    markers: [],
    //控制markers的相关参数
    controls: [{
      id: 1,
      iconPath: '/pages/images/location.png',
      position: {
        left: 0,
        top: 10,
        width: 10,
        height: 10
      },
      clickable: true
    }],
    //存储图片、名字和简介
    mapimage:"",
    name: "",
    introduce:""
   
 },

 //在小程序运行时定位并操作
  onLoad:function(option){
    let that = this
    //连接mysql
    this.connectMysql()
    console.log('开始定位')
    //获取用户定位
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        console.log(res)
        let latitude = res.latitude;
        let longitude = res.longitude;
    
        that.setData({
          centerX: longitude,
          centerY: latitude,
        })

      },
      fail: (res) => {
        console('定位失败')
      }
    });
  },
  
  //请求景点信息
  requestshoplist: function () {
    let that = this
    //that.setData用来设置小程序的数据
    that.setData({
      showData:collections
    })
    //console.log(collections)
    //console.log(111)
    let markers = [];
    console.log(that.data.showData)
    for (let i = 0; i <that.data.showData.length; i++) { 
      let marker = that.createMarker(that.data.showData[i]);
      markers.push(marker)     
    }    
    console.log(markers.introduce)                

//测试用，观察数据是否传入
let shopitem = that.data.showData[1]
console.log(shopitem.introduce);

//返回参数
that.setData({
  markers: markers,
  mapimage: shopitem.image,
  name: shopitem.name,
  introduce:shopitem.introduce
})
  },

  //标点函数，在地图上创建标点
  createMarker(point) {
    let marker = {
      iconPath: "../images/location.png",
      id: point || 0,
      name: point.name || '',
      latitude: point.lat,
      longitude: point.lng,
      width: 20,
      height: 20,
    };
    return marker;
  },
  //当点击标点时，标点的操作
  markertap: function (shopitem) {
    let that = this
    //console.log(shopitem.introduce);
    that.setData({
      mapimage:shopitem.markerId.image, 
      name: shopitem.markerId.name,
      introduce:shopitem.markerId.introduce
    })
  },

 //连接数据库函数，使用云函数方式
  connectMysql() {
    console.log("开始从数据库获取数据")
    wx.cloud.callFunction({
      name: "mysql",
      success(res) {
        console.log("获取数据成功", res)
        //console.log("成功", res.result.length)
        //定义一个数组存储数据
        for (let i = 0; i < res.result.length; i++) {
        collections.push(JSON.parse(JSON.stringify(res.result[i])))
      }
        //console.log(collections[0].f1)
        //传入标记点
         let markers=[]
         for (let i=0;i<collections.length;i++){
            let marker = collections[i]
            markers.push(marker)
         }
         
         console.log("数据共有：",collections.length,"条")
         console.log(collections)
        return collections;
      },
      fail(res) {
        console.log("获取数据失败", res)
      }
    })
  }
})