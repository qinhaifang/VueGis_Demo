<template>
  <div class="map-box">
    <div id="cesiumContainer"></div>
  </div>
</template>

<script>
  import $ from "jquery"
  import ces from "../../cesium/initCesium"
  export default {
    name: "cesiumview",
    mounted() {
      var viewer = this.$initCesium.initmap("cesiumContainer");
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
                112.278022504,
                36.833505785,
                4000.0
        ),
        duration: 0
      });


      var geoserver = "122.112.180.112:8080";
      // this.$initCesium.tabcesium(["fengLiu"]);
      // 9+10#煤层巷道
      Cesium.GeoJsonDataSource.load(
              "http://" +
              geoserver +
              "/geoserver/MaJunYv/ows?service=WFS" +
              "&version=1.0.0" +
              "&request=GetFeature" +
              "&typeName=MaJunYv%3Ahd910Layer" +
              "&maxFeatures=10" +
              "&outputFormat=application%2Fjson",
              {
                clampToGround: true
              }
      ).then(function(dataSource) {
        viewer.dataSources.add(dataSource);
        var entities = dataSource.entities.values;
        for (var i = 0; i < entities.length; i++) {
          var r = entities[i];
          r.polyline.width = 3; //添加默认样式

          r.polyline.material = new Cesium.PolylineGlowMaterialProperty({
            color: Cesium.Color.WHITE.withAlpha(0.9),
            taperPower: 100
          });
        }
      });
      // end
    }
  };
</script>
<style scoped>
  *{
    margin: 0;
    padding: 0;
  }
  body{
    width: 100%;
    height:100%;
  }
  .map-box {
    width: 100%;
    height: 100%;
  }
  #cesiumContainer {
    width: 100%;
    height: 100%;
  }
</style>
