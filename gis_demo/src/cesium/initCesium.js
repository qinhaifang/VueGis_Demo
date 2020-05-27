import $ from "jquery"

var allId = [];
var viewer;
var geoserver = "122.112.180.112:8080";
var A910xinfengPoints = []; // 9+10#煤层进风模拟数据

function loadFlowPoint(layerName) {
    var points = [];
    var flowName = [];
    loadAjax(layerName, function (data) {
        var fea = data.features;
        var indexVal = [];
        if (fea.length > 0) {
            for (var i = 0; i < fea.length; i++) {
                indexVal.push(fea[i].properties.index);
            }
            indexVal.sort();
            flowName = [indexVal[0]];
            for (var i = 1; i < indexVal.length; i++) {
                if (indexVal[i] !== flowName[flowName.length - 1]) {
                    flowName.push(indexVal[i]);
                }
            }
        }
        // 获取当前点图层属性字段信息
        for (var q = 0; q < fea.length; q++) {
            var a = fea[q].properties.Id;
            var b = fea[q].properties.index;
            var c = fea[q].properties.cid;
            var d = fea[q].properties.point_x;
            var e = fea[q].properties.point_y;
            var one = [a, b, c, d, e];
            points.push(one);
        }
    });
    return [points, flowName];
}

// ajax请求要素，调用回调函数
function loadAjax(layerName, callBackFunction) {
    $.ajax({
        url:
            "http://" +
            geoserver +
            "/geoserver/MaJunYv/ows?service=WFS" +
            "&version=1.0.0" +
            "&request=GetFeature" +
            "&typeName=MaJunYv%3A" +
            layerName +
            "&maxFeatures=5000" +
            "&outputFormat=application%2Fjson",
        cache: false,
        async: false,
        success: callBackFunction,
        error: function (data) {
        }
    });
}

 function removeAll(viewer) {
    for (let i = 0; i < allId.length; i++) {
        let select = viewer.entities.getById(allId[i][1]);
        viewer.entities.remove(select);
    }
}

function removeLayer(name) {
    for (let i = 0; i < allId.length; i++) {
        if (allId[i][0] === name) {
            let select = viewer.entities.getById(allId[i][1]);
            viewer.entities.remove(select);
        }
    }
}

function findlayer(name) {
    let isLayerLoad = false;
    for (let i = 0; i < allId.length; i++) {
        if (allId[i][0] === name) {
            isLayerLoad = true;
            break;
        }
    }
    return isLayerLoad;
}

