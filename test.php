<?php
$dir = "uploads";    
$allCakesPHP = scandir($dir);

$allCakesJSON = json_encode ($allCakesPHP);

file_put_contents("allCakesJSON.json", $allCakesJSON);


$currentlySelectedCake = $_POST["currentlySelectedCake"];


$cakesElementPath = "uploads/" . $currentlySelectedCake; 
$currentCakeElements = scandir($cakesElementPath);
file_put_contents("currentCakeElements.json", json_encode ($currentCakeElements));


?>




