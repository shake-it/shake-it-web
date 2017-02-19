'use strict';
(function(angular) {
  var app = angular.module('SensorTest', ['ng', 'ngRoute', 'ngResource']);
  
  app.controller('indexController', function($scope) {
    var index = this;
    
    // dataPoints
		var dataPointsZrecorging = [];
		var dataPointsZplaying = [];
		//var dataPointsX = [];
		//var dataPointsY = [];
    
    var sharedData = location.search.substr(1);
    if (sharedData.length > 0) {
      dataPointsZrecorging = sharedData.split('&').map(function(o, i) {
        return {
          x: i,
          y: Number(o)
        }
      });
    }
    
    index.isRecordingOn = false;
    
    index.isPlayingOn = false;
    
    index.time = new Date();
    
    index.deviceorientation = {};
    
    index.startorientation = null;
    
    index.share = function() {
      var data = dataPointsZrecorging.map(function(o) { return o.y.toFixed(2)}).join('&');
      window.location = ('?' + data);
    };
    
    index.formatData = function() {
      return JSON.stringify(index.deviceorientation, 1, 1);
    };
    
    window.toggleRecording = function () {
      $scope.$apply(index.toggleRecording);
    }
    index.toggleRecording = function() {
      index.isRecordingOn = !index.isRecordingOn;
      if (index.isRecordingOn) {
        index.isPlayingOn = false;
        index.startorientation = null;
        dataPointsZrecorging.length = 0;
        dataPointsZplaying.length = 0;

        //dataPointsX.length = 0;
        //dataPointsY.length = 0;
      }
    };
    
    index.canPlay = function() {
      return dataPointsZrecorging.length > 1;
    };
    
    window.togglePlaying = function() {
      $scope.$apply(index.togglePlaying);
    };
    index.togglePlaying = function() {
      index.isPlayingOn = !index.isPlayingOn;
      
      if (index.isPlayingOn) {
        index.startorientation = null;
        dataPointsZplaying.length = 0;
      }
    };
    
    window.addEventListener("deviceorientation", function(event) {
      $scope.$apply(function() {
        index.deviceorientation.absolute = event.absolute;
        index.deviceorientation.z = event.alpha || 0;
        index.deviceorientation.x = event.beta || 0;
        index.deviceorientation.y = event.gamma || 0;
        
        if (!index.startorientation) {
          index.startorientation = {
            z: index.deviceorientation.z, 
            x: index.deviceorientation.x, 
            y: index.deviceorientation.y, 
          };
          
          if (dataPointsZrecorging.length == 0) {
            dataPointsZrecorging.push({
              x: dataPointsZrecorging.length,
              y: 0
            });
          }
        }
      });
    }, true);
    
    setInterval(function() {
      //var time = new Date().getTime();
      
      var start = index.startorientation || {};

      if (index.isRecordingOn) {
        dataPointsZrecorging.push({
          x: dataPointsZrecorging.length,
          y: -(index.deviceorientation.y - start.y || 0)
        });
      }
      if (index.isPlayingOn && dataPointsZplaying.length < dataPointsZrecorging.length) {
        dataPointsZplaying.push({
          x: dataPointsZplaying.length,
          y: -(index.deviceorientation.y - start.y || 0)
        });
      }
      //if (dataPointsZ.length > 100) { dataPointsZ.shift() }
      /*
      dataPointsX.push({
        x: time,
        y: index.deviceorientation.x - start.x || 0
      });
      if (dataPointsX.length > 100) { dataPointsX.shift() }
      dataPointsY.push({
        x: time,
        y: index.deviceorientation.y - start.y || 0
      });
      if (dataPointsY.length > 100) { dataPointsY.shift() }
      //*/

        
    }, 20);

    
    
    //=================================================================

		var chart = new CanvasJS.Chart("chartContainer", {
			zoomEnabled: false,
			/*title: {
				text: "Sensor data"		
			},*/
			toolTip: {
				shared: true
				
			},
			/*legend: {
				verticalAlign: "top",
				horizontalAlign: "center",
        fontSize: 14,
				fontWeight: "bold",
				fontFamily: "calibri",
				fontColor: "dimGrey"
			},*/
			axisX: {
				//title: "Rotation over time"
			},
			axisY:{
				prefix: '',
				includeZero: true
			}, 
			data: [{ 
				// dataSeries1
				type: "line",
				xValueType: "number",
				showInLegend: true,
				name: "Teacher",
				dataPoints: dataPointsZrecorging
			},
			{ 
				type: "line",
				xValueType: "number",
				showInLegend: true,
				name: "You",
				dataPoints: dataPointsZplaying
			}/*,
      { 
				type: "line",
				xValueType: "dateTime",
				showInLegend: true,
				name: "Y",
				dataPoints: dataPointsY
			}*/],
      
      /*legend:{
        cursor:"pointer",
        itemclick : function(e) {
          if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
          }
          else {
            e.dataSeries.visible = true;
          }
          chart.render();
        }
      }*/
		});
    chart.render();    
    setInterval(function() {
      chart.render();
    }, 100);
  });
})(angular);