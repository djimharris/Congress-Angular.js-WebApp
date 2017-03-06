<?php 
	if (isset($_GET["choice"])) {
		if ($_GET["choice"] == 1) {
			// $api_call = "http://congress.api.sunlightfoundation.com/legislators?per_page=all&apikey=02c8c6f17f4b4ed9a3fe76ad65e669f0";
			// $api_call = "https://d1b10bmlvqabco.cloudfront.net/attach/iq15q6i9gsk1xg/iq9t0onnijc38s/ivbc6aij9d0p/leg.json";
			if ($_GET["subchoice"] == 1){
				$api_call = "http://104.198.0.197:8080/legislators?per_page=all&apikey=02c8c6f17f4b4ed9a3fe76ad65e669f0";
				$legislator_json = file_get_contents($api_call);
				echo $legislator_json; 
			}
			if ($_GET["subchoice"] == 2){
				$api_call = "http://104.198.0.197:8080/committees?member_ids=" . $_GET["id"] . "&per_page=5&apikey=02c8c6f17f4b4ed9a3fe76ad65e669f0";
				$legislator_json = file_get_contents($api_call);
				echo $legislator_json; 
			}

			if ($_GET["subchoice"] == 3){
				$api_call = "http://104.198.0.197:8080/bills?sponsor_id=" . $_GET["id"] . "&order=last_action_at&per_page=5&apikey=02c8c6f17f4b4ed9a3fe76ad65e669f0";
				$legislator_json = file_get_contents($api_call);
				echo $legislator_json;
				// echo $api_call; 
			}
		}
		if ($_GET["choice"] == 2) {
			// $api_call = "http://congress.api.sunlightfoundation.com/legislators?per_page=all&apikey=02c8c6f17f4b4ed9a3fe76ad65e669f0";
			// $api_call = "https://d1b10bmlvqabco.cloudfront.net/attach/iq15q6i9gsk1xg/iq9t0onnijc38s/ivbc6aij9d0p/leg.json";
			if ($_GET["subchoice"] == 1) {	
				$api_call = "http://104.198.0.197:8080/bills?history.active=true&order=last_action_at&last_version.urls.pdf__exists=true&per_page=50&apikey=02c8c6f17f4b4ed9a3fe76ad65e669f0";
				$legislator_json = file_get_contents($api_call);
				echo $legislator_json;
			}
			if ($_GET["subchoice"] == 2) {	
				// $api_call = "http://104.198.0.197:8080/bills?history.active=false&order=last_action_at&per_page=50&apikey=02c8c6f17f4b4ed9a3fe76ad65e669f0";
				$api_call = "http://104.198.0.197:8080/bills?order=introduced_on&last_version.urls.pdf__exists=true&per_page=50&apikey=02c8c6f17f4b4ed9a3fe76ad65e669f0";
				$legislator_json = file_get_contents($api_call);
				echo $legislator_json;
			} 
		}

		if($_GET["choice"] == 3){
			$api_call = "http://104.198.0.197:8080/committees?per_page=all&apikey=02c8c6f17f4b4ed9a3fe76ad65e669f0";
			$legislator_json = file_get_contents($api_call);
			echo $legislator_json;
		}
	}
?>