// 加载图层,图层类型、图层url名称
function loadLayer(viewer, name) {
    var layerName;
    switch (name) {
        case "renYuan":
            layerName = "A910renYuan";
            break;
        case "diaoDu":
            layerName = "A910diaoDu";
            break;
        case "jianKong":
            layerName = "A910jianKong";
            break;
        case "guangBo":
            layerName = "A910guangBo";
            break;
        case "jiDian":
            layerName = "A910jiDian";
            break;
        case "chuanGanQi":
            layerName = "A910point";
            break;
    }
    loadAjax(layerName, function (data) {
        var points = [];
        // 获取当前点图层属性字段信息
        if (name == "chuanGanQi") {
            for (var q = 0; q < data.features.length; q++) {
                let Id = data.features[q].properties.id;
                let POINT_X = data.features[q].properties.point_x;
                let POINT_Y = data.features[q].properties.point_y;
                let inOutType = data.features[q].properties.inouttype;
                let pointCode = data.features[q].properties.pointcode;
                let pointName = data.features[q].properties.pointname;
                let pointType = data.features[q].properties.pointtype;
                let staCode = data.features[q].properties.stacode;
                points[q] = [Id, POINT_X, POINT_Y, inOutType, pointCode, pointName, pointType, staCode];
            }
        } else {
            for (var q = 0; q < data.features.length; q++) {
                let Id = data.features[q].properties.id;
                let name = data.features[q].properties.name;
                let POINT_X = data.features[q].properties.point_x;
                let POINT_Y = data.features[q].properties.point_y;
                let pointName = data.features[q].properties.pointname;
                let pointCode = data.features[q].properties.pointcode;
                points[q] = [Id, name, POINT_X, POINT_Y, pointName, pointCode];
            }
        }

        // 加载其他图层
        function loadEntity(imgPath) {
            for (var i = 0; i < points.length; i++) {
                try {
                    viewer.entities.add({
                        id: name + points[i][0] + points[i][2],
                        description: name + ":" + points[i][4],
                        position: Cesium.Cartesian3.fromDegrees(points[i][2], points[i][3]),
                        billboard: {
                            scale: 3,
                            show: true,
                            image: imgPath,
                            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                            color: Cesium.Color.fromCssColorString("#effdff").withAlpha(1.0),
                            width: 10,
                            height: 15,
                            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(5.0, 8000.0),
                        }
                    });
                    allId.push([name, name + points[i][0] + points[i][2]]);
                } catch (e) {
                    console.log(e);
                }
            }
        }

        // 加载传感器图层
        function loadPointEntity(imgPath, lon, lat) {
            try {
                viewer.entities.add({
                    id: name + points[i][0] + lon,
                    description: name + ":" + points[i][7] + "+" + points[i][4],  // 分站code + pointcode
                    position: Cesium.Cartesian3.fromDegrees(lon, lat),
                    billboard: {
                        scale: 3,
                        show: true,
                        image: imgPath,
                        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                        color: Cesium.Color.fromCssColorString("#effdff").withAlpha(1.0),
                        width: 10,
                        height: 15,
                        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(5.0, 17000.0),
                    }
                });
                allId.push([name, name + points[i][0] + lon]);
            } catch (e) {
                console.log(e);
            }
        }

        // 图层类型选择
        switch (name) {
            case "renYuan":
                loadEntity(require("../assets/人员定位.png"));
                break;
            case "diaoDu":
                loadEntity(require("../assets/调度通讯.png"));
                break;
            case "jianKong":
                loadEntity(require("../assets/视频监控.png"));
                break;
            case "guangBo":
                loadEntity(require("../assets/广播.png"));
                break;
            case "jiDian":
                loadEntity(require("../assets/机电设备.png"));
                break;
            case "chuanGanQi":
                for (var i = 0; i < points.length; i++) {
                    var typeName = points[i][6];
                    var inOutType = points[i][3];
                    if (inOutType == 1) {
                        switch (typeName) {
                            case 1:  // 低浓度甲烷
                                loadPointEntity(require("../assets/甲烷.png"), points[i][1], points[i][2]);
                                break;
                            case 2:  // 高低浓度甲烷
                                loadPointEntity(require("../assets/甲烷.png"), points[i][1], points[i][2]);
                                break;
                            case 7:   // 高浓度甲烷
                                loadPointEntity(require("../assets/甲烷.png"), points[i][1], points[i][2]);
                                break;
                            case 3:   // 风速
                                loadPointEntity(require("../assets/风速传感器.png"), points[i][1], points[i][2]);
                                break;
                            case 4:   // CO
                                loadPointEntity(require("../assets/CO传感器.png"), points[i][1], points[i][2]);
                                break;
                            case 5:   // 温度
                                loadPointEntity(require("../assets/温度传感器.png"), points[i][1], points[i][2]);
                                break;
                            case 23:  // 水位
                                loadPointEntity(require("../assets/水位传感器.png"), points[i][1], points[i][2]);
                                break;
                            case 28:  // 烟雾
                                loadPointEntity(require("../assets/烟雾传感器.png"), points[i][1], points[i][2]);
                                break;
                            case 29:  // 风量
                                loadPointEntity(require("../assets/风量传感器.png"), points[i][1], points[i][2]);
                                break;
                            case 37:  // 粉尘
                                loadPointEntity(require("../assets/粉尘传感器.png"), points[i][1], points[i][2]);
                                break;
                            case 99:  // 其它
                                loadPointEntity(require("../assets/其他模拟量传感器.png"), points[i][1], points[i][2]);
                                break;
                        }
                    } else {
                        switch (typeName) {
                            case 2:  // 局扇开停
                                loadPointEntity(require("../assets/局扇开停传感器.png"), points[i][1], points[i][2]);
                                break;
                            case 3:  // 主扇开停
                                loadPointEntity(require("../assets/主扇开停传感器.png"), points[i][1], points[i][2]);
                                break;
                            case 4:   // 馈电开停
                                loadPointEntity(require("../assets/馈电传感器.png"), points[i][1], points[i][2]);
                                break;
                            case 6:   // 风门
                                loadPointEntity(require("../assets/风门传感器.png"), points[i][1], points[i][2]);
                                break;
                            case 7:   // 风筒
                                loadPointEntity(require("../assets/风筒传感器.png"), points[i][1], points[i][2]);
                                break;
                            case 8:   // 烟雾
                                loadPointEntity(require("../assets/烟雾传感器.png"), points[i][1], points[i][2]);
                                break;
                            case 9:  // 水泵开停
                                loadPointEntity(require("../assets/水泵开停传感器.png"), points[i][1], points[i][2]);
                                break;
                        }
                    }
                }
                break;
        }

    });
}

