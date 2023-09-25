<?php

namespace App\Providers;

use Aws\S3\S3Client;
use App\Services\AwsService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(AwsService::class, function () {
            return new AwsService(
                new S3Client([
                    'version' => 'latest',
                    'region'  => config('filesystems.disks.minio.region'),
                    'endpoint' => config('filesystems.disks.minio.endpoint'),
                    'use_path_style_endpoint' => true,
                    'credentials' => [
                        'key'    => config('filesystems.disks.minio.key'),
                        'secret' => config('filesystems.disks.minio.secret'),
                    ],
                ]),
                config('filesystems.disks.minio.bucket'),
            );
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
