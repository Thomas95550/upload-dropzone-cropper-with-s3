<?php
/**
 * Created by PhpStorm.
 * User: info
 * Date: 21/06/2018
 * Time: 17:21
 */

require_once __DIR__.'/../../vendor/autoload.php';

use Aws\S3\S3Client;
use Aws\S3\Exception\S3Exception;

class AwsClass {

    private $bucketName = 'NOMDOSSIER';
    private $IAM_KEY = 'CLEF';
    private $IAM_SECRET = 'CLEF_SECRET';
    private $s3;

    function __construct() {
        $this->s3 = S3Client::factory(
            array(
                'credentials' => array(
                    'key' => $this->IAM_KEY,
                    'secret' => $this->IAM_SECRET
                ),
                'version' => 'latest',
                'region'  => 'eu-west-3'
            )
        );
    }

    public function getFileUploaded($nameFile){
        //Creating a presigned URL
        $cmd = $this->s3->getCommand('GetObject', [
            'Bucket' => $this->bucketName,
            'Key'    => 'uploads/'.$nameFile,
            'ContentType' => '*',
            'Cache-Control' => 'no-cache',
            'response-cache-control' => 'no-cache',
            'StorageClass' => 'REDUCED_REDUNDANCY'
        ]);
        $request = $this->s3->createPresignedRequest($cmd, '+10 minutes');
        // Get the actual presigned-url
        $presignedUrl = (string) $request->getUri();

        return $presignedUrl;
    }

    public function deleteFile($nameFile) {
        $this->s3->deleteObject([
            'Bucket' => $this->bucketName,
            'Key'    => $nameFile
        ]);
    }

    public function uploadFile($nameFile, $urlLocal, $typeFile) {
        $this->s3->putObject(
            array(
                'Bucket'=>$this->bucketName,
                'Key' =>  'uploads/'.$nameFile,
                'SourceFile' => $urlLocal,
                'ContentType' => $typeFile,
                'StorageClass' => 'REDUCED_REDUNDANCY'
            )
        );
        echo 'Uploaded ! function work correctly !';
    }
}