// 渲染煤流风流动画,流动样式类型、点经纬度数组、材质颜色、动画速度
function addFlow(viewer, pointsInfo, color, speed) {
    for (var i = 0; i < pointsInfo.length; i++) {
        var id = pointsInfo[i][0] + i + "fengLiu";
        try {
            viewer.entities.add({
                id: id,
                polyline: {
                    positions: Cesium.Cartesian3.fromDegreesArrayHeights(
                        pointsInfo[i][1]
                    ),
                    width: 11,
                    material: new Cesium.PolylineTrailLinkMaterialProperty(
                        color,
                        speed
                    ),
                    clampToGround: true
                }
            });
            allId.push(["fengLiu", id]);
        } catch (e) {
            console.log(e);
        }
    }
}

function loadFlow(viewer) {
    if (A910xinfengPoints.length == 0) {
        var A910points = [];
        let result = loadFlowPoint("A910jinFeng");
        A910points.push(["A910jinFeng", result[0], result[1]]);
        for (var i = 0; i < A910points.length; i++) {
            var flow = A910points[i];
            var flowName = flow[2];
            var flowCount = flow[1];
            var getpoint = [];
            for (var j = 0; j < flowName.length; j++) {
                var point = [];
                for (var k = 0; k < flowCount.length; k++) {
                    if (flowName[j] === flowCount[k][1]) {
                        point.push(flowCount[k][3], flowCount[k][4], 2500);
                    }
                }
                getpoint.push([flowName[j], point]);
            }
            for (var j = 0; j < getpoint.length; j++) {
                A910xinfengPoints.push(getpoint[j]);
            }
        }
    }
    addFlow(viewer, A910xinfengPoints, Cesium.Color.BLUE, 3000);
}


