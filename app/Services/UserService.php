<?php

namespace App\Services;

use App\Models\User;
use App\Models\ChatMessage;
use App\Models\Notification;
use Illuminate\Support\Facades\Hash;

class UserService
{
    public function updateInfo(User $user, string $username, string|null $biography, int|null $country_id): bool
    {
        return $user->forceFill([
            'username' => $username,
            'biography' => $biography,
            'country_id' => $country_id,
        ])->save();
    }

    public function changePassword(User $user, string $oldPassword, string $newPassword): bool
    {
        if (!Hash::check($oldPassword, $user->password)) {
            return false;
        }

        return $user->forceFill([
            'password' => Hash::make($newPassword),
        ])->save();
    }

    public function setAvatar(User $user, string $filePath, AwsService $awsService): string|null
    {
        $remoteUserFolder = 'tasks' . DIRECTORY_SEPARATOR . $user->id . DIRECTORY_SEPARATOR . basename($filePath);
        $s3UploadResponse = $awsService->uploadImage(
            $filePath,
            $remoteUserFolder
        );

        if ($s3UploadResponse->get('ObjectURL')) {
            return $awsService->getImageUrl($remoteUserFolder);
        }

        return null;
    }

    public function readNotification($notificationId): bool|int
    {
        return Notification::find($notificationId)->update([
            'read' => true
        ]);
    }

    public function readAllNotification(User $user): bool|int
    {
        return Notification::whereUserId($user->id)->update([
            'read' => true
        ]);
    }

    public function readMessage($messageId)
    {
        return ChatMessage::find($messageId)->update([
            'read' => true
        ]);
    }

    public function readAllMessages(array $chatIds, $userId)
    {
        return ChatMessage::whereIn('chat_id', $chatIds)
            ->where('user_id', '<>', $userId)
            ->whereRead(false)
            ->update([
                'read' => true
            ]);
    }

    public function getUnreadMessages(array $chatIds, $userId)
    {
        return ChatMessage::whereIn('chat_id', $chatIds)
            ->where('user_id', '<>', $userId)
            ->whereRead(false)
            ->orderBy('id', 'asc')
            ->get();
    }
}
