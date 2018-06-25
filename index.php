<?php
/**
 * Created by PhpStorm.
 * User: info
 * Date: 14/06/2018
 * Time: 11:49
 */

session_start();

define("ROOT",dirname(__FILE__).'/' );

var_dump(__FILE__);
header("Access-Control-Allow-Origin: *");
include './controller/upload/AwsClass.php';

$s3 = new AwsClass();

?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Cropper + Dropzone</title>
    <link rel="stylesheet" href="assets/lib/cropper/cropper.min.css">
    <link rel="stylesheet" href="assets/lib/dropzone/basic.css">
    <link rel="stylesheet" href="assets/lib/dropzone/dropzone.css">
    <link rel="stylesheet" href="assets/lib/font-awesome/css/fontawesome-all.min.css">
    <link rel="stylesheet" href="assets/lib/bootstrap-4.1.1/css/bootstrap.css">
    <link rel="stylesheet" href="assets/css/main.css">
    <style>

        .modal-footer {
            padding: 15px;
            text-align: right;
            border-top: 1px solid #e5e5e5;
            position: absolute;
            top: 0;
            right: 30px;
        }
        .dz-preview{
            text-align: center;
        }

        .dz-default.dz-message {
            height: 100%;
            margin-top: 0;
            margin-bottom: 0;
        }
        .dz-default.dz-message span {
            display: flex;
            align-items: center;
            height: 100%;
            justify-content: center;
        }

        .ratio {
            width: 100vw;
            height: 56.25vw;
        }
    </style>
</head>
<body>
<main>
    <form class="dropzone my-dropzone-container" method="post" enctype="multipart/form-data">
        <div class="fallback">
            <input name="file" type="file">
        </div>
    </form>
    <div id="image">
    </div>
    <?php

    $url = $s3->getFileUploaded('jeandocx7220.png');

    var_dump($url);


    echo "<a href='".$url."'>link</a>";

    $_SESSION['user'] = 'jean';
    echo "<p>". $_SESSION['user']."</p>";
    ?>
</main>


<script src="assets/lib/jquery/jquery-3.3.1.min.js"></script>
<script>
    var image = new Image();
    image.crossOrigin = "Anonymous";
</script>

<script src="assets/lib/bootstrap-4.1.1/js/bootstrap.min.js"></script>
<script src="assets/lib/cropper/cropper.min.js"></script>
<script src="assets/lib/dropzone/new_dropzone.js"></script>

<script src="assets/js/main.js"></script>

</body>
</html>