export default {

    initmap:function(cesiumContainer) {
        function createCustomMaterial() {
            function PolylineTrailLinkMaterialProperty(color, duration) {
                this._definitionChanged = new Cesium.Event();
                this._color = undefined;
                this._colorSubscription = undefined;
                this.color = color;
                this.duration = duration;
                this._time = new Date().getTime();
            }
            Object.defineProperties(PolylineTrailLinkMaterialProperty.prototype, {
                isConstant: {
                    get: function() {
                        return false;
                    }
                },
                definitionChanged: {
                    get: function() {
                        return this._definitionChanged;
                    }
                },
                color: Cesium.createPropertyDescriptor("color")
            });
            // 返回材质类型名称
            PolylineTrailLinkMaterialProperty.prototype.getType = function(time) {
                return "PolylineTrailLink";
            };
            // 返回材质动画持续时间、初始化颜色
            PolylineTrailLinkMaterialProperty.prototype.getValue = function(
                time,
                result
            ) {
                if (!Cesium.defined(result)) {
                    result = {};
                }
                result.color = Cesium.Property.getValueOrClonedDefault(
                    this._color,
                    time,
                    Cesium.Color.WHITE,
                    result.color
                );
                result.image = Cesium.Material.PolylineTrailLinkImage;
                result.time =
                    ((new Date().getTime() - this._time) % this.duration) / this.duration;
                return result;
            };

            // 检测定义了相同材质的entity，避免冲突
            PolylineTrailLinkMaterialProperty.prototype.equals = function(other) {
                return (
                    this === other ||
                    (other instanceof PolylineTrailLinkMaterialProperty &&
                        other.equals(this._color, other._color))
                );
            };

            // 材质图像、webGL编码
            Cesium.PolylineTrailLinkMaterialProperty = PolylineTrailLinkMaterialProperty;
            Cesium.Material.PolylineTrailLinkType = "PolylineTrailLink";
            Cesium.Material.PolylineTrailLinkImage = require("../assets/red.png");
            Cesium.Material.PolylineTrailLinkSource =
                "czm_material czm_getMaterial(czm_materialInput materialInput)\n\
                                                              {\n\
                                                                   czm_material material = czm_getDefaultMaterial(materialInput);\n\
                                                                   vec2 st = materialInput.st;\n\
                                                                   vec4 colorImage = texture2D(image, vec2(fract(st.s - time), st.t));\n\
                                                                   material.alpha = colorImage.a * color.a;\n\
                                                                   material.diffuse = color.rgb;\n\
                                                                   return material;\n\
                                                               }";

            // 调用cesium方法，在material材质缓存中加入自定义材质，临时
            Cesium.Material._materialCache.addMaterial(
                Cesium.Material.PolylineTrailLinkType,
                {
                    fabric: {
                        type: Cesium.Material.PolylineTrailLinkType,
                        uniforms: {
                            color: new Cesium.Color(1.0, 0.0, 0.0, 0.5),
                            image: Cesium.Material.PolylineTrailLinkImage,
                            time: 0
                        },
                        source: Cesium.Material.PolylineTrailLinkSource
                    },
                    translucent: function(material) {
                        return true;
                    }
                }
            );
        }
        createCustomMaterial();
        // 初始化一个view视图
        viewer = new Cesium.Viewer(cesiumContainer, {
            // 将图片背景覆盖至全球
            imageryProvider: new Cesium.SingleTileImageryProvider({
                url: require("../assets/bg.png"),
                rectangle: Cesium.Rectangle.fromDegrees(-180, -90, 180, 90)
            }),
            sceneMode: Cesium.SceneMode.SCENE3D, // 视图模式 SCENE3D、SCENE2D、COLUMBUS_VIEW（2.5D）
            shouldAnimate: true, // 显示动画
            navigationInstructionsInitiallyVisible: true,
            animation: false, // 动画控制器
            baseLayerPicker: false, // 地图切换器
            fullscreenButton: false, // 全屏按钮
            geocoder: false,
            timeline: false, // 时间线
            vrButton: false, // VR按钮
            homeButton: false, // HOME按钮
            infoBox: false, // cesium默认弹出框
            selectionIndicator: false, // cesium选择器
            sceneModePicker: false, // 视图模式切换
            navigationHelpButton: false // cesium操作提示
        });
        // 清除cesium默认双击绑定事件
        viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
            Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
        );
        // 清除cesium默认左键绑定事件
        viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
            Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
        );
        // 地形深度测试
        viewer.scene.globe.depthTestAgainstTerrain = false;
        // cesium鼠标拖动
        viewer.scene.screenSpaceCameraController.enableRotate = true;
        // cesium鼠标滚轮按下后旋转
        viewer.scene.screenSpaceCameraController.enableTilt = false;
        viewer._cesiumWidget._creditContainer.style.display = "none";
        return viewer
    },
    removeAll:function(viewer) {
        for (let i = 0; i < allId.length; i++) {
            let select = viewer.entities.getById(allId[i][1]);
            viewer.entities.remove(select);
        }
    },
    tabcesium: function (layer) {
        removeAll(viewer);
        for (let i = 0; i < layer.length; i++) {
            if (layer[i] == "fengLiu") {
                loadFlow(viewer);
            } else {
                loadLayer(viewer, layer[i]);
            }
        }
    }
}
