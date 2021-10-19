<?php
$dir = "uploads";    
$allCakesPHP = scandir($dir);
/* unset($allCakesPHP[0]);
unset($allCakesPHP[1]); */
$allCakesJSON = json_encode ($allCakesPHP);
header("Location:index.html");
file_put_contents("allCakesJSON.json", $allCakesJSON);
?>




