<?php
$dir = "uploads";    
$allCakesPHP = scandir($dir);
$allCakesJSON = json_encode ($allCakesPHP);
header("Location:index.php");
file_put_contents("allCakesJSON.json", $allCakesJSON);
?>




