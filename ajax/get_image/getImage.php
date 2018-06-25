<?php
/**
 * Created by PhpStorm.
 * User: info
 * Date: 22/06/2018
 * Time: 15:18
 */
require_once '../../controller/upload/AwsClass.php';

$s3 = new AwsClass();


echo $s3->getFileUploaded($_POST['imageName']);