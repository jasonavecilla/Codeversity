<?php
	$conn = mysqli_connect("localhost", "root", "", "user");
	
	if(!$conn){
		die("Error: Failed to connect to database!");
	}
?>