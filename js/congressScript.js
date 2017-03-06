var app = angular.module('congress',['ngAnimate','ngRoute','ui.bootstrap','ngSanitize','ngStorage','angularUtils.directives.dirPagination']);

app.config(['$locationProvider','$routeProvider',
    function config($locationProvider, $routeProvider) {
    	// $locationProvider.hashPrefix('!');
      $routeProvider.
        when('/home', {
        	templateUrl: 'views/legislators.html',
            controller: "legisCtrl"
        })
        .when('/legis', {
        	templateUrl: 'views/legislators.html',
        	controller: "legisCtrl"
        })
        .when('/bills', {
        	templateUrl: 'views/bills.html',
        	controller: "billsCtrl"
        })
        .when('/committees', {
        	templateUrl: 'views/committees.html',
        	controller: "commCtrl"
        })
        .when('/favourites', {
        	templateUrl: 'views/favourites.html',
        	controller: "favourCtrl"
        })
        .otherwise({
        	redirectTo: '/home'
        });
    }
]);



app.filter('toNameCase', function() {
    return function(input) {
      return (!!input) ? " " + input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});

app.controller("controls",function($scope, $http, $localStorage){
	$scope.slide = true;
	$scope.slidein = "col-xs-12";
	$scope.slideout = "col-xs-offset-1 col-xs-11 col-sm-offset-2 col-sm-10 main";
	$scope.slideClass = $scope.slideout;
	$scope.menu = function(){
		if($scope.slide == true){
			$scope.slideClass = $scope.slidein;
			$scope.sliderClass = "";
			$scope.slide = false;
		}
		else{
			$scope.slideClass = $scope.slideout;
			$scope.slide = true;	
		}
	}
    if($localStorage.legis == null){
        $localStorage.legis = [];
    }
    // else{
    //     alert($localStorage.legis);
    // }
    if($localStorage.bills == null){
        $localStorage.bills = [];
    }
    // else{
    //     alert($localStorage.bills);
    // }
    if($localStorage.comms == null){
        $localStorage.comms = [];
    }
    // else{
    //     alert($localStorage.comms);
    // }	
});

app.controller('legisCtrl', function($http, $scope, $localStorage) {
	 // $scope.myInterval = 5000;
	 // $scope.noWrapSlides = false;
	 // $scope.active = 0;
     $scope.legisTab = 1;
     $scope.favoriteClass = "fa fa-star-o";
     $scope.favoriteClassMark = "fa fa-star iconYellow";
     // $scope.legisTab2 = false;
	

	$http.get("congressCall.php?choice=1&subchoice=1")
    .then(function(response) {
    	$scope.total = response.data.results.length;
    	$.each(response.data.results, function(i,d){

    	});
        $scope.data = response.data.results;
        $scope.arr = [];
        $.each(response.data.results, function(i,d){
        	// console.log(d.state_name);
        	if($scope.arr.indexOf(d.state_name) == -1){
        		$scope.arr.push(d.state_name);
        	}
    	});
        // for(runner in $scope.data){
        // 	console.log(runner["state_name"]);
        // 	if(arr.indexOf(runner.state_name) == -1){
        // 		arr.push(runner.state_name);
        // 		console.log(runner.state_name);
        // 	}
        // }
        $scope.arr.sort();
        $scope.arr.splice(0, 0, "All States");
        $scope.populate();
    });
    $scope.partyurl = function(party){
    	if(party == 'D'){
    		return "http://cs-server.usc.edu:45678/hw/hw8/images/d.png";
    	}
    	if(party == 'R'){
    		return "http://cs-server.usc.edu:45678/hw/hw8/images/r.png"
    	}
    	return "http://independentamericanparty.org/wp-content/themes/v/images/logo-american-heritage-academy.png"
    }
    $scope.chamberurl = function(chamber){
    	if(chamber == "house"){
    		return "http://cs-server.usc.edu:45678/hw/hw8/images/h.png";
    	}
    	return "http://cs-server.usc.edu:45678/hw/hw8/images/s.svg";
    }

    $scope.populate = function(){
    	$scope.stateNames = $scope.arr;
    	$scope.statefiltertext = $scope.stateNames[0];
    	// alert($scope.arr);
    }

    // $scope.stateNames = [
    // 	"All States", "Arizona", "Arkansas"
    // ];
    // alert($scope.arr);
    $scope.stateNames = $scope.arr;
 	// $scope.statefiltertext = $scope.stateNames[0];
    // $scope.$watch( 'stateFilterText',
    //         function(newValue, oldValue){
    //             $scope.$apply();
    //             console.log(newValue);
    //         }
    // );

    $scope.stateChange = function(input){
    	// $scope.$apply();
    	$scope.statefiltertext = input;
        // console.log("**" + $scope.statefiltertext);
    };

    $scope.stateDefault = function(input){
    	if(input == "All States"){
    		return "selected='selected'";
    	}
    	return "";
    };
    

    $scope.stateFilter = function(input) {
    	// console.log(input.state_name + "*" + $scope.statefiltertext);
    	if($scope.statefiltertext == "All States"){
    		return true;
    	}
    	return input.state_name == $scope.statefiltertext;
	};

	$scope.chamberHouse = function(input){
		return input.chamber == "house";
	}

	$scope.chamberSenate = function(input){
		return input.chamber == "senate";
	}

    $scope.legisChangeTab = function(){
        if($scope.legisTab == 1){
            $scope.legisTab = 2;
            // $scope.legisTab2 = true;
        }
        else{
            $scope.legisTab = 1;
            // $scope.legisTab2 = false;
        }
    }

    // var $scope.tempBills;
    // var $scope.tempComm;

    $scope.setTempLegis = function(input){
        $scope.temp = input;
        $scope.temp.favoriteClass = $scope.favoriteClass;
        $scope.temp.favorite = 0;
        for(i = 0; i < $localStorage.legis.length; i ++){
            if ($localStorage.legis[i].bioguide_id == $scope.temp.bioguide_id) {
                $scope.temp.favoriteClass = $scope.favoriteClassMark;
                $scope.temp.favorite = 1;
            }
        }

        $http.get("congressCall.php?choice=1&subchoice=2&id=" + input.bioguide_id)
    .then(function(response) {
            $scope.totaltempComm = response.data.results.length;
            $.each(response.data.results, function(i,d){

            });
            $scope.tempComm = response.data.results;
            // alert($scope.tempComm);
        });

        $http.get("congressCall.php?choice=1&subchoice=3&id=" + input.bioguide_id)
    .then(function(response) {
        // alert(response.data);
            // $scope.totaltempBills = response.data.results.length;
            $.each(response.data.results, function(i,d){

            });
            $scope.tempBills = response.data.results;
            // alert($scope.tempBills);
        });


    }

    $scope.legisImage = function(input){
        return "https://theunitedstates.io/images/congress/original/" + input + ".jpg";
    }

    $scope.getDistrict = function(input){
        if (input === null){
            return "NA";
        }
        else{
            return "District " + input;
        }
    }

    $scope.getParty = function(input){
        if (input == "R") {
            return "Republican";
        }
        if (input == "D"){
            return "Democrat";
        }
        return "Independent";
    }

    $scope.checkTwitter = function(input){
        if(input.twitter_id == null){
            return false;
        }
        return true;
    }

    $scope.checkFacebook = function(input){
        if(input.facebook_id == null){
            return false
        }
        return true;
    }

    $scope.checkWeb = function(input){
        if (input.website == null) {
            return false;
        }
        return true;
    }

    $scope.favoriteClick = function(){
        if($scope.temp.favorite == 1){
            // alert("Check 1");
            $scope.temp.favoriteClass = $scope.favoriteClass;
             for(i = 0; i < $localStorage.legis.length; i ++){
                if ($localStorage.legis[i].bioguide_id == $scope.temp.bioguide_id) {
                    $localStorage.legis.splice(i,1);
                    // alert("Check 2");   
                }
            }
            $scope.temp.favorite = 0;

        }
        else{
            $scope.temp.favoriteClass = $scope.favoriteClassMark;
            $scope.temp.favorite = 1;
            $localStorage.legis.push($scope.temp);
            // alert("OK");
        }
        // alert($scope.temp.favoriteClass);
    }

    $scope.getTerm = function(input){
        var dateNow = ((new Date()).getFullYear()) + "/" + ((new Date()).getMonth() + 1) + "/" + ((new Date()).getDate());
        var curr = Date.parse(dateNow) - Date.parse(input.term_start);
        var total = Date.parse(input.term_end) - Date.parse(input.term_start);
        return Math.floor(curr * 100/total);
    }

    $scope.getBirthDate = function(input){
        // alert(input);
        var date = new Date(input);
        date.setDate(date.getDate() + 1);
        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return monthNames[date.getMonth()] + " " + (date.getDate()) + ", " + date.getFullYear();
    }

    // $scope.getTemp = function(input){
    //     going = datediff("day", input.term_start, );
    //     return term;
    // }

	// $scope.activeChange = function(){
	// 	if($scope.active === 0){
	// 		$scope.active = 1;
	// 	}
	// 	else{
	// 		$scope.active = 0;
	// 	}
	// }
    
  //   $scope.tabs = [
  //   { title:'Dynamic Title 1', content:'Dynamic content 1' },
  //   { title:'Dynamic Title 2', content:'Dynamic content 2', disabled: true }
  // ];
  // $scope.model = {
  //   name: 'Tabs'
  // };
});

app.controller("billsCtrl",function($scope, $http, $sce, $localStorage){
    $scope.billsTab = 1;
    // $scope.favoriteClass = "fa fa-star-o";
    $scope.pdfLink = "";
    // $scope.billTrial = "false";
     $scope.favoriteClass = "fa fa-star-o";
     $scope.favoriteClassMark = "fa fa-star iconYellow";

    $http.get("congressCall.php?choice=2&subchoice=1")
    .then(function(response) {
        $scope.totalActive = response.data.results.length;
        $.each(response.data.results, function(i,d){

        });
        $scope.dataActive = response.data.results;

    });

     $http.get("congressCall.php?choice=2&subchoice=2")
    .then(function(response) {
        $scope.totalPassive = response.data.results.length;
        $.each(response.data.results, function(i,d){

        });
        $scope.dataPassive = response.data.results;
    });

        $scope.chamberurl = function(chamber){
            if(chamber == "house"){
                return "http://cs-server.usc.edu:45678/hw/hw8/images/h.png";
            }
            return "http://cs-server.usc.edu:45678/hw/hw8/images/s.svg";
        }

        $scope.setTempBills = function(input){
            $scope.temp = input;
            $scope.temp.favoriteClass = $scope.favoriteClass;
            $scope.temp.favorite = 0;
            for(i = 0; i < $localStorage.bills.length; i ++){
                if ($localStorage.bills[i].bill_id == $scope.temp.bill_id) {
                    $scope.temp.favoriteClass = $scope.favoriteClassMark;
                    $scope.temp.favorite = 1;
                }
            }
            // $scope.pdfLink = $sce.trustAsResourceUrl($scope.temp.last_version.urls.pdf);
            // $scope.billTrial = "true";
            // alert($scope.pdfLink);
        }

        $scope.billsChangeTab = function(input){


        if($scope.billsTab == 1){
            $scope.pdfLink = input.last_version.urls.pdf;
            $scope.billsTab = 2;
            // $scope.legisTab2 = true;
        }
        else{
            $scope.billsTab = 1;
            // $scope.legisTab2 = false;
        }

        $scope.getStatus = function(input){
            if (input.history.active == true){
                return "Active";
            }
            return "New";
        }

        $scope.getPdfLink = function(){
            return $scope.temp.last_version.urls.pdf;
        }

        $scope.favoriteClick = function(){
            if($scope.temp.favorite == 1){
                // alert("Check 1");
                $scope.temp.favoriteClass = $scope.favoriteClass;
                 for(i = 0; i < $localStorage.bills.length; i ++){
                    if ($localStorage.bills[i].bill_id == $scope.temp.bill_id) {
                        $localStorage.bills.splice(i,1);
                        // alert("Check 2");   
                    }
                }
                $scope.temp.favorite = 0;

            }
            else{
                $scope.temp.favoriteClass = $scope.favoriteClassMark;
                $scope.temp.favorite = 1;
                $localStorage.bills.push($scope.temp);
                // alert("OK");
            }
            // alert($scope.temp.favoriteClass);
        }

        $scope.htmlEmbed = $sce.trustAsHtml("<object class='col-xs-12' height='450px' data='" + $scope.pdfLink  + "''></object>");
        // alert($scope.billsTab);
    }
        
    
});

app.controller("commCtrl",function($scope, $http, $localStorage){
    $scope.billsTab = 1;
    // $scope.favoriteClass = "fa fa-star-o";
    $scope.favoriteClass = "fa fa-star-o";
    $scope.favoriteClassMark = "fa fa-star iconYellow";


    $http.get("congressCall.php?choice=3")
    .then(function(response) {
        $scope.totalComm = response.data.results.length;
        $.each(response.data.results, function(i,d){

        });
        $scope.dataComm = response.data.results;

    });

    $scope.chamberurl = function(chamber){
            if(chamber == "house"){
                return "http://cs-server.usc.edu:45678/hw/hw8/images/h.png";
            }
            return "http://cs-server.usc.edu:45678/hw/hw8/images/s.svg";
        }

    $scope.getOffice = function(input){
        if(input == null){
            return "NA";
        }
        return input;
    }

    $scope.getFavoriteClass = function(input){
            for(i = 0; i < $localStorage.comms.length; i ++){
                if ($localStorage.comms[i].committee_id == input.committee_id) {
                    return $scope.favoriteClassMark;
                }
            }
            return $scope.favoriteClass;
    }

    $scope.favoriteClick = function(input){
        $scope.flag = 0;
        for(i = 0; i < $localStorage.comms.length; i ++){
                if ($localStorage.comms[i].committee_id == input.committee_id) {
                    $scope.flag = 1;
                    $localStorage.comms.splice(i,1);
                }
            }
        if ($scope.flag == 0) {
            $localStorage.comms.push(input);
        }
    }

    $scope.chamberHouse = function(input){
        return input.chamber == "house";
    }

    $scope.chamberSenate = function(input){
        return input.chamber == "senate";
    }

    $scope.chamberJoint = function(input){
        return input.chamber == "joint";
    }
});

app.controller("favourCtrl",function($scope, $http, $sce, $localStorage){
    $scope.tabset = 1;
    $scope.favLegis = $localStorage.legis;
    $scope.favBills = $localStorage.bills;
    $scope.favComms = $localStorage.comms;
    $scope.pdfLink2 = "";
    $scope.favoriteClass = "fa fa-star-o";
    $scope.favoriteClassMark = "fa fa-star iconYellow";

    $scope.partyurl = function(party){
        if(party == 'D'){
            return "http://cs-server.usc.edu:45678/hw/hw8/images/d.png";
        }
        if(party == 'R'){
            return "http://cs-server.usc.edu:45678/hw/hw8/images/r.png"
        }
        return "http://independentamericanparty.org/wp-content/themes/v/images/logo-american-heritage-academy.png"
    }

    $scope.chamberurl = function(chamber){
            if(chamber == "house"){
                return "http://cs-server.usc.edu:45678/hw/hw8/images/h.png";
            }
            return "http://cs-server.usc.edu:45678/hw/hw8/images/s.svg";
        }

    $scope.legisImage = function(input){
        return "https://theunitedstates.io/images/congress/original/" + input + ".jpg";
    }

    $scope.setTempLegis = function(input){
        $scope.temp = input;
        $scope.temp.favoriteClass = $scope.favoriteClass;
        $scope.temp.favorite = 0;
        for(i = 0; i < $localStorage.legis.length; i ++){
            if ($localStorage.legis[i].bioguide_id == $scope.temp.bioguide_id) {
                $scope.temp.favoriteClass = $scope.favoriteClassMark;
                $scope.temp.favorite = 1;
            }
        }

        $http.get("congressCall.php?choice=1&subchoice=2&id=" + input.bioguide_id)
    .then(function(response) {
            $scope.totaltempComm = response.data.results.length;
            $.each(response.data.results, function(i,d){

            });
            $scope.tempComm = response.data.results;
            // alert($scope.tempComm);
        });

        $http.get("congressCall.php?choice=1&subchoice=3&id=" + input.bioguide_id)
    .then(function(response) {
        // alert(response.data);
            // $scope.totaltempBills = response.data.results.length;
            $.each(response.data.results, function(i,d){

            });
            $scope.tempBills = response.data.results;
            // alert($scope.tempBills);
        });


    }

    $scope.getParty = function(input){
        if (input == "R") {
            return "Republican";
        }
        if (input == "D"){
            return "Democrat";
        }
        return "Independent";
    }

    $scope.checkTwitter = function(input){
        if(input.twitter_id == null){
            return false;
        }
        return true;
    }

    $scope.checkFacebook = function(input){
        if(input.facebook_id == null){
            return false
        }
        return true;
    }

    $scope.checkWeb = function(input){
        if (input.website == null) {
            return false;
        }
        return true;
    }

    $scope.favoriteLegisClick = function(){
        if($scope.temp.favorite == 1){
            // alert("Check 1");
            $scope.temp.favoriteClass = $scope.favoriteClass;
             for(i = 0; i < $localStorage.legis.length; i ++){
                if ($localStorage.legis[i].bioguide_id == $scope.temp.bioguide_id) {
                    $localStorage.legis.splice(i,1);
                    // alert("Check 2");   
                }
            }
            $scope.temp.favorite = 0;

        }
        else{
            $scope.temp.favoriteClass = $scope.favoriteClassMark;
            $scope.temp.favorite = 1;
            $localStorage.legis.push($scope.temp);
            // alert("OK");
        }
        // alert($scope.temp.favoriteClass);
    }

    $scope.getTerm = function(input){
        var dateNow = ((new Date()).getFullYear()) + "/" + ((new Date()).getMonth() + 1) + "/" + ((new Date()).getDate());
        var curr = Date.parse(dateNow) - Date.parse(input.term_start);
        var total = Date.parse(input.term_end) - Date.parse(input.term_start);
        return Math.floor(curr * 100/total);
    }

    $scope.getBirthDate = function(input){
        // alert(input);
        var date = new Date(input);
        date.setDate(date.getDate() + 1);
        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return monthNames[date.getMonth()] + " " + (date.getDate()) + ", " + date.getFullYear();
    }

    $scope.legisChangeTab = function(){
        $scope.tabset = 2;
    }

    $scope.billsChangeTab = function(input){
        $scope.pdfLink2 = input.last_version.urls.pdf;
        // $scope.htmlEmbed2 = $sce.trustAsHtml("<embed ng-src='" + $scope.pdfLink2 + "'' type='application/pdf'></embed>");
        $scope.htmlEmbed2 = $sce.trustAsHtml("<object class='col-xs-12' height='450px' data='" + $scope.getPdf2Link()  + "'></object>");
        // alert($scope.pdfLink2);
        $scope.tabset = 3;
    }

    $scope.setTempBills = function(input){
            $scope.temp = input;
            $scope.temp.favoriteClass = $scope.favoriteClass;
            $scope.temp.favorite = 0;
            for(i = 0; i < $localStorage.bills.length; i ++){
                if ($localStorage.bills[i].bill_id == $scope.temp.bill_id) {
                    $scope.temp.favoriteClass = $scope.favoriteClassMark;
                    $scope.temp.favorite = 1;
                }
            }
            // $scope.pdfLink = $sce.trustAsResourceUrl($scope.temp.last_version.urls.pdf);
            // $scope.billTrial = "true";
            // alert($scope.pdfLink);
        }

        $scope.favoriteBillClick = function(){
            if($scope.temp.favorite == 1){
                // alert("Check 1");
                $scope.temp.favoriteClass = $scope.favoriteClass;
                 for(i = 0; i < $localStorage.bills.length; i ++){
                    if ($localStorage.bills[i].bill_id == $scope.temp.bill_id) {
                        $localStorage.bills.splice(i,1);
                        // alert("Check 2");   
                    }
                }
                $scope.temp.favorite = 0;

            }
            else{
                $scope.temp.favoriteClass = $scope.favoriteClassMark;
                $scope.temp.favorite = 1;
                $localStorage.bills.push($scope.temp);
                // alert("OK");
            }
            // alert($scope.temp.favoriteClass);
        }

        $scope.getPdf2Link = function(){
            //return $scope.temp.last_version.urls.pdf;
            return $scope.pdfLink2;
        }

        // $scope.htmlEmbed2 = $sce.trustAsHtml("<object class='col-xs-12' height='450px' data='" + $scope.pdfLink2  + "'></object>");
        // $scope.htmlEmbed2 = $sce.trustAsHtml("<embed ng-src='" + $scope.getPdf2Link() + "'' type='application/pdf'></embed>");
        // $scope.htmlEmbed2 = $sce.trustAsHtml("<object class='col-xs-12' height='450px' data='" + $scope.getPdf2Link()  + "'></object>");

    $scope.resetTab = function(){
        $scope.tabset = 1;
    }

    $scope.removeLegis = function(input){
        for(i = 0; i < $localStorage.legis.length; i ++){
            if($localStorage.legis[i].bioguide_id == input.bioguide_id){
                $localStorage.legis.splice(i,1);
            }
        }
    }

    $scope.removeBill = function(input){
        for(i = 0; i < $localStorage.bills.length; i ++){
            if($localStorage.bills[i].bill_id == input.bill_id){
                $localStorage.bills.splice(i,1);
            }
        }
    }

    $scope.removeComm = function(input){
        for(i = 0; i < $localStorage.comms.length; i ++){
            if($localStorage.comms[i].committee_id == input.committee_id){
                $localStorage.comms.splice(i,1);
            }
        }
    }

});