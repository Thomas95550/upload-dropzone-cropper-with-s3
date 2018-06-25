<?php
/**
 * Created by PhpStorm.
 * User: info
 * Date: 13/06/2018
 * Time: 17:58
 */
session_start();

if(!empty($_SESSION['user'])){
    $user = $_SESSION['user'];
}

if(strstr($_POST['imageId'], $user)){
    $name_file = $_POST['imageId'];
} else {
    $name_file = $user.$_POST['imageId'];
}


$name_file = str_replace('-', '', $name_file);
$name_file = str_replace('_', '', $name_file);

$mysqli = new mysqli("localhost:3306", "root", "", "trashdata");
$sql = "SELECT name_file FROM file_upload WHERE name_file = '$name_file' and user_name='$user'";
$result = $mysqli->query($sql);
$result = $result->fetch_all(PDO::FETCH_ASSOC);

if(empty($result)){
    echo $name_file;
    exit();
}
foreach  ($result as $row) {
    foreach ($row as $k => $v) {
        if($v === $name_file){
            $name_file = explode('.',$name_file);
            $name_file = $name_file[0] . rand(). '.'. $name_file[1];
            echo $name_file;
            exit();
        }
    }
}
