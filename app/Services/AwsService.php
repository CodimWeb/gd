<?php

namespace App\Services;

use Aws\Result;
use Aws\S3\S3Client;

class AwsService
{
    public function __construct(
        protected S3Client $client,
        private $bucket,
    ) {
    }

    public function uploadImage(string $filePath, string $remoteFilePath): Result
    {
        return $this->client->putObject([
            'Bucket' => $this->bucket,
            'Key' => $remoteFilePath,
            'SourceFile' => $filePath
        ]);
    }

    public function getImageUrl(string $remoteFilePath): string
    {
        $cmd = $this->client->getCommand('GetObject', [
            'Bucket' => $this->bucket,
            'Key' => $remoteFilePath
        ]);

        $request = $this->client->createPresignedRequest($cmd, '+7 days');

        return (string) $request->getUri();
    }

    public function updateImageUrl(string $url): string
    {
        if ($urlParts = pathinfo(parse_url($url,PHP_URL_PATH))) {
            if (!empty($urlParts['dirname'])) {
                $folder = str_replace(
                    DIRECTORY_SEPARATOR . $this->bucket . DIRECTORY_SEPARATOR,
                    '',
                    $urlParts['dirname']
                    );

                if (!empty($urlParts['basename'])) {
                    return $this->getImageUrl($folder . DIRECTORY_SEPARATOR . $urlParts['basename']);
                }
            }
        }

        return '';
    }
}
