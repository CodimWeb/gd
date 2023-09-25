<?php

namespace App\Services;

use App\Models\Task;
use App\Models\User;
use App\Models\Offer;

class TaskService
{
    public function createTask(
        User $user,
        string $name,
        string $description,
        int|null $category_id,
        $logoPath,
        AwsService $awsService
    ): bool|Task
    {
        $activeTasksCount = Task::whereUserId($user->id)
            ->whereIn('status', [Task::STATUS_WAITING, Task::STATUS_IN_PROGRESS])
            ->count();

        if ($activeTasksCount >= Task::COUNT_PER_USER) {
            return false;
        }

        $task = Task::create([
            'name' => $name,
            'description' => $description,
            'category_id' => $category_id,
            'user_id' => $user->id,
            'status' => Task::STATUS_WAITING,
        ]);

        if (!empty($logoPath)) {
            $task->update([
                'logo' => $this->setTaskLogo($task, $logoPath, $awsService)
            ]);
        }

        return $task;
    }

    public function editTask(
        $taskId,
        string $name,
        string $description,
        int|null $category_id,
        string $status,
        $logoPath,
        AwsService $awsService
    ): bool|Task
    {
        $task = Task::find($taskId);
        if (!$task) {
            return false;
        }

        $task->update([
            'name' => $name,
            'description' => $description,
            'category_id' => $category_id,
            'status' => $status,
        ]);

        if (!empty($logoPath)) {
            $task->update([
                'logo' => $this->setTaskLogo($task, $logoPath, $awsService)
            ]);
        }

        return $task;
    }

    public function setTaskLogo(Task $task, string $filePath, AwsService $awsService): string|null
    {
        $remoteTaskFolder = 'tasks' . DIRECTORY_SEPARATOR . $task->id . DIRECTORY_SEPARATOR . basename($filePath);
        $s3UploadResponse = $awsService->uploadImage(
            $filePath,
            $remoteTaskFolder
        );

        if ($s3UploadResponse->get('ObjectURL')) {
            return $awsService->getImageUrl($remoteTaskFolder);
        }

        return null;
    }

    public function changeStatus($userId, $taskId, string $status)
    {
        return Task::find($taskId)->update(
            [
                'status' => $status,
                'updated_by' => $userId,
            ]
        );
    }

    public function addOffer($taskId, $userId)
    {
        return Offer::create([
            'user_id' => $userId,
            'task_id' => $taskId,
            'status' => Offer::STATUS_NEW,
        ]);
    }

    public function changeOfferStatus($offerId, string $status)
    {
        return Offer::find($offerId)->update(
            [
                'status' => $status,
            ]
        );
    }
}
