<?php

namespace App\Services;

use App\Models\Chat;
use App\Models\Offer;
use App\Models\ChatMessage;

class ChatService
{
    public function disableRejectedChatsByAcceptedOffer(Offer $acceptedOffer): void
    {
        /** @var Chat[] $chats */
        $chats = Chat::whereTaskId($acceptedOffer->task_id)
            ->where('user_one', '<>', $acceptedOffer->user_id)
            ->where('user_two', '<>', $acceptedOffer->user_id)
            ->get();

        foreach ($chats as $chat) {
            $chat->update([
                'active' => false
            ]);

            $chat->messages()->update([
                'read' => true
            ]);
        }
    }

    public function disableChatByOffer(Offer $offer): void
    {
        /** @var Chat[] $chats */
        $chats = Chat::whereTaskId($offer->task_id)
            ->where(function ($query) use ($offer) {
                $query->where('user_one', '=', $offer->user_id)
                    ->orWhere('user_two', '=', $offer->user_id);
            })->get();

        foreach ($chats as $chat) {
            $chat->update([
                'active' => false
            ]);

            $chat->messages()->update([
                'read' => true
            ]);
        }
    }

    public function addMessage($userId, $chatId, $message)
    {
        if (!$chat = Chat::find($chatId)) {
            return false;
        }

        if ($chat->user_one != $userId && $chat->user_two != $userId) {
            return false;
        }

        return ChatMessage::create([
            'message' => $message,
            'user_id' => $userId,
            'chat_id' => $chatId,
        ]);
    }

    public function getAllUserChats($userId)
    {
        return Chat::where(function ($query) use ($userId) {
            $query->where('user_one', '=', $userId)
                ->orWhere('user_two', '=', $userId);
        })->get();
    }
}
