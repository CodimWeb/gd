<?php

namespace App\Console\Commands;

use Exception;
use App\Models\Task;
use App\Models\User;
use GuzzleHttp\Client;
use App\Services\AwsService;
use Illuminate\Console\Command;
use Symfony\Component\HttpFoundation\Response;

class FixS3Images extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'fix:s3-images';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fix expired s3 image url';

    /**
     * Execute the console command.
     */
    public function handle(AwsService $awsService)
    {
        $client = new Client();

        $users = User::whereNotNull('avatar')->get();
        $this->fixUserAvatar($client, $users, $awsService);

        $tasks = Task::whereNotNull('logo')->get();
        $this->fixTaskLogo($client, $tasks, $awsService);
    }

    private function fixUserAvatar(Client $client, $users, AwsService $awsService): void
    {
        /** @var User $user */
        foreach ($users as $user) {
            try {
                $responseStatus = $client->get($user->avatar)->getStatusCode();
            } catch (Exception $exception) {
                $responseStatus = $exception->getCode();
            }

            if ($responseStatus && $responseStatus != Response::HTTP_OK) {
                if ($newUserAvatarUrl = $awsService->updateImageUrl($user->avatar)) {
                    $user->update([
                        'avatar' => $newUserAvatarUrl
                    ]);
                }
            }
        }
    }

    private function fixTaskLogo(Client $client, $tasks, AwsService $awsService): void
    {
        /** @var Task $task */
        foreach ($tasks as $task) {
            try {
                $responseStatus = $client->get($task->logo)->getStatusCode();
            } catch (Exception $exception) {
                $responseStatus = $exception->getCode();
            }

            if ($responseStatus && $responseStatus != Response::HTTP_OK) {
                if ($newTaskLogoUrl = $awsService->updateImageUrl($task->logo)) {
                    $task->update([
                        'logo' => $newTaskLogoUrl
                    ]);
                }
            }
        }
    }
